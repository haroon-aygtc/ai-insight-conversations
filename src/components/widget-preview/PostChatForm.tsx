import React, { useState } from 'react';

interface FormField {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: Array<{value: string, label: string}>;
  order?: number;
  min?: number;
  max?: number;
}

interface PostChatFormProps {
  fields: FormField[];
  title: string;
  subtitle: string;
  primaryColor: string;
  onSubmit: (data: Record<string, any>) => void;
}

const PostChatForm: React.FC<PostChatFormProps> = ({
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
    // Implement payload size limits to prevent oversized requests
    if (typeof value === 'string' && value.length > 500) {
      value = value.substring(0, 500); // Truncate long text inputs
    }
    
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
      if (field.required && (!formData[field.id] || 
          (typeof formData[field.id] === 'string' && formData[field.id].trim() === ''))) {
        newErrors[field.id] = `${field.label} is required`;
        isValid = false;
      }

      // Email validation
      if (field.type === 'email' && formData[field.id] && !/\S+@\S+\.\S+/.test(formData[field.id])) {
        newErrors[field.id] = 'Please enter a valid email address';
        isValid = false;
      }

      // Rating validation
      if (field.type === 'rating' && field.required) {
        if (!formData[field.id] || formData[field.id] < (field.min || 1) || formData[field.id] > (field.max || 5)) {
          newErrors[field.id] = `Please provide a rating between ${field.min || 1} and ${field.max || 5}`;
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Sanitize form data to prevent oversized requests
      const sanitizedData = Object.entries(formData).reduce((acc, [key, value]) => {
        // Truncate string values if they're too long
        if (typeof value === 'string' && value.length > 500) {
          acc[key] = value.substring(0, 500);
        } else {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, any>);
      
      onSubmit(sanitizedData);
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
      
      case 'rating':
        const min = field.min || 1;
        const max = field.max || 5;
        const ratings = Array.from({ length: max - min + 1 }, (_, i) => min + i);
        
        return (
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '8px' }}>
            {ratings.map(rating => (
              <button
                key={rating}
                type="button"
                onClick={() => handleChange(field.id, rating)}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: formData[field.id] === rating ? primaryColor : '#f3f4f6',
                  color: formData[field.id] === rating ? 'white' : '#1f2937',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
              >
                {rating}
              </button>
            ))}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="post-chat-form">
      <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>{title}</h3>
      <p style={{ fontSize: '14px', marginBottom: '16px', color: '#6b7280' }}>{subtitle}</p>
      
      <form onSubmit={handleSubmit}>
        {sortedFields.map(field => (
          <div key={field.id} style={{ marginBottom: '16px' }}>
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
          Submit
        </button>
      </form>
    </div>
  );
};

export default PostChatForm;
