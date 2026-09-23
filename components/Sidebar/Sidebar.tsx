"use client";

import { useWorkspace } from "@/state/WorkspaceProvider";
import { TreeNode } from "./TreeNode";
import styles from "./Sidebar.module.scss";

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { state } = useWorkspace();

  return (
    <nav className={styles.sidebar} aria-label="Workspace tree">
      <div className={styles.header}>
        <span className={styles.heading}>Explorer</span>
      </div>

      <div className={styles.scroll} onClick={onNavigate}>
        <ul role="tree" aria-label="Folders and files" className={styles.tree}>
          <TreeNode nodeId={state.rootId} depth={0} />
        </ul>
      </div>
    </nav>
  );
}
