"use client";

import { useState } from "react";

import { useWorkspace } from "@/state/WorkspaceProvider";
import { MainPanel } from "./MainPanel/MainPanel";
import { Sidebar } from "./Sidebar/Sidebar";
import styles from "./Explorer.module.scss";

export function Explorer() {
  const { hydrated } = useWorkspace();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!hydrated) {
    return (
      <div className={styles.loading} role="status">
        Loading workspace…
      </div>
    );
  }

  return (
    <div className={styles.shell}>
      <div
        className={sidebarOpen ? `${styles.sidebarSlot} ${styles.sidebarOpen}` : styles.sidebarSlot}
      >
        <Sidebar onNavigate={() => setSidebarOpen(false)} />
      </div>

      {sidebarOpen && (
        <div
          className={styles.scrim}
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <MainPanel onOpenSidebar={() => setSidebarOpen(true)} />
    </div>
  );
}
