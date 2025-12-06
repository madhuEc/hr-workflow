import type { StartNodeData } from '../../types';
import { InputField } from './FormField';
import { KeyValueEditor } from './KeyValueEditor';

interface StartNodeFormProps {
  data: StartNodeData;
  onChange: (data: Partial<StartNodeData>) => void;
}

export function StartNodeForm({ data, onChange }: StartNodeFormProps) {
  return (
    <>
      <InputField
        type="text"
        label="Start Title"
        hint="Name for the workflow entry point"
        value={data.title}
        onChange={(e) => onChange({ title: e.target.value })}
        placeholder="e.g., Employee Onboarding Start"
      />

      <KeyValueEditor
        label="Metadata"
        hint="Optional key-value pairs passed to the workflow"
        value={data.metadata}
        onChange={(metadata) => onChange({ metadata })}
      />
    </>
  );
}
