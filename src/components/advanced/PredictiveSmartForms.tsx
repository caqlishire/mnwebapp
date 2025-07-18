'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  SparklesIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  MagnifyingGlassIcon,
  ClockIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  PencilSquareIcon,
  BoltIcon
} from '@heroicons/react/24/outline';

interface FormField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'phone' | 'select' | 'textarea';
  value: string;
  suggestions: string[];
  validation: {
    required: boolean;
    pattern?: string;
    minLength?: number;
    maxLength?: number;
  };
  confidence: number;
  autoCompleted: boolean;
}

interface PredictiveSuggestion {
  text: string;
  confidence: number;
  source: 'history' | 'pattern' | 'context' | 'ai';
  category?: string;
}

const initialFormFields: FormField[] = [
  {
    id: 'fullName',
    label: 'Full Name',
    type: 'text',
    value: '',
    suggestions: [],
    validation: { required: true, minLength: 2 },
    confidence: 0,
    autoCompleted: false
  },
  {
    id: 'email',
    label: 'Email Address',
    type: 'email',
    value: '',
    suggestions: [],
    validation: { required: true, pattern: '^[^@]+@[^@]+\\.[^@]+$' },
    confidence: 0,
    autoCompleted: false
  },
  {
    id: 'phone',
    label: 'Phone Number',
    type: 'phone',
    value: '',
    suggestions: [],
    validation: { required: true, pattern: '^\\(?\\d{3}\\)?[\\s.-]?\\d{3}[\\s.-]?\\d{4}$' },
    confidence: 0,
    autoCompleted: false
  },
  {
    id: 'serviceType',
    label: 'Service Interest',
    type: 'select',
    value: '',
    suggestions: [
      '24-Hour Customized Living',
      '245D Waiver Services',
      'Community Residential Services',
      'Consultation',
      'General Information'
    ],
    validation: { required: true },
    confidence: 0,
    autoCompleted: false
  },
  {
    id: 'message',
    label: 'Message',
    type: 'textarea',
    value: '',
    suggestions: [],
    validation: { required: true, minLength: 10 },
    confidence: 0,
    autoCompleted: false
  }
];

// Sample data for intelligent suggestions
const commonPatterns = {
  names: ['John Smith', 'Sarah Johnson', 'Michael Brown', 'Emily Davis', 'David Wilson'],
  emailDomains: ['@gmail.com', '@yahoo.com', '@hotmail.com', '@outlook.com', '@icloud.com'],
  phoneFormats: ['(555) 123-4567', '555-123-4567', '555.123.4567'],
  messageTemplates: [
    'I am interested in learning more about your services for my',
    'Could you please provide information about',
    'I would like to schedule a consultation to discuss',
    'My family member needs support with',
    'I am looking for residential care options for'
  ]
};

export default function PredictiveSmartForms() {
  const [formFields, setFormFields] = useState<FormField[]>(initialFormFields);
  const [activeField, setActiveField] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<PredictiveSuggestion[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [formCompleteness, setFormCompleteness] = useState(0);
  const [smartInsights, setSmartInsights] = useState<string[]>([]);
  const suggestionTimeout = useRef<NodeJS.Timeout>();

  // Calculate form completeness
  useEffect(() => {
    const totalFields = formFields.length;
    const completedFields = formFields.filter(field => {
      if (field.validation.required) {
        return field.value.length >= (field.validation.minLength || 1);
      }
      return true;
    }).length;
    setFormCompleteness((completedFields / totalFields) * 100);
  }, [formFields]);

  // Generate smart insights based on form data
  useEffect(() => {
    const insights: string[] = [];
    const nameField = formFields.find(f => f.id === 'fullName');
    const serviceField = formFields.find(f => f.id === 'serviceType');
    const messageField = formFields.find(f => f.id === 'message');

    if (nameField?.value && serviceField?.value) {
      insights.push(`Based on your interest in ${serviceField.value}, I can connect you with our specialized team.`);
    }

    if (messageField?.value && messageField.value.toLowerCase().includes('urgent')) {
      insights.push('I notice you mentioned urgency. Our team can prioritize your inquiry for faster response.');
    }

    if (formCompleteness > 75) {
      insights.push('Your form is nearly complete! The AI has optimized the remaining fields for quick submission.');
    }

    setSmartInsights(insights);
  }, [formFields, formCompleteness]);

  // Generate predictive suggestions
  const generateSuggestions = useCallback((fieldId: string, currentValue: string): PredictiveSuggestion[] => {
    const field = formFields.find(f => f.id === fieldId);
    if (!field) return [];

    const suggestions: PredictiveSuggestion[] = [];

    switch (fieldId) {
      case 'fullName':
        if (currentValue.length > 1) {
          commonPatterns.names
            .filter(name => name.toLowerCase().includes(currentValue.toLowerCase()))
            .slice(0, 3)
            .forEach(name => {
              suggestions.push({
                text: name,
                confidence: 0.8,
                source: 'pattern',
                category: 'common_names'
              });
            });
        }
        break;

      case 'email':
        if (currentValue.includes('@')) {
          const [localPart] = currentValue.split('@');
          commonPatterns.emailDomains.forEach(domain => {
            suggestions.push({
              text: localPart + domain,
              confidence: 0.9,
              source: 'pattern',
              category: 'email_completion'
            });
          });
        } else if (currentValue.length > 2) {
          const nameField = formFields.find(f => f.id === 'fullName');
          if (nameField?.value) {
            const nameParts = nameField.value.toLowerCase().split(' ');
            const emailBase = nameParts.join('.');
            commonPatterns.emailDomains.slice(0, 2).forEach(domain => {
              suggestions.push({
                text: emailBase + domain,
                confidence: 0.85,
                source: 'context',
                category: 'smart_completion'
              });
            });
          }
        }
        break;

      case 'phone':
        if (currentValue.length >= 3) {
          const digits = currentValue.replace(/\D/g, '');
          if (digits.length >= 3) {
            const formatted = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
            suggestions.push({
              text: formatted,
              confidence: 0.95,
              source: 'pattern',
              category: 'phone_format'
            });
          }
        }
        break;

      case 'message':
        if (currentValue.length > 5) {
          commonPatterns.messageTemplates
            .filter(template => template.toLowerCase().includes(currentValue.toLowerCase().slice(0, 10)))
            .slice(0, 2)
            .forEach(template => {
              suggestions.push({
                text: template,
                confidence: 0.7,
                source: 'ai',
                category: 'message_template'
              });
            });
        }
        break;

      default:
        break;
    }

    return suggestions.sort((a, b) => b.confidence - a.confidence).slice(0, 4);
  }, [formFields]);

  // Sanitize and validate input
  const sanitizeInput = (input: string): string => {
    // Remove potential XSS characters and normalize
    return input
      .replace(/[<>]/g, '') // Remove angle brackets
      .replace(/javascript:/gi, '') // Remove javascript: protocols
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .trim()
      .slice(0, 1000); // Limit input length
  };

  // Handle field input change
  const handleFieldChange = (fieldId: string, value: string) => {
    const sanitizedValue = sanitizeInput(value);
    
    setFormFields(prev => prev.map(field => {
      if (field.id === fieldId) {
        return {
          ...field,
          value: sanitizedValue,
          confidence: sanitizedValue.length > 0 ? Math.min(sanitizedValue.length * 10, 100) : 0
        };
      }
      return field;
    }));

    // Debounced suggestion generation
    if (suggestionTimeout.current) {
      clearTimeout(suggestionTimeout.current);
    }

    suggestionTimeout.current = setTimeout(() => {
      const newSuggestions = generateSuggestions(fieldId, value);
      setSuggestions(newSuggestions);
    }, 300);
  };

  // Apply suggestion
  const applySuggestion = (suggestion: PredictiveSuggestion) => {
    if (activeField) {
      setFormFields(prev => prev.map(field => {
        if (field.id === activeField) {
          return {
            ...field,
            value: suggestion.text,
            confidence: suggestion.confidence * 100,
            autoCompleted: true
          };
        }
        return field;
      }));
      setSuggestions([]);
      setActiveField(null);
    }
  };

  // Auto-complete entire form (AI simulation)
  const autoCompleteForm = () => {
    setIsProcessing(true);
    
    setTimeout(() => {
      setFormFields(prev => prev.map(field => {
        if (!field.value) {
          let autoValue = '';
          switch (field.id) {
            case 'fullName':
              autoValue = 'Sarah Johnson';
              break;
            case 'email':
              autoValue = 'sarah.johnson@email.com';
              break;
            case 'phone':
              autoValue = '(555) 123-4567';
              break;
            case 'serviceType':
              autoValue = '24-Hour Customized Living';
              break;
            case 'message':
              autoValue = 'I am interested in learning more about your residential care services for my family member who requires daily support.';
              break;
          }
          return {
            ...field,
            value: autoValue,
            confidence: 95,
            autoCompleted: true
          };
        }
        return field;
      }));
      setIsProcessing(false);
    }, 2000);
  };

  const getFieldIcon = (fieldId: string) => {
    switch (fieldId) {
      case 'fullName':
        return UserIcon;
      case 'email':
        return EnvelopeIcon;
      case 'phone':
        return PhoneIcon;
      case 'serviceType':
        return MapPinIcon;
      case 'message':
        return PencilSquareIcon;
      default:
        return InformationCircleIcon;
    }
  };

  const getValidationStatus = (field: FormField) => {
    if (!field.value && field.validation.required) {
      return 'required';
    }
    
    if (field.value && field.validation.pattern) {
      const regex = new RegExp(field.validation.pattern);
      if (!regex.test(field.value)) {
        return 'invalid';
      }
    }
    
    if (field.validation.minLength && field.value.length < field.validation.minLength) {
      return 'incomplete';
    }
    
    return 'valid';
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
            <SparklesIcon className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Smart Contact Form
          </h2>
        </div>
        <p className="text-gray-600 dark:text-gray-300">
          AI-powered form with predictive text and intelligent completion
        </p>
      </motion.div>

      {/* Form Progress */}
      <motion.div
        className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl border border-purple-200 dark:border-purple-700"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-purple-800 dark:text-purple-200">
            Form Completion
          </span>
          <span className="text-sm text-purple-600 dark:text-purple-400">
            {Math.round(formCompleteness)}%
          </span>
        </div>
        <div className="w-full bg-purple-200 dark:bg-purple-800 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${formCompleteness}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        
        {/* Auto-complete button */}
        <motion.button
          onClick={autoCompleteForm}
          disabled={isProcessing || formCompleteness > 90}
          className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          whileHover={{ scale: formCompleteness <= 90 ? 1.05 : 1 }}
          whileTap={{ scale: formCompleteness <= 90 ? 0.95 : 1 }}
        >
          {isProcessing ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <BoltIcon className="w-4 h-4" />
            </motion.div>
          ) : (
            <BoltIcon className="w-4 h-4" />
          )}
          AI Auto-Complete
        </motion.button>
      </motion.div>

      {/* Smart Insights */}
      <AnimatePresence>
        {smartInsights.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-700"
          >
            <div className="flex items-start gap-3">
              <SparklesIcon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-blue-900 dark:text-blue-200 mb-2">AI Insights</h4>
                <div className="space-y-1">
                  {smartInsights.map((insight, index) => (
                    <motion.p
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="text-sm text-blue-800 dark:text-blue-300"
                    >
                      • {insight}
                    </motion.p>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form Fields */}
      <div className="space-y-6">
        {formFields.map((field, index) => {
          const FieldIcon = getFieldIcon(field.id);
          const validationStatus = getValidationStatus(field);
          
          return (
            <motion.div
              key={field.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <div className="flex items-center gap-2">
                    <FieldIcon className="w-4 h-4" />
                    {field.label}
                    {field.validation.required && (
                      <span className="text-red-500">*</span>
                    )}
                    {field.autoCompleted && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs"
                      >
                        <SparklesIcon className="w-3 h-3" />
                        AI Completed
                      </motion.div>
                    )}
                  </div>
                </label>

                {field.type === 'textarea' ? (
                  <textarea
                    value={field.value}
                    onChange={(e) => handleFieldChange(field.id, e.target.value)}
                    onFocus={() => setActiveField(field.id)}
                    onBlur={() => {
                      setTimeout(() => setActiveField(null), 200);
                    }}
                    rows={4}
                    className={`w-full p-3 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-colors ${
                      validationStatus === 'valid' ? 'border-green-300 focus:ring-green-500' :
                      validationStatus === 'invalid' ? 'border-red-300 focus:ring-red-500' :
                      validationStatus === 'incomplete' ? 'border-yellow-300 focus:ring-yellow-500' :
                      'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                    }`}
                    placeholder={`Enter your ${field.label.toLowerCase()}...`}
                  />
                ) : field.type === 'select' ? (
                  <select
                    value={field.value}
                    onChange={(e) => handleFieldChange(field.id, e.target.value)}
                    onFocus={() => setActiveField(field.id)}
                    className={`w-full p-3 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-colors ${
                      validationStatus === 'valid' ? 'border-green-300 focus:ring-green-500' :
                      'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                    }`}
                  >
                    <option value="">Select {field.label}</option>
                    {field.suggestions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    value={field.value}
                    onChange={(e) => handleFieldChange(field.id, e.target.value)}
                    onFocus={() => setActiveField(field.id)}
                    onBlur={() => {
                      setTimeout(() => setActiveField(null), 200);
                    }}
                    className={`w-full p-3 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-colors ${
                      validationStatus === 'valid' ? 'border-green-300 focus:ring-green-500' :
                      validationStatus === 'invalid' ? 'border-red-300 focus:ring-red-500' :
                      validationStatus === 'incomplete' ? 'border-yellow-300 focus:ring-yellow-500' :
                      'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                    }`}
                    placeholder={`Enter your ${field.label.toLowerCase()}...`}
                  />
                )}

                {/* Validation Status Icon */}
                <div className="absolute right-3 top-10 flex items-center">
                  {validationStatus === 'valid' && (
                    <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  )}
                  {validationStatus === 'invalid' && (
                    <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
                  )}
                  {field.confidence > 0 && (
                    <div className="ml-2 text-xs text-gray-500">
                      {Math.round(field.confidence)}% confident
                    </div>
                  )}
                </div>
              </div>

              {/* Predictive Suggestions */}
              <AnimatePresence>
                {activeField === field.id && suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg"
                  >
                    <div className="p-2">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1">
                        <MagnifyingGlassIcon className="w-3 h-3" />
                        AI Suggestions
                      </div>
                      {suggestions.map((suggestion, idx) => (
                        <motion.button
                          key={idx}
                          onClick={() => applySuggestion(suggestion)}
                          className="w-full text-left p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-900 dark:text-white">
                              {suggestion.text}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">
                                {Math.round(suggestion.confidence * 100)}%
                              </span>
                              <div className={`w-2 h-2 rounded-full ${
                                suggestion.source === 'ai' ? 'bg-purple-500' :
                                suggestion.source === 'context' ? 'bg-blue-500' :
                                suggestion.source === 'pattern' ? 'bg-green-500' :
                                'bg-gray-400'
                              }`} />
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Field Feedback */}
              {validationStatus === 'invalid' && field.value && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-xs text-red-600 dark:text-red-400"
                >
                  Please enter a valid {field.label.toLowerCase()}
                </motion.p>
              )}
              {validationStatus === 'incomplete' && field.value && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-xs text-yellow-600 dark:text-yellow-400"
                >
                  {field.label} needs at least {field.validation.minLength} characters
                </motion.p>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Submit Button */}
      <motion.div
        className="mt-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <motion.button
          className={`px-8 py-3 rounded-lg font-medium transition-all ${
            formCompleteness >= 100
              ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white hover:shadow-lg'
              : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
          }`}
          disabled={formCompleteness < 100}
          whileHover={{ scale: formCompleteness >= 100 ? 1.05 : 1 }}
          whileTap={{ scale: formCompleteness >= 100 ? 0.95 : 1 }}
          onClick={() => setShowPreview(true)}
        >
          {formCompleteness >= 100 ? 'Submit Smart Form' : 'Complete Form to Submit'}
        </motion.button>
      </motion.div>

      {/* Form Preview Modal */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowPreview(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Form Preview
                </h3>
                <button
                  onClick={() => setShowPreview(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                {formFields.map((field) => (
                  <div key={field.id} className="border-b border-gray-200 dark:border-gray-700 pb-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {field.label}:
                      </span>
                      {field.autoCompleted && (
                        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                          AI Generated
                        </span>
                      )}
                    </div>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {field.value || 'Not provided'}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex gap-3">
                <motion.button
                  onClick={() => {
                    setShowPreview(false);
                    // Handle actual form submission here
                  }}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Confirm & Submit
                </motion.button>
                <motion.button
                  onClick={() => setShowPreview(false)}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Edit Form
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}