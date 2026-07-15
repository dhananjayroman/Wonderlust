import React from 'react';

const InputField = ({ 
  label, 
  type = "text", 
  placeholder, 
  value, 
  onChange, 
  error, 
  name,
  required = false,
  options = [],
  min,
  autoComplete
}) => {
  const isTextarea = type === 'textarea';
  const InputComponent = isTextarea ? 'textarea' : 'input';

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-semibold text-secondary">
          {label} {required && <span className="text-primary">*</span>}
        </label>
      )}
      {type === 'select' ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={`
            w-full px-4 py-3 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all
            ${error ? 'border-primary' : 'border-gray-300 focus:border-primary'}
          `}
        >
          <option value="" disabled>{placeholder || 'Select an option'}</option>
          {options?.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      ) : (
        <InputComponent
          type={isTextarea ? undefined : type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          rows={isTextarea ? 4 : undefined}
          min={min}
          autoComplete={autoComplete}
          className={`
            w-full px-4 py-3 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all
            ${error ? 'border-primary' : 'border-gray-300 focus:border-primary'}
            ${isTextarea ? 'resize-y' : ''}
          `}
        />
      )}
      {error && <span className="text-xs text-primary font-medium mt-1">{error}</span>}
    </div>
  );
};

export default InputField;
