import type { EndNodeData } from '../../types';
import { InputField, ToggleField } from './FormField';

interface EndNodeFormProps {
  data: EndNodeData;
  onChange: (data: Partial<EndNodeData>) => void;
}

export function EndNodeForm({ data, onChange }: EndNodeFormProps) {
  return (
    <>
      <InputField
        type="text"
        label="End Message"
        hint="Message displayed when workflow completes"
        value={data.endMessage}
        onChange={(e) => onChange({ endMessage: e.target.value })}
        placeholder="e.g., Onboarding completed successfully"
      />

      <ToggleField
        label="Show Summary"
        hint="Display a summary of all steps when workflow ends"
        checked={data.showSummary}
        onChange={(checked) => onChange({ showSummary: checked })}
      />
    </>
  );
}
