import type { ApprovalNodeData } from '../../types';
import { InputField, SelectField } from './FormField';

interface ApprovalNodeFormProps {
  data: ApprovalNodeData;
  onChange: (data: Partial<ApprovalNodeData>) => void;
}

const approverRoles = [
  { value: 'Manager', label: 'Manager' },
  { value: 'HRBP', label: 'HR Business Partner' },
  { value: 'Director', label: 'Director' },
  { value: 'VP', label: 'Vice President' },
  { value: 'CEO', label: 'CEO' },
];

export function ApprovalNodeForm({ data, onChange }: ApprovalNodeFormProps) {
  return (
    <>
      <InputField
        type="text"
        label="Title"
        hint="Name of the approval step"
        value={data.title}
        onChange={(e) => onChange({ title: e.target.value })}
        placeholder="e.g., Manager Approval"
      />

      <SelectField
        label="Approver Role"
        hint="Who needs to approve this step"
        options={approverRoles}
        value={data.approverRole}
        onChange={(e) => onChange({ approverRole: e.target.value })}
      />

      <InputField
        type="number"
        label="Auto-approve Threshold"
        hint="Auto-approve if value is below this (0 = disabled)"
        value={data.autoApproveThreshold}
        onChange={(e) => onChange({ autoApproveThreshold: parseInt(e.target.value) || 0 })}
        min={0}
        placeholder="0"
      />
    </>
  );
}
