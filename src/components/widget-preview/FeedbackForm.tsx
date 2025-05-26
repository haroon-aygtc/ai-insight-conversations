import React, { useState } from 'react';

interface FeedbackOption {
  id: string;
  type: string;
  label: string;
  required?: boolean;
  order?: number;
  min?: number;
  max?: number;
  conditional?: {
    field: string;
    value: string;
  };
}

interface FeedbackFormProps {
  options: FeedbackOption[];
  primaryColor: string;
  onSubmit: (data: Record<string, any>) => void;
  submitted: boolean;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({
  options,
  primaryColor,
  onSubmit,
  submitted
}) => {
  const [feedbackData, setFeedbackData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Sort options by order if available
  const sortedOptions = [...options].sort((a, b) => {
    const orderA = a.order || 0;
    const orderB = b.order || 0;
    return orderA - orderB;
  });

  const handleChange = (id: string, value: any) => {
    // Implement payload size limits to prevent oversized requests
    if (typeof value === 'string' && value.length > 500) {
      value = value.substring(0, 500); // Truncate long text inputs
    }
    
    setFeedbackData(prev => ({
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

    sortedOptions.forEach(option => {
      // Skip validation for conditional fields that shouldn't be shown
      if (option.conditional) {
        const { field, value } = option.conditional;
        if (feedbackData[field] !== value) {
          return;
        }
      }

      if (option.required && (!feedbackData[option.id] || 
          (typeof feedbackData[option.id] === 'string' && feedbackData[option.id].trim() === ''))) {
        newErrors[option.id] = `${option.label} is required`;
        isValid = false;
      }

      // Rating validation
      if (option.type === 'rating' && option.required) {
        if (!feedbackData[option.id] || 
            feedbackData[option.id] < (option.min || 1) || 
            feedbackData[option.id] > (option.max || 5)) {
          newErrors[option.id] = `Please provide a rating between ${option.min || 1} and ${option.max || 5}`;
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
      // Sanitize feedback data to prevent oversized requests
      const sanitizedData = Object.entries(feedbackData).reduce((acc, [key, value]) => {
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

  const shouldShowOption = (option: FeedbackOption) => {
    if (!option.conditional) return true;
    
    const { field, value } = option.conditional;
    return feedbackData[field] === value;
  };

  const renderOption = (option: FeedbackOption) => {
    if (!shouldShowOption(option)) return null;

    switch (option.type) {
      case 'thumbs':
        return (
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '16px' }}>
            <button
              type="button"
              onClick={() => handleChange(option.id, 'up')}
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: feedbackData[option.id] === 'up' ? primaryColor : '#f3f4f6',
                color: feedbackData[option.id] === 'up' ? 'white' : '#1f2937',
                fontSize: '24px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span role="img" aria-label="Thumbs up">👍</span>
            </button>
            <button
              type="button"
              onClick={() => handleChange(option.id, 'down')}
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: feedbackData[option.id] === 'down' ? primaryColor : '#f3f4f6',
                color: feedbackData[option.id] === 'down' ? 'white' : '#1f2937',
                fontSize: '24px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span role="img" aria-label="Thumbs down">👎</span>
            </button>
          </div>
        );
      
      case 'rating':
        const min = option.min || 1;
        const max = option.max || 5;
        const ratings = Array.from({ length: max - min + 1 }, (_, i) => min + i);
        
        return (
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '8px' }}>
            {ratings.map(rating => (
              <button
                key={rating}
                type="button"
                onClick={() => handleChange(option.id, rating)}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: feedbackData[option.id] === rating ? primaryColor : '#f3f4f6',
                  color: feedbackData[option.id] === rating ? 'white' : '#1f2937',
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
      
      case 'textarea':
        return (
          <textarea
            id={option.id}
            value={feedbackData[option.id] || ''}
            onChange={(e) => handleChange(option.id, e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '4px',
              border: `1px solid ${errors[option.id] ? '#ef4444' : '#d1d5db'}`,
              fontSize: '14px',
              minHeight: '80px',
              resize: 'vertical',
              marginBottom: '4px',
            }}
          />
        );
      
      default:
        return null;
    }
  };

  if (submitted) {
    return (
      <div style={{ textAlign: 'center', padding: '24px 0' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>
          <span role="img" aria-label="Thank you">🙏</span>
        </div>
        <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>
          Thank you for your feedback!
        </h3>
        <p style={{ fontSize: '14px', color: '#6b7280' }}>
          We appreciate your input and will use it to improve our service.
        </p>
      </div>
    );
  }

  return (
    <div className="feedback-form">
      <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px', textAlign: 'center' }}>
        How was your experience?
      </h3>
      
      <form onSubmit={handleSubmit}>
        {sortedOptions.map(option => (
          <div key={option.id} style={{ marginBottom: '16px' }}>
            <label 
              htmlFor={option.id}
              style={{ 
                display: 'block', 
                marginBottom: '4px', 
                fontSize: '14px',
                fontWeight: 500,
                textAlign: option.type === 'thumbs' || option.type === 'rating' ? 'center' : 'left'
              }}
            >
              {option.label}
              {option.required && <span style={{ color: '#ef4444' }}> *</span>}
            </label>
            
            {renderOption(option)}
            
            {errors[option.id] && (
              <p style={{ color: '#ef4444', fontSize: '12px', margin: '4px 0 0', textAlign: 'center' }}>
                {errors[option.id]}
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
          Submit Feedback
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;
