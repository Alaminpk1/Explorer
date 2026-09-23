"use client";

import { getChildren } from "@/lib/workspace";
import type { NodeId } from "@/lib/types";
import { useUnsavedChanges } from "@/state/UnsavedChangesProvider";
import { useWorkspace, useWorkspaceActions } from "@/state/WorkspaceProvider";
import { ChevronIcon } from "@/components/ui/icons";
import { NodeIcon } from "@/components/ui/NodeIcon";
import styles from "./TreeNode.module.scss";

// Renders itself for each child. That is what allows any nesting depth.
interface TreeNodeProps {
  nodeId: NodeId;
  /** Only used for aria-level — visual indentation comes from nesting. */
  depth: number;
}

export function TreeNode({ nodeId, depth }: TreeNodeProps) {
  const { state } = useWorkspace();
  const { selectFolder, toggleFolder, openFile } = useWorkspaceActions();
  const { guard } = useUnsavedChanges();

  const node = state.nodes[nodeId];
  if (!node) return null;

  const isFolder = node.type === "folder";
  const isExpanded = isFolder && (state.expanded[nodeId] ?? false);
  // Only one row carries the filled highlight: the open file, or the selected
  // folder when nothing is open.
  const isSelected = isFolder
    ? state.openFileId === null && state.selectedFolderId === nodeId
    : state.openFileId === nodeId;

  // The folder holding the open file gets tinted text instead, so it shows where
  // you are without competing with the selected row.
  const holdsOpenFile =
    isFolder && state.openFileId !== null && state.selectedFolderId === nodeId;

  const children = isExpanded ? getChildren(state.nodes, nodeId) : [];

  async function handleActivate() {
    if (!(await guard())) return;
    if (isFolder) selectFolder(nodeId);
    else openFile(nodeId);
  }

  function handleToggle(event: React.MouseEvent) {
    event.stopPropagation();
    toggleFolder(nodeId);
  }

  return (
    <li role="none" className={styles.item}>
      <div
        role="treeitem"
        aria-selected={isSelected}
        aria-expanded={isFolder ? isExpanded : undefined}
        aria-level={depth + 1}
        tabIndex={0}
        className={[
          styles.row,
          isSelected ? styles.rowSelected : "",
          holdsOpenFile ? styles.rowHoldsOpenFile : "",
        ]
          .filter(Boolean)
          .join(" ")}
        onClick={handleActivate}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            void handleActivate();
          }
          if (isFolder && event.key === "ArrowRight" && !isExpanded) toggleFolder(nodeId);
          if (isFolder && event.key === "ArrowLeft" && isExpanded) toggleFolder(nodeId);
        }}
      >
        {isFolder ? (
          <button
            type="button"
            className={isExpanded ? `${styles.chevron} ${styles.chevronOpen}` : styles.chevron}
            onClick={handleToggle}
            aria-hidden="true"
            tabIndex={-1}
          >
            <ChevronIcon />
          </button>
        ) : (
          <span className={styles.chevronSpacer} />
        )}

        <NodeIcon node={node} />

        <span className={styles.name}>{node.name}</span>
      </div>

      {isExpanded && children.length > 0 && (
        <ul role="group" className={styles.group}>
          {children.map((child) => (
            <TreeNode key={child.id} nodeId={child.id} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}
