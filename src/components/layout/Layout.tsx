import type { ReactNode } from 'react';
import './layout.css';

interface LayoutProps {
  sidebar: ReactNode;
  canvas: ReactNode;
  panel: ReactNode;
}

export function Layout({ sidebar, canvas, panel }: LayoutProps) {
  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="header-brand">
          <span className="header-logo">🔄</span>
          <span className="header-title">HR Workflow Designer</span>
        </div>
        <div className="header-actions">
          <span className="header-hint">Drag nodes from the left sidebar onto the canvas</span>
        </div>
      </header>

      <div className="app-main">
        <aside className="app-sidebar">{sidebar}</aside>
        <main className="app-canvas">{canvas}</main>
        <aside className="app-panel">{panel}</aside>
      </div>
    </div>
  );
}
