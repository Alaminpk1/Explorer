"use client";

import { getChildren } from "@/lib/workspace";
import type { FsNode } from "@/lib/types";
import { useUnsavedChanges } from "@/state/UnsavedChangesProvider";
import { useWorkspace, useWorkspaceActions } from "@/state/WorkspaceProvider";
import { NodeIcon } from "@/components/ui/NodeIcon";
import styles from "./ItemList.module.scss";

interface ItemListProps {
  onRename: (node: FsNode) => void;
  onDelete: (node: FsNode) => void;
}

export function ItemList({ onRename, onDelete }: ItemListProps) {
  const { state } = useWorkspace();
  const { selectFolder, openFile } = useWorkspaceActions();
  const { guard } = useUnsavedChanges();

  const children = getChildren(state.nodes, state.selectedFolderId);

  if (children.length === 0) {
    return (
      <div className={styles.empty}>
        <p className={styles.emptyTitle}>This folder is empty</p>
        <p className={styles.emptyHint}>
          Use “New folder” or “New file” above to add something.
        </p>
      </div>
    );
  }

  async function handleOpen(node: FsNode) {
    if (!(await guard())) return;
    if (node.type === "folder") selectFolder(node.id);
    else openFile(node.id);
  }

  return (
    <ul className={styles.list}>
      {children.map((node) => (
        <li key={node.id} className={styles.row}>
          <button
            type="button"
            className={styles.open}
            onClick={() => void handleOpen(node)}
          >
            <NodeIcon node={node} />
            <span className={styles.name}>{node.name}</span>
          </button>

          <div className={styles.rowActions}>
            <button type="button" className={styles.action} onClick={() => onRename(node)}>
              Rename
            </button>
            <button
              type="button"
              className={styles.actionDanger}
              onClick={() => onDelete(node)}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
