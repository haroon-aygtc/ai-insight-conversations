import React, { useState } from 'react';

interface FormField {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[]; // Simple string array for options
  order?: number;
}

interface PreChatFormProps {
  fields: FormField[];
  title: string;
  subtitle: string;
  primaryColor: string;
  onSubmit: (data: Record<string, any>) => void;
}

const PreChatForm: React.FC<PreChatFormProps> = ({
  fields,
  title,
  subtitle,
  primaryColor,
  onSubmit
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Sort fields by order if available
  const sortedFields = [...fields].sort((a, b) => {
    const orderA = a.order || 0;
    const orderB = b.order || 0;
    return orderA - orderB;
  });

  const handleChange = (id: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    
    // Clear error when field is filled
    if (errors[id]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    sortedFields.forEach(field => {
      if (field.required && (!formData[field.id] || formData[field.id].trim() === '')) {
        newErrors[field.id] = `${field.label} is required`;
        isValid = false;
      }

      // Email validation
      if (field.type === 'email' && formData[field.id] && !/\S+@\S+\.\S+/.test(formData[field.id])) {
        newErrors[field.id] = 'Please enter a valid email address';
        isValid = false;
      }

      // Phone validation (basic)
      if (field.type === 'tel' && formData[field.id] && !/^[0-9+\-\s()]{7,20}$/.test(formData[field.id])) {
        newErrors[field.id] = 'Please enter a valid phone number';
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const renderField = (field: FormField) => {
    const baseInputStyle = {
      width: '100%',
      padding: '10px 14px',
      borderRadius: '6px',
      border: `1px solid ${errors[field.id] ? '#ef4444' : '#e5e7eb'}`,
      fontSize: '14px',
      outline: 'none',
      transition: 'border-color 0.2s, box-shadow 0.2s',
      boxShadow: errors[field.id] ? '0 0 0 1px #ef4444' : 'none',
      backgroundColor: 'white',
    };
    
    const focusStyle = {
      ':focus': {
        borderColor: primaryColor,
        boxShadow: `0 0 0 2px ${primaryColor}25`,
      }
    };

    switch (field.type) {
      case 'text':
      case 'email':
      case 'tel':
        return (
          <input
            type={field.type}
            id={field.id}
            placeholder={field.placeholder}
            value={formData[field.id] || ''}
            onChange={(e) => handleChange(field.id, e.target.value)}
            style={baseInputStyle}
            className="focus:border-primary focus:ring-1 focus:ring-primary/20"
          />
        );
      
      case 'textarea':
        return (
          <textarea
            id={field.id}
            placeholder={field.placeholder}
            value={formData[field.id] || ''}
            onChange={(e) => handleChange(field.id, e.target.value)}
            style={{
              ...baseInputStyle,
              minHeight: '80px',
              resize: 'vertical',
            }}
            className="focus:border-primary focus:ring-1 focus:ring-primary/20"
          />
        );
      
      case 'select':
        return (
          <select
            id={field.id}
            value={formData[field.id] || ''}
            onChange={(e) => handleChange(field.id, e.target.value)}
            style={baseInputStyle}
            className="focus:border-primary focus:ring-1 focus:ring-primary/20"
          >
            <option value="">{field.placeholder || 'Select an option'}</option>
            {field.options?.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      
      case 'radio':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {field.options?.map(option => (
              <label 
                key={option} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  cursor: 'pointer',
                  padding: '6px 0',
                }}
              >
                <div 
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    border: `2px solid ${formData[field.id] === option ? primaryColor : '#d1d5db'}`,
                    marginRight: '10px',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {formData[field.id] === option && (
                    <div style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: primaryColor,
                    }} />
                  )}
                </div>
                <input
                  type="radio"
                  name={field.id}
                  value={option}
                  checked={formData[field.id] === option}
                  onChange={() => handleChange(field.id, option)}
                  style={{ display: 'none' }}
                />
                <span style={{ fontSize: '14px' }}>{option}</span>
              </label>
            ))}
          </div>
        );
      
      case 'checkbox':
        return (
          <label style={{ 
            display: 'flex', 
            alignItems: 'center',
            cursor: 'pointer',
            padding: '6px 0',
          }}>
            <div 
              style={{
                width: '18px',
                height: '18px',
                borderRadius: '4px',
                border: `2px solid ${formData[field.id] ? primaryColor : '#d1d5db'}`,
                backgroundColor: formData[field.id] ? primaryColor : 'transparent',
                marginRight: '10px',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {formData[field.id] && (
                <svg 
                  width="12" 
                  height="12" 
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
            <input
              type="checkbox"
              checked={formData[field.id] || false}
              onChange={(e) => handleChange(field.id, e.target.checked)}
              style={{ display: 'none' }}
            />
            <span style={{ fontSize: '14px' }}>{field.label}</span>
          </label>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="pre-chat-form" style={{ padding: '16px', height: '100%', overflowY: 'auto' }}>
      <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px', color: '#111827' }}>{title}</h3>
      <p style={{ fontSize: '14px', marginBottom: '20px', color: '#6b7280' }}>{subtitle}</p>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {sortedFields.map(field => (
          <div key={field.id}>
            {field.type !== 'checkbox' && (
              <label 
                htmlFor={field.id}
                style={{ 
                  display: 'block', 
                  marginBottom: '6px', 
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#374151'
                }}
              >
                {field.label}
                {field.required && <span style={{ color: '#ef4444', marginLeft: '2px' }}> *</span>}
              </label>
            )}
            
            {renderField(field)}
            
            {errors[field.id] && (
              <p style={{ 
                color: '#ef4444', 
                fontSize: '12px', 
                margin: '6px 0 0',
                display: 'flex',
                alignItems: 'center',
                gap: '4px' 
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                {errors[field.id]}
              </p>
            )}
          </div>
        ))}
        
        <button
          type="submit"
          style={{
            backgroundColor: primaryColor,
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            padding: '12px 16px',
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer',
            width: '100%',
            marginTop: '8px',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
            transition: 'all 0.2s ease',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.filter = 'brightness(0.95)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.filter = 'brightness(1)';
          }}
        >
          Start Chat
        </button>
      </form>
    </div>
  );
};

export default PreChatForm;
