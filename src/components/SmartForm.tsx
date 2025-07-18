'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import AdvancedButton from './AdvancedButton';
import { LoadingSpinner } from './LoadingStates';

interface FormField {
  name: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select';
  label: string;
  required?: boolean;
  placeholder?: string;
  options?: string[];
  validation?: (value: string) => string | null;
}

interface SmartFormProps {
  fields: FormField[];
  onSubmit: (data: Record<string, string>) => Promise<void>;
  className?: string;
  title?: string;
  description?: string;
}

const fieldVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const statusVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 25 }
  },
  exit: { opacity: 0, scale: 0.8 }
};

export default function SmartForm({ 
  fields, 
  onSubmit, 
  className = '',
  title,
  description
}: SmartFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [currentStep, setCurrentStep] = useState(0);

  // Initialize form data
  useEffect(() => {
    const initialData: Record<string, string> = {};
    fields.forEach(field => {
      initialData[field.name] = '';
    });
    setFormData(initialData);
  }, [fields]);

  // Real-time validation
  const validateField = (name: string, value: string): string | null => {
    const field = fields.find(f => f.name === name);
    if (!field) return null;

    if (field.required && !value.trim()) {
      return `${field.label} is required`;
    }

    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return 'Please enter a valid email address';
      }
    }

    if (field.type === 'tel' && value) {
      const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
      if (!phoneRegex.test(value)) {
        return 'Please enter a valid phone number';
      }
    }

    if (field.validation) {
      return field.validation(value);
    }

    return null;
  };

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleBlur = (name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, formData[name]);
    if (error) {
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    fields.forEach(field => {
      const error = validateField(field.name, formData[field.name]);
      if (error) {
        newErrors[field.name] = error;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      await onSubmit(formData);
      setSubmitStatus('success');
      // Reset form
      const resetData: Record<string, string> = {};
      fields.forEach(field => {
        resetData[field.name] = '';
      });
      setFormData(resetData);
      setTouched({});
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFieldError = (name: string): string | null => {
    return touched[name] ? errors[name] : null;
  };

  const renderField = (field: FormField, index: number) => {
    const error = getFieldError(field.name);
    const hasError = Boolean(error);
    const isValid = touched[field.name] && !hasError && formData[field.name];

    const baseClasses = `
      form-input w-full px-4 py-3 rounded-large border-2 
      transition-all duration-300 ease-smooth
      focus:outline-none focus:ring-0
      ${hasError 
        ? 'border-semantic-error-500 focus:border-semantic-error-600' 
        : isValid
        ? 'border-semantic-success-500 focus:border-semantic-success-600'
        : 'border-gray-300 focus:border-brand-600 hover:border-brand-300'
      }
      ${hasError ? 'bg-semantic-error-50' : isValid ? 'bg-semantic-success-50' : 'bg-white'}
    `;

    return (
      <motion.div
        key={field.name}
        variants={fieldVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: index * 0.1, duration: 0.5 }}
        className="relative"
      >
        <label 
          htmlFor={field.name}
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          {field.label}
          {field.required && <span className="text-semantic-error-500 ml-1">*</span>}
        </label>

        <div className="relative">
          {field.type === 'textarea' ? (
            <textarea
              id={field.name}
              name={field.name}
              rows={4}
              value={formData[field.name] || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              onBlur={() => handleBlur(field.name)}
              placeholder={field.placeholder}
              className={`${baseClasses} resize-y`}
            />
          ) : field.type === 'select' ? (
            <select
              id={field.name}
              name={field.name}
              value={formData[field.name] || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              onBlur={() => handleBlur(field.name)}
              className={baseClasses}
            >
              <option value="">Select {field.label}</option>
              {field.options?.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          ) : (
            <input
              type={field.type}
              id={field.name}
              name={field.name}
              value={formData[field.name] || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              onBlur={() => handleBlur(field.name)}
              placeholder={field.placeholder}
              className={baseClasses}
            />
          )}

          {/* Status Indicator */}
          <AnimatePresence>
            {isValid && (
              <motion.div
                variants={statusVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <CheckCircleIcon className="h-5 w-5 text-semantic-success-500" />
              </motion.div>
            )}
            {hasError && (
              <motion.div
                variants={statusVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <ExclamationTriangleIcon className="h-5 w-5 text-semantic-error-500" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-2 text-sm text-semantic-error-600 flex items-center gap-1"
            >
              <ExclamationTriangleIcon className="h-4 w-4 flex-shrink-0" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <div className={`bg-surface-elevated rounded-xlarge p-6 md:p-8 shadow-depth-2 border border-gray-200 ${className}`}>
      {/* Header */}
      {(title || description) && (
        <div className="mb-8 text-center">
          {title && (
            <h2 className="text-fluid-2xl font-bold text-gray-900 mb-4">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-gray-600 leading-relaxed">
              {description}
            </p>
          )}
        </div>
      )}

      {/* Status Messages */}
      <AnimatePresence>
        {submitStatus === 'success' && (
          <motion.div
            variants={statusVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="mb-6 p-4 bg-semantic-success-50 border border-semantic-success-200 rounded-large flex items-center gap-3"
          >
            <CheckCircleIcon className="h-5 w-5 text-semantic-success-600 flex-shrink-0" />
            <p className="text-semantic-success-800 font-medium">
              Thank you! Your message has been sent successfully. We'll get back to you soon.
            </p>
          </motion.div>
        )}

        {submitStatus === 'error' && (
          <motion.div
            variants={statusVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="mb-6 p-4 bg-semantic-error-50 border border-semantic-error-200 rounded-large flex items-center gap-3"
          >
            <ExclamationTriangleIcon className="h-5 w-5 text-semantic-error-600 flex-shrink-0" />
            <p className="text-semantic-error-800 font-medium">
              There was an error sending your message. Please try again or contact us directly.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map((field, index) => (
            field.type === 'textarea' ? (
              <div key={field.name} className="md:col-span-2">
                {renderField(field, index)}
              </div>
            ) : (
              renderField(field, index)
            )
          ))}
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <AdvancedButton
            variant="primary"
            size="lg"
            disabled={isSubmitting}
            loading={isSubmitting}
            className="w-full shadow-depth-2 hover:shadow-depth-3"
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </AdvancedButton>
        </div>
      </form>
    </div>
  );
}