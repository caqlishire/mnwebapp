import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { brand } from "@/lib/brand";

type ReferralPayload = {
  submitterName?: string;
  submitterRoleAgency?: string;
  submitterEmail?: string;
  submitterPhone?: string;
  preferredContact?: string;
  applicantFullName?: string;
  preferredName?: string;
  pronouns?: string;
  dateOfBirth?: string;
  county?: string;
  currentSetting?: string;
  guardianName?: string;
  guardianContact?: string;
  urgency?: string;
  supportNeeds?: string[];
  needsSummary?: string;
  electronicSignature?: string;
  signatureDate?: string;
  supportPlanFileName?: string;
  privacyAcknowledgement?: boolean;
  website?: string;
};

type ParsedReferralRequest = {
  payload: ReferralPayload;
  supportPlan?: {
    filename: string;
    content: Buffer;
    contentType?: string;
  };
};

const recipientEmail =
  process.env.REFERRAL_TO_EMAIL ?? brand.email;

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (transporter) {
    return transporter;
  }

  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = Number(process.env.SMTP_PORT ?? 587);

  if (!host || !user || !pass) {
    throw new Error(
      "Email delivery is not configured. Please set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and SMTP_FROM.",
    );
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  return transporter;
}

export async function POST(request: Request) {
  let parsedRequest: ParsedReferralRequest;

  try {
    parsedRequest = await parseReferralRequest(request);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Invalid referral submission.",
      },
      { status: 400 },
    );
  }

  const { payload, supportPlan } = parsedRequest;

  if (payload.website) {
    return NextResponse.json({
      message: "Thank you. Your referral inquiry has been received.",
    });
  }

  const validationError = validateReferral(payload);
  if (validationError) {
    return NextResponse.json({ message: validationError }, { status: 400 });
  }

  try {
    await getTransporter().sendMail({
      to: recipientEmail,
      from: process.env.SMTP_FROM ?? process.env.SMTP_USER,
      replyTo: payload.submitterEmail,
      subject: `New CRS referral inquiry: ${cleanText(payload.applicantFullName)}`,
      text: buildTextEmail(payload),
      html: buildHtmlEmail(payload),
      attachments: supportPlan
        ? [
            {
              filename: supportPlan.filename,
              content: supportPlan.content,
              contentType: supportPlan.contentType,
            },
          ]
        : undefined,
    });

    return NextResponse.json({
      message:
        `Thank you. Your referral inquiry has been sent to ${brand.name}.`,
    });
  } catch (error) {
    console.error("Referral email failed", error);
    return NextResponse.json(
      {
        message:
          `The form could not send right now. Please call ${brand.phone} or email ${brand.email}.`,
      },
      { status: 503 },
    );
  }
}

async function parseReferralRequest(
  request: Request,
): Promise<ParsedReferralRequest> {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const payload: ReferralPayload = {
      submitterName: getString(formData, "submitterName"),
      submitterRoleAgency: getString(formData, "submitterRoleAgency"),
      submitterEmail: getString(formData, "submitterEmail"),
      submitterPhone: getString(formData, "submitterPhone"),
      preferredContact: getString(formData, "preferredContact"),
      applicantFullName: getString(formData, "applicantFullName"),
      preferredName: getString(formData, "preferredName"),
      pronouns: getString(formData, "pronouns"),
      dateOfBirth: getString(formData, "dateOfBirth"),
      county: getString(formData, "county"),
      currentSetting: getString(formData, "currentSetting"),
      guardianName: getString(formData, "guardianName"),
      guardianContact: getString(formData, "guardianContact"),
      urgency: getString(formData, "urgency"),
      supportNeeds: getStringArray(formData, "supportNeeds"),
      needsSummary: getString(formData, "needsSummary"),
      electronicSignature: getString(formData, "electronicSignature"),
      signatureDate: getString(formData, "signatureDate"),
      privacyAcknowledgement:
        getString(formData, "privacyAcknowledgement") === "true",
      website: getString(formData, "website"),
    };

    const file = formData.get("supportPlan");
    if (file instanceof File && file.size > 0) {
      const supportPlan = await parseSupportPlanFile(file);
      payload.supportPlanFileName = supportPlan.filename;
      return { payload, supportPlan };
    }

    return { payload };
  }

  return { payload: (await request.json()) as ReferralPayload };
}

function validateReferral(payload: ReferralPayload) {
  const requiredFields: Array<[keyof ReferralPayload, string]> = [
    ["submitterName", "Submitter full name is required."],
    ["submitterRoleAgency", "Role or agency is required."],
    ["submitterEmail", "Submitter email is required."],
    ["submitterPhone", "Submitter phone number is required."],
    ["applicantFullName", "Applicant full name is required."],
    ["county", "County of financial responsibility is required."],
    ["needsSummary", "A brief description of needs is required."],
    ["electronicSignature", "Electronic signature is required."],
    ["signatureDate", "Signature date is required."],
  ];

  for (const [field, message] of requiredFields) {
    if (!cleanText(payload[field]).trim()) {
      return message;
    }
  }

  if (!payload.privacyAcknowledgement) {
    return "Please acknowledge the referral privacy notice.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanText(payload.submitterEmail))) {
    return "Please enter a valid submitter email address.";
  }

  return null;
}

function buildTextEmail(payload: ReferralPayload) {
  return [
    "New CRS Referral Inquiry",
    "",
    "Submitter Information",
    `Name: ${cleanText(payload.submitterName)}`,
    `Role / Agency: ${cleanText(payload.submitterRoleAgency)}`,
    `Email: ${cleanText(payload.submitterEmail)}`,
    `Phone: ${cleanText(payload.submitterPhone)}`,
    `Preferred Contact: ${cleanText(payload.preferredContact)}`,
    "",
    "Applicant Information",
    `Full Name: ${cleanText(payload.applicantFullName)}`,
    `Preferred Name: ${cleanText(payload.preferredName)}`,
    `Pronouns: ${cleanText(payload.pronouns)}`,
    `Date of Birth: ${cleanText(payload.dateOfBirth)}`,
    `County: ${cleanText(payload.county)}`,
    `Current Setting: ${cleanText(payload.currentSetting)}`,
    "",
    "Guardian / Representative",
    `Name: ${cleanText(payload.guardianName)}`,
    `Contact: ${cleanText(payload.guardianContact)}`,
    "",
    "Services and Support Needs",
    `Urgency: ${cleanText(payload.urgency)}`,
    `Services Requested: ${(payload.supportNeeds ?? []).map(cleanText).join(", ") || "Not specified"}`,
    `Support Plan / CSSP File: ${cleanText(payload.supportPlanFileName) || "Not uploaded"}`,
    `Electronic Signature: ${cleanText(payload.electronicSignature)}`,
    `Signature Date: ${cleanText(payload.signatureDate)}`,
    "",
    "Needs Summary",
    cleanText(payload.needsSummary),
  ].join("\n");
}

function buildHtmlEmail(payload: ReferralPayload) {
  const rows: Array<[string, unknown]> = [
    ["Submitter name", payload.submitterName],
    ["Role / agency", payload.submitterRoleAgency],
    ["Submitter email", payload.submitterEmail],
    ["Submitter phone", payload.submitterPhone],
    ["Preferred contact", payload.preferredContact],
    ["Applicant full name", payload.applicantFullName],
    ["Preferred name", payload.preferredName],
    ["Preferred pronouns", payload.pronouns],
    ["Date of birth", payload.dateOfBirth],
    ["County", payload.county],
    ["Current setting", payload.currentSetting],
    ["Guardian / representative", payload.guardianName],
    ["Guardian contact", payload.guardianContact],
    ["Urgency", payload.urgency],
    ["Services requested", (payload.supportNeeds ?? []).join(", ")],
    ["Support Plan / CSSP file", payload.supportPlanFileName],
    ["Electronic signature", payload.electronicSignature],
    ["Signature date", payload.signatureDate],
    ["Needs summary", payload.needsSummary],
  ];

  return `
    <div style="font-family: Arial, sans-serif; color: #171717; line-height: 1.6;">
      <h1 style="color: #be123c;">New CRS Referral Inquiry</h1>
      <p>A new referral inquiry was submitted through the ${brand.name} website.</p>
      <table cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%;">
        ${rows
          .map(
            ([label, value]) => `
              <tr>
                <th align="left" style="border: 1px solid #cbd5e1; background: #f1f5f9; width: 220px;">${escapeHtml(label)}</th>
                <td style="border: 1px solid #cbd5e1;">${escapeHtml(cleanText(value)) || "Not provided"}</td>
              </tr>
            `,
          )
          .join("")}
      </table>
    </div>
  `;
}

function cleanText(value: unknown) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().slice(0, 4000);
}

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function getStringArray(formData: FormData, key: string) {
  const value = getString(formData, key);
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

async function parseSupportPlanFile(file: File) {
  const maxFileSize = 10 * 1024 * 1024;
  const allowedTypes = new Set([
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/png",
    "image/jpeg",
    "text/plain",
  ]);

  if (file.size > maxFileSize) {
    throw new Error("Support Plan / CSSP upload must be 10 MB or smaller.");
  }

  if (file.type && !allowedTypes.has(file.type)) {
    throw new Error(
      "Support Plan / CSSP upload must be a PDF, Word document, image, or text file.",
    );
  }

  return {
    filename: sanitizeFilename(file.name || "support-plan"),
    content: Buffer.from(await file.arrayBuffer()),
    contentType: file.type || undefined,
  };
}

function sanitizeFilename(filename: string) {
  return filename.replaceAll(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120);
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
