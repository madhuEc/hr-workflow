import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';
import './forms.css';

interface BaseFieldProps {
  label: string;
  hint?: string;
  error?: string;
}

interface InputFieldProps extends BaseFieldProps, InputHTMLAttributes<HTMLInputElement> {
  type: 'text' | 'number' | 'date' | 'email';
}

interface SelectFieldProps extends BaseFieldProps, SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[];
}

interface TextAreaFieldProps extends BaseFieldProps, TextareaHTMLAttributes<HTMLTextAreaElement> {}

interface ToggleFieldProps extends BaseFieldProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function InputField({ label, hint, error, ...props }: InputFieldProps) {
  return (
    <div className="form-field">
      <label className="form-label">{label}</label>
      {hint && <span className="form-hint">{hint}</span>}
      <input className={`form-input ${error ? 'has-error' : ''}`} {...props} />
      {error && <span className="form-error">{error}</span>}
    </div>
  );
}

export function SelectField({ label, hint, error, options, ...props }: SelectFieldProps) {
  return (
    <div className="form-field">
      <label className="form-label">{label}</label>
      {hint && <span className="form-hint">{hint}</span>}
      <select className={`form-select ${error ? 'has-error' : ''}`} {...props}>
        <option value="">Select...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="form-error">{error}</span>}
    </div>
  );
}

export function TextAreaField({ label, hint, error, ...props }: TextAreaFieldProps) {
  return (
    <div className="form-field">
      <label className="form-label">{label}</label>
      {hint && <span className="form-hint">{hint}</span>}
      <textarea className={`form-textarea ${error ? 'has-error' : ''}`} {...props} />
      {error && <span className="form-error">{error}</span>}
    </div>
  );
}

export function ToggleField({ label, hint, checked, onChange }: ToggleFieldProps) {
  return (
    <div className="form-field form-field-toggle">
      <div className="toggle-content">
        <label className="form-label">{label}</label>
        {hint && <span className="form-hint">{hint}</span>}
      </div>
      <button
        type="button"
        className={`toggle-button ${checked ? 'active' : ''}`}
        onClick={() => onChange(!checked)}
        role="switch"
        aria-checked={checked}
      >
        <span className="toggle-thumb" />
      </button>
    </div>
  );
}
