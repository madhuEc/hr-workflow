import { useState } from 'react';
import './forms.css';

interface KeyValueEditorProps {
  label: string;
  hint?: string;
  value: Record<string, string>;
  onChange: (value: Record<string, string>) => void;
}

export function KeyValueEditor({ label, hint, value, onChange }: KeyValueEditorProps) {
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  const entries = Object.entries(value);

  const handleAdd = () => {
    if (newKey.trim() && !value[newKey.trim()]) {
      onChange({
        ...value,
        [newKey.trim()]: newValue,
      });
      setNewKey('');
      setNewValue('');
    }
  };

  const handleRemove = (key: string) => {
    const newObj = { ...value };
    delete newObj[key];
    onChange(newObj);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="form-field">
      <label className="form-label">{label}</label>
      {hint && <span className="form-hint">{hint}</span>}

      {entries.length > 0 && (
        <div className="kv-list">
          {entries.map(([key, val]) => (
            <div key={key} className="kv-item">
              <span className="kv-key">{key}</span>
              <span className="kv-value">{val}</span>
              <button
                type="button"
                className="kv-remove"
                onClick={() => handleRemove(key)}
                aria-label={`Remove ${key}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="kv-add-row">
        <input
          type="text"
          className="form-input kv-input"
          placeholder="Key"
          value={newKey}
          onChange={(e) => setNewKey(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <input
          type="text"
          className="form-input kv-input"
          placeholder="Value"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          type="button"
          className="btn btn-secondary kv-add-btn"
          onClick={handleAdd}
          disabled={!newKey.trim()}
        >
          Add
        </button>
      </div>
    </div>
  );
}
