"use client";

import { FormEvent, useMemo, useRef, useState } from "react";
import { CheckCircle2, FileUp, Loader2, ShieldCheck } from "lucide-react";
import { brand } from "@/lib/brand";

const supportOptions = [
  "Community Residential Services",
  "245D waiver services",
];

const urgencyOptions = [
  "Immediate opening needed",
  "Within 30 days",
  "Within 60-90 days",
  "Exploring options",
];

const initialForm = {
  submitterName: "",
  submitterRoleAgency: "",
  submitterEmail: "",
  submitterPhone: "",
  preferredContact: "Phone",
  applicantFullName: "",
  preferredName: "",
  pronouns: "",
  dateOfBirth: "",
  county: "",
  currentSetting: "",
  guardianName: "",
  guardianContact: "",
  urgency: "Exploring options",
  supportNeeds: [] as string[],
  needsSummary: "",
  electronicSignature: "",
  signatureDate: "",
  privacyAcknowledgement: false,
  website: "",
};

type ReferralFormState = typeof initialForm;

type SubmissionState = {
  type: "idle" | "success" | "error";
  message: string;
};

export function ReferralForm() {
  const [form, setForm] = useState<ReferralFormState>(initialForm);
  const [supportPlanFile, setSupportPlanFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [submission, setSubmission] = useState<SubmissionState>({
    type: "idle",
    message: "",
  });

  const canSubmit = useMemo(
    () =>
      form.submitterName.trim() &&
      form.submitterRoleAgency.trim() &&
      form.submitterEmail.trim() &&
      form.submitterPhone.trim() &&
      form.applicantFullName.trim() &&
      form.county.trim() &&
      form.needsSummary.trim() &&
      form.electronicSignature.trim() &&
      form.signatureDate.trim() &&
      form.privacyAcknowledgement &&
      !isSubmitting,
    [form, isSubmitting],
  );

  const completionPercent = useMemo(() => {
    const requiredValues = [
      form.submitterName,
      form.submitterRoleAgency,
      form.submitterEmail,
      form.submitterPhone,
      form.applicantFullName,
      form.county,
      form.needsSummary,
      form.electronicSignature,
      form.signatureDate,
    ];
    const completed =
      requiredValues.filter((value) => value.trim()).length +
      (form.privacyAcknowledgement ? 1 : 0);

    return Math.round((completed / (requiredValues.length + 1)) * 100);
  }, [form]);

  function updateField(
    name: keyof ReferralFormState,
    value: string | boolean | string[],
  ) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  function toggleSupportNeed(option: string) {
    setForm((current) => {
      const supportNeeds = current.supportNeeds.includes(option)
        ? current.supportNeeds.filter((item) => item !== option)
        : [...current.supportNeeds, option];

      return { ...current, supportNeeds };
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmission({ type: "idle", message: "" });

    try {
      const body = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          body.append(key, JSON.stringify(value));
          return;
        }

        body.append(key, String(value));
      });

      if (supportPlanFile) {
        body.append("supportPlan", supportPlanFile);
      }

      const response = await fetch("/api/referrals", {
        method: "POST",
        body,
      });
      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(result.message ?? "Unable to submit referral.");
      }

      setForm(initialForm);
      setSupportPlanFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setSubmission({
        type: "success",
        message:
          result.message ??
          `Thank you. Your referral inquiry has been sent to ${brand.name}.`,
      });
    } catch (error) {
      setSubmission({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : `Something went wrong. Please call ${brand.phone}.`,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xl shadow-slate-300"
    >
      <div className="border-b border-slate-200 bg-[linear-gradient(135deg,#0f172a,#123f3c_58%,#8f1d3f)] px-5 py-8 text-center text-white sm:px-8">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-rose-200">
          {brand.name}
        </p>
        <h2 className="mt-3 text-3xl font-bold">
          CRS Referral Inquiry Form
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-slate-300">
          Please share enough information for our team to follow up. Do not
          include Social Security numbers or highly sensitive medical records in
          this website form.
        </p>
        <div className="mx-auto mt-6 max-w-2xl rounded-lg border border-white/15 bg-white/10 p-4 text-left">
          <div className="flex items-center justify-between gap-4 text-sm font-bold text-white">
            <span>Required info progress</span>
            <span>{completionPercent}%</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full rounded-full bg-rose-200 transition-all"
              style={{ width: `${completionPercent}%` }}
            />
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Optional details and documents can still help us respond with a
            better first follow-up.
          </p>
        </div>
      </div>

      <div className="grid gap-8 px-5 py-8 sm:px-8">
        <FormNotice />

        <fieldset className="grid min-w-0 gap-5 rounded-lg border border-slate-200 bg-[#f8f5ef] p-4 sm:p-5">
          <legend className="text-xl font-bold text-slate-950">
            Submitter Information
          </legend>
          <div className="grid gap-5 md:grid-cols-2">
            <TextField
              label="Submitter full name"
              name="submitterName"
              required
              value={form.submitterName}
              onChange={(value) => updateField("submitterName", value)}
            />
            <TextField
              label="Role / agency"
              name="submitterRoleAgency"
              required
              placeholder="Case manager, family member, social worker"
              value={form.submitterRoleAgency}
              onChange={(value) => updateField("submitterRoleAgency", value)}
            />
            <TextField
              label="Email address"
              name="submitterEmail"
              type="email"
              required
              value={form.submitterEmail}
              onChange={(value) => updateField("submitterEmail", value)}
            />
            <TextField
              label="Phone number"
              name="submitterPhone"
              type="tel"
              required
              value={form.submitterPhone}
              onChange={(value) => updateField("submitterPhone", value)}
            />
            <SelectField
              label="Preferred contact method"
              name="preferredContact"
              value={form.preferredContact}
              onChange={(value) => updateField("preferredContact", value)}
              options={["Phone", "Email", "Either phone or email"]}
            />
          </div>
        </fieldset>

        <fieldset className="grid min-w-0 gap-5 rounded-lg border border-slate-200 bg-[#f8f5ef] p-4 sm:p-5">
          <legend className="text-xl font-bold text-slate-950">
            Applicant Information
          </legend>
          <div className="grid gap-5 md:grid-cols-2">
            <TextField
              label="Applicant full name"
              name="applicantFullName"
              required
              value={form.applicantFullName}
              onChange={(value) => updateField("applicantFullName", value)}
            />
            <TextField
              label="Preferred name"
              name="preferredName"
              value={form.preferredName}
              onChange={(value) => updateField("preferredName", value)}
            />
            <TextField
              label="Preferred pronouns"
              name="pronouns"
              value={form.pronouns}
              onChange={(value) => updateField("pronouns", value)}
            />
            <TextField
              label="Date of birth"
              name="dateOfBirth"
              type="date"
              value={form.dateOfBirth}
              onChange={(value) => updateField("dateOfBirth", value)}
            />
            <TextField
              label="County of financial responsibility"
              name="county"
              required
              value={form.county}
              onChange={(value) => updateField("county", value)}
            />
            <SelectField
              label="Current living setting"
              name="currentSetting"
              value={form.currentSetting}
              onChange={(value) => updateField("currentSetting", value)}
              options={[
                "",
                "Family home",
                "Hospital / treatment setting",
                "Current residential provider",
                "Independent living",
                "Other",
              ]}
            />
          </div>
        </fieldset>

        <fieldset className="grid min-w-0 gap-5 rounded-lg border border-slate-200 bg-[#f8f5ef] p-4 sm:p-5">
          <legend className="text-xl font-bold text-slate-950">
            Guardian or Representative
          </legend>
          <div className="grid gap-5 md:grid-cols-2">
            <TextField
              label="Guardian / representative name"
              name="guardianName"
              value={form.guardianName}
              onChange={(value) => updateField("guardianName", value)}
            />
            <TextField
              label="Guardian / representative contact"
              name="guardianContact"
              value={form.guardianContact}
              onChange={(value) => updateField("guardianContact", value)}
            />
          </div>
        </fieldset>

        <fieldset className="grid min-w-0 gap-5 rounded-lg border border-slate-200 bg-[#f8f5ef] p-4 sm:p-5">
          <legend className="text-xl font-bold text-slate-950">
            Services and Support Needs
          </legend>
          <div>
            <p className="text-sm font-bold text-slate-900">
              Referral urgency
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {urgencyOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => updateField("urgency", option)}
                  className={`min-h-12 rounded-lg border px-4 py-3 text-left text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-rose-700/30 ${
                    form.urgency === option
                      ? "border-slate-950 bg-slate-950 text-white"
                      : "border-slate-300 bg-white text-slate-800 hover:border-rose-300 hover:bg-rose-50"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="flex flex-wrap items-end justify-between gap-2">
              <p className="text-sm font-bold text-slate-900">
                Services and support areas being requested
              </p>
              <p className="text-sm font-semibold text-slate-500">
                {form.supportNeeds.length} selected
              </p>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {supportOptions.map((option) => {
                const selected = form.supportNeeds.includes(option);
                return (
                  <label
                    key={option}
                    className={`flex min-h-12 items-start gap-3 rounded-lg border px-4 py-3 text-sm font-semibold transition ${
                      selected
                        ? "border-rose-300 bg-rose-50 text-rose-950"
                        : "border-slate-300 bg-white text-slate-800 hover:border-rose-300 hover:bg-rose-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => toggleSupportNeed(option)}
                      className="mt-1 h-4 w-4 accent-rose-700"
                    />
                    <span className="min-w-0">{option}</span>
                  </label>
                );
              })}
            </div>
          </div>
          <TextareaField
            label="Brief description of the individual’s needs"
            name="needsSummary"
            required
            rows={6}
            placeholder="Share current setting, support needs, routines, safety considerations, timing, and what a good residential fit would look like."
            value={form.needsSummary}
            onChange={(value) => updateField("needsSummary", value)}
          />
        </fieldset>

        <fieldset className="grid min-w-0 gap-5 rounded-lg border border-slate-200 bg-[#f8f5ef] p-4 sm:p-5">
          <legend className="text-xl font-bold text-slate-950">
            Support Plan / CSSP Upload
          </legend>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <label className="grid gap-2 text-sm font-bold text-slate-900">
              <span>
                Upload Support Plan, CSSP, or related referral document
              </span>
              <span className="text-sm font-normal leading-6 text-slate-600">
                Accepted file types: PDF, Word documents, images, or text files.
                Maximum size: 10 MB.
              </span>
              <span className="flex min-h-24 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-slate-400 bg-white px-4 py-5 text-center text-slate-700 transition hover:border-rose-700 hover:bg-rose-50">
                <FileUp
                  aria-hidden="true"
                  className="text-rose-700"
                  size={26}
                />
                <span className="min-w-0 break-all font-semibold">
                  {supportPlanFile
                    ? supportPlanFile.name
                    : "Choose Support Plan / CSSP file"}
                </span>
                <span className="text-sm">
                  {supportPlanFile
                    ? "Selected document will be sent with the referral inquiry."
                    : "Optional, but helpful for case manager referrals."}
                </span>
              </span>
              <input
                ref={fileInputRef}
                type="file"
                name="supportPlan"
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/png,image/jpeg,text/plain"
                onChange={(event) =>
                  setSupportPlanFile(event.target.files?.[0] ?? null)
                }
                className="sr-only"
              />
            </label>
          </div>
        </fieldset>

        <fieldset className="grid min-w-0 gap-5 rounded-lg border border-slate-200 bg-[#f8f5ef] p-4 sm:p-5">
          <legend className="text-xl font-bold text-slate-950">
            Electronic Signature
          </legend>
          <p className="text-sm leading-6 text-slate-600">
            By typing your name and dating this form, you confirm that the
            information provided is accurate to the best of your knowledge and
            that {brand.name} may contact you about this referral.
          </p>
          <div className="grid gap-5 md:grid-cols-2">
            <TextField
              label="Electronic signature"
              name="electronicSignature"
              required
              placeholder="Type your full name"
              value={form.electronicSignature}
              onChange={(value) => updateField("electronicSignature", value)}
            />
            <TextField
              label="Signature date"
              name="signatureDate"
              type="date"
              required
              value={form.signatureDate}
              onChange={(value) => updateField("signatureDate", value)}
            />
          </div>
        </fieldset>

        <input
          aria-hidden="true"
          tabIndex={-1}
          autoComplete="off"
          name="website"
          value={form.website}
          onChange={(event) => updateField("website", event.target.value)}
          className="hidden"
        />

        <label className="flex min-w-0 items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
          <input
            type="checkbox"
            checked={form.privacyAcknowledgement}
            onChange={(event) =>
              updateField("privacyAcknowledgement", event.target.checked)
            }
            required
            className="mt-1 h-4 w-4 shrink-0 accent-rose-700"
          />
          <span>
            I understand this form sends a referral inquiry to {brand.name} and
            should not include Social Security numbers or full
            medical records.
          </span>
        </label>

        {submission.type !== "idle" ? (
          <div
            role={submission.type === "error" ? "alert" : "status"}
            className={`rounded-lg border px-4 py-3 text-sm font-semibold ${
              submission.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-950"
                : "border-red-200 bg-red-50 text-red-900"
            }`}
          >
            {submission.message}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={!canSubmit}
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-base font-bold text-white shadow-sm transition hover:bg-rose-900 focus:outline-none focus:ring-2 focus:ring-rose-700 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-400 md:w-auto"
        >
          {isSubmitting ? (
            <>
              <Loader2 aria-hidden="true" className="animate-spin" size={19} />
              Sending Referral
            </>
          ) : (
            <>
              Submit Referral Inquiry
              <CheckCircle2 aria-hidden="true" size={19} />
            </>
          )}
        </button>
      </div>
    </form>
  );
}

function FormNotice() {
  return (
    <div className="flex min-w-0 gap-3 rounded-lg border border-rose-100 bg-rose-50 p-4 text-sm leading-6 text-rose-950">
      <ShieldCheck aria-hidden="true" className="mt-1 shrink-0" size={20} />
      <p>
        Referral submissions are sent to{" "}
        <strong className="break-all">{brand.email}</strong>. A {brand.name} team member will follow
        up by the preferred contact method.
      </p>
    </div>
  );
}

function TextField({
  label,
  name,
  value,
  onChange,
  placeholder,
  required,
  type = "text",
}: {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-bold text-slate-900">
      <span>
        {label} {required ? <span className="text-red-700">*</span> : null}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-12 min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2 text-base font-normal text-slate-950 outline-none transition placeholder:text-slate-500 hover:border-slate-400 focus:border-rose-700 focus:ring-2 focus:ring-rose-700/20"
      />
    </label>
  );
}

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <label className="grid gap-2 text-sm font-bold text-slate-900">
      <span>{label}</span>
      <select
        name={name}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-12 min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2 text-base font-normal text-slate-950 outline-none transition hover:border-slate-400 focus:border-rose-700 focus:ring-2 focus:ring-rose-700/20"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option || "Select one"}
          </option>
        ))}
      </select>
    </label>
  );
}

function TextareaField({
  label,
  name,
  value,
  onChange,
  placeholder,
  required,
  rows = 4,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  rows?: number;
}) {
  return (
    <label className="grid gap-2 text-sm font-bold text-slate-900">
      <span>
        {label} {required ? <span className="text-red-700">*</span> : null}
      </span>
      <textarea
        name={name}
        required={required}
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2 text-base font-normal leading-7 text-slate-950 outline-none transition placeholder:text-slate-500 hover:border-slate-400 focus:border-rose-700 focus:ring-2 focus:ring-rose-700/20"
      />
    </label>
  );
}
