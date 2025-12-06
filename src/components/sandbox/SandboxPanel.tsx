import { useState } from 'react';
import { useWorkflowStore } from '../../store';
import type { SimulationStep, ValidationError } from '../../types';
import './sandbox.css';

export function SandboxPanel() {
  const {
    nodes,
    edges,
    validate,
    simulate,
    isSimulating,
    simulationResult,
    clearSimulation,
    validationErrors,
    exportWorkflow,
    importWorkflow,
    workflowName,
    setWorkflowName,
    clearWorkflow,
  } = useWorkflowStore();

  const [showExport, setShowExport] = useState(false);
  const [importJson, setImportJson] = useState('');
  const [showImport, setShowImport] = useState(false);

  const handleValidate = () => {
    validate();
  };

  const handleSimulate = async () => {
    await simulate();
  };

  const handleExport = () => {
    setShowExport(true);
  };

  const handleImport = () => {
    if (importJson.trim()) {
      const success = importWorkflow(importJson);
      if (success) {
        setShowImport(false);
        setImportJson('');
      } else {
        alert('Invalid workflow JSON');
      }
    }
  };

  const handleDownload = () => {
    const json = exportWorkflow();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${workflowName.toLowerCase().replace(/\s+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStepIcon = (step: SimulationStep) => {
    switch (step.status) {
      case 'completed':
        return '✓';
      case 'failed':
        return '✗';
      case 'running':
        return '⟳';
      case 'skipped':
        return '○';
      default:
        return '•';
    }
  };

  const getStepClass = (step: SimulationStep) => {
    return `step-${step.status}`;
  };

  return (
    <div className="sandbox-panel">
      <div className="sandbox-header">
        <input
          type="text"
          className="workflow-name-input"
          value={workflowName}
          onChange={(e) => setWorkflowName(e.target.value)}
          placeholder="Workflow Name"
        />
      </div>

      <div className="sandbox-stats">
        <div className="stat">
          <span className="stat-value">{nodes.length}</span>
          <span className="stat-label">Nodes</span>
        </div>
        <div className="stat">
          <span className="stat-value">{edges.length}</span>
          <span className="stat-label">Connections</span>
        </div>
      </div>

      <div className="sandbox-actions">
        <button className="btn btn-secondary" onClick={handleValidate}>
          Validate
        </button>
        <button
          className="btn btn-primary"
          onClick={handleSimulate}
          disabled={isSimulating || nodes.length === 0}
        >
          {isSimulating ? 'Simulating...' : 'Simulate'}
        </button>
      </div>

      {validationErrors.length > 0 && (
        <div className="validation-results">
          <h4 className="results-title">Validation Results</h4>
          <ul className="validation-list">
            {validationErrors.map((error, idx) => (
              <ValidationItem key={idx} error={error} />
            ))}
          </ul>
        </div>
      )}

      {simulationResult && (
        <div className="simulation-results">
          <div className="results-header">
            <h4 className="results-title">Simulation Results</h4>
            <button className="btn btn-sm btn-secondary" onClick={clearSimulation}>
              Clear
            </button>
          </div>

          <div className={`simulation-status ${simulationResult.success ? 'success' : 'failed'}`}>
            {simulationResult.success ? '✓ Workflow completed successfully' : '✗ Workflow failed'}
            <span className="simulation-duration">
              {simulationResult.duration}ms
            </span>
          </div>

          <div className="simulation-timeline">
            {simulationResult.steps.map((step, idx) => (
              <div key={idx} className={`timeline-step ${getStepClass(step)}`}>
                <div className="step-icon">{getStepIcon(step)}</div>
                <div className="step-content">
                  <div className="step-title">{step.nodeTitle}</div>
                  <div className="step-message">{step.message}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="sandbox-divider" />

      <div className="sandbox-io">
        <h4 className="io-title">Import / Export</h4>
        <div className="io-actions">
          <button className="btn btn-secondary btn-sm" onClick={handleExport}>
            Export JSON
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => setShowImport(true)}>
            Import JSON
          </button>
          <button className="btn btn-secondary btn-sm" onClick={handleDownload}>
            Download
          </button>
        </div>
      </div>

      {showExport && (
        <div className="modal-overlay" onClick={() => setShowExport(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Export Workflow</h3>
              <button className="modal-close" onClick={() => setShowExport(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <textarea
                className="export-textarea"
                readOnly
                value={exportWorkflow()}
              />
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-primary"
                onClick={() => {
                  navigator.clipboard.writeText(exportWorkflow());
                  setShowExport(false);
                }}
              >
                Copy to Clipboard
              </button>
            </div>
          </div>
        </div>
      )}

      {showImport && (
        <div className="modal-overlay" onClick={() => setShowImport(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Import Workflow</h3>
              <button className="modal-close" onClick={() => setShowImport(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <textarea
                className="export-textarea"
                placeholder="Paste workflow JSON here..."
                value={importJson}
                onChange={(e) => setImportJson(e.target.value)}
              />
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowImport(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleImport}>
                Import
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="sandbox-divider" />

      <div className="sandbox-danger">
        <button className="btn btn-danger btn-sm" onClick={clearWorkflow}>
          Clear Canvas
        </button>
      </div>
    </div>
  );
}

function ValidationItem({ error }: { error: ValidationError }) {
  return (
    <li className={`validation-item ${error.type}`}>
      <span className="validation-icon">
        {error.type === 'error' ? '✗' : '⚠'}
      </span>
      <span className="validation-message">{error.message}</span>
    </li>
  );
}
