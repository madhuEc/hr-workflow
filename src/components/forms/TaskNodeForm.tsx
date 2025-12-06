import type { TaskNodeData } from '../../types';
import { InputField, TextAreaField } from './FormField';
import { KeyValueEditor } from './KeyValueEditor';

interface TaskNodeFormProps {
  data: TaskNodeData;
  onChange: (data: Partial<TaskNodeData>) => void;
}

export function TaskNodeForm({ data, onChange }: TaskNodeFormProps) {
  return (
    <>
      <InputField
        type="text"
        label="Title"
        hint="Required - Name of the task"
        value={data.title}
        onChange={(e) => onChange({ title: e.target.value })}
        placeholder="e.g., Collect Documents"
        required
      />

      <TextAreaField
        label="Description"
        hint="Details about what needs to be done"
        value={data.description}
        onChange={(e) => onChange({ description: e.target.value })}
        placeholder="e.g., Collect required documents from the new employee..."
      />

      <InputField
        type="text"
        label="Assignee"
        hint="Person or role responsible"
        value={data.assignee}
        onChange={(e) => onChange({ assignee: e.target.value })}
        placeholder="e.g., HR Coordinator"
      />

      <InputField
        type="date"
        label="Due Date"
        hint="Task deadline"
        value={data.dueDate}
        onChange={(e) => onChange({ dueDate: e.target.value })}
      />

      <KeyValueEditor
        label="Custom Fields"
        hint="Additional task properties"
        value={data.customFields}
        onChange={(customFields) => onChange({ customFields })}
      />
    </>
  );
}
