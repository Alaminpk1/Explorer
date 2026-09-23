"use client";

import { getAncestorPath } from "@/lib/workspace";
import { useUnsavedChanges } from "@/state/UnsavedChangesProvider";
import { useWorkspace, useWorkspaceActions } from "@/state/WorkspaceProvider";
import styles from "./Breadcrumb.module.scss";

export function Breadcrumb() {
  const { state } = useWorkspace();
  const { selectFolder } = useWorkspaceActions();
  const { guard } = useUnsavedChanges();

  const trail = getAncestorPath(state.nodes, state.selectedFolderId);

  async function handleClick(id: string) {
    if (!(await guard())) return;
    selectFolder(id);
  }

  return (
    <nav className={styles.breadcrumb} aria-label="Breadcrumb">
      <ol className={styles.list}>
        {trail.map((node, index) => {
          const isLast = index === trail.length - 1;

          return (
            <li key={node.id} className={styles.item}>
              {isLast ? (
                <span className={styles.current} aria-current="page">
                  {node.name}
                </span>
              ) : (
                <>
                  <button
                    type="button"
                    className={styles.link}
                    onClick={() => void handleClick(node.id)}
                  >
                    {node.name}
                  </button>
                  <span className={styles.separator} aria-hidden="true">
                    /
                  </span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
