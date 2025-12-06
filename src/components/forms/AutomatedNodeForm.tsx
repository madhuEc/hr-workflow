import { useEffect, useState } from 'react';
import type { AutomatedNodeData, AutomationAction } from '../../types';
import { InputField, SelectField } from './FormField';
import { getAutomations } from '../../api';

interface AutomatedNodeFormProps {
  data: AutomatedNodeData;
  onChange: (data: Partial<AutomatedNodeData>) => void;
}

export function AutomatedNodeForm({ data, onChange }: AutomatedNodeFormProps) {
  const [actions, setActions] = useState<AutomationAction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAutomations().then((result) => {
      setActions(result);
      setLoading(false);
    });
  }, []);

  const selectedAction = actions.find((a) => a.id === data.actionId);

  const handleActionChange = (actionId: string) => {
    // Reset params when action changes
    onChange({ actionId, actionParams: {} });
  };

  const handleParamChange = (paramName: string, value: string) => {
    onChange({
      actionParams: {
        ...data.actionParams,
        [paramName]: value,
      },
    });
  };

  return (
    <>
      <InputField
        type="text"
        label="Title"
        hint="Name for this automated step"
        value={data.title}
        onChange={(e) => onChange({ title: e.target.value })}
        placeholder="e.g., Send Welcome Email"
      />

      <SelectField
        label="Action"
        hint="Select an automated action to execute"
        options={actions.map((a) => ({ value: a.id, label: a.label }))}
        value={data.actionId}
        onChange={(e) => handleActionChange(e.target.value)}
        disabled={loading}
      />

      {selectedAction && selectedAction.params.length > 0 && (
        <div className="action-params">
          <div className="action-params-title">Action Parameters</div>
          {selectedAction.params.map((param) => (
            <InputField
              key={param}
              type="text"
              label={param.charAt(0).toUpperCase() + param.slice(1)}
              hint={`Value for ${param}`}
              value={data.actionParams[param] || ''}
              onChange={(e) => handleParamChange(param, e.target.value)}
              placeholder={`Enter ${param}...`}
            />
          ))}
        </div>
      )}
    </>
  );
}
