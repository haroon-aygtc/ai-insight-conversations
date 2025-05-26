import React, { useState } from 'react';

interface FormField {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: Array<{value: string, label: string}>;
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
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '4px',
              border: `1px solid ${errors[field.id] ? '#ef4444' : '#d1d5db'}`,
              fontSize: '14px',
              marginBottom: '4px',
            }}
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
              width: '100%',
              padding: '8px 12px',
              borderRadius: '4px',
              border: `1px solid ${errors[field.id] ? '#ef4444' : '#d1d5db'}`,
              fontSize: '14px',
              minHeight: '80px',
              resize: 'vertical',
              marginBottom: '4px',
            }}
          />
        );
      
      case 'select':
        return (
          <select
            id={field.id}
            value={formData[field.id] || ''}
            onChange={(e) => handleChange(field.id, e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '4px',
              border: `1px solid ${errors[field.id] ? '#ef4444' : '#d1d5db'}`,
              fontSize: '14px',
              marginBottom: '4px',
              backgroundColor: 'white',
            }}
          >
            <option value="">{field.placeholder || 'Select an option'}</option>
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      
      case 'radio':
        return (
          <div style={{ marginBottom: '8px' }}>
            {field.options?.map(option => (
              <label key={option.value} style={{ display: 'block', marginBottom: '4px' }}>
                <input
                  type="radio"
                  name={field.id}
                  value={option.value}
                  checked={formData[field.id] === option.value}
                  onChange={() => handleChange(field.id, option.value)}
                  style={{ marginRight: '8px' }}
                />
                {option.label}
              </label>
            ))}
          </div>
        );
      
      case 'checkbox':
        return (
          <label style={{ display: 'block', marginBottom: '8px' }}>
            <input
              type="checkbox"
              checked={formData[field.id] || false}
              onChange={(e) => handleChange(field.id, e.target.checked)}
              style={{ marginRight: '8px' }}
            />
            {field.label}
          </label>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="pre-chat-form">
      <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>{title}</h3>
      <p style={{ fontSize: '14px', marginBottom: '16px', color: '#6b7280' }}>{subtitle}</p>
      
      <form onSubmit={handleSubmit}>
        {sortedFields.map(field => (
          <div key={field.id} style={{ marginBottom: '16px' }}>
            {field.type !== 'checkbox' && (
              <label 
                htmlFor={field.id}
                style={{ 
                  display: 'block', 
                  marginBottom: '4px', 
                  fontSize: '14px',
                  fontWeight: 500
                }}
              >
                {field.label}
                {field.required && <span style={{ color: '#ef4444' }}> *</span>}
              </label>
            )}
            
            {renderField(field)}
            
            {errors[field.id] && (
              <p style={{ color: '#ef4444', fontSize: '12px', margin: '4px 0 0' }}>
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
            borderRadius: '4px',
            padding: '10px 16px',
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer',
            width: '100%',
            marginTop: '8px',
          }}
        >
          Start Chat
        </button>
      </form>
    </div>
  );
};

export default PreChatForm;
