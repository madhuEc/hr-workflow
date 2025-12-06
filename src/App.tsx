import { ReactFlowProvider } from '@xyflow/react';
import {
  Layout,
  WorkflowCanvas,
  NodePalette,
  NodeFormPanel,
  SandboxPanel,
} from './components';
import './App.css';

function App() {
  return (
    <ReactFlowProvider>
      <Layout
        sidebar={<NodePalette />}
        canvas={<WorkflowCanvas />}
        panel={
          <>
            <NodeFormPanel />
            <SandboxPanel />
          </>
        }
      />
    </ReactFlowProvider>
  );
}

export default App;
