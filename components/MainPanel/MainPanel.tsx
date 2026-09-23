"use client";

import { useState } from "react";

import { collectSubtreeIds, validateName } from "@/lib/workspace";
import type { FsNode, NodeType } from "@/lib/types";
import { useConfirm } from "@/components/ui/ConfirmProvider";
import { NameDialog } from "@/components/ui/NameDialog";
import { FileEditor } from "@/components/FileEditor/FileEditor";
import { useWorkspace, useWorkspaceActions } from "@/state/WorkspaceProvider";
import { Breadcrumb } from "./Breadcrumb";
import { ItemList } from "./ItemList";
import { SearchResults } from "./SearchResults";
import { Toolbar } from "./Toolbar";
import styles from "./MainPanel.module.scss";

// An open file replaces the toolbar with the editor's own header, so you cannot
// type into search while editing and lose a draft.

type DialogState =
  | { kind: "none" }
  | { kind: "create"; nodeType: NodeType }
  | { kind: "rename"; node: FsNode };

export function MainPanel({ onOpenSidebar }: { onOpenSidebar: () => void }) {
  const { state } = useWorkspace();
  const { createNode, renameNode, deleteNode, resetWorkspace } = useWorkspaceActions();
  const confirm = useConfirm();

  const [searchQuery, setSearchQuery] = useState("");
  const [dialog, setDialog] = useState<DialogState>({ kind: "none" });

  const openFile = state.openFileId ? state.nodes[state.openFileId] : null;
  const isSearching = searchQuery.trim().length > 0;

  function closeDialog() {
    setDialog({ kind: "none" });
  }

  async function handleDelete(node: FsNode) {
    const descendants = collectSubtreeIds(state.nodes, node.id).length - 1;

    const message =
      node.type === "folder" && descendants > 0
        ? `“${node.name}” and the ${descendants} item${descendants === 1 ? "" : "s"} inside it will be permanently deleted.`
        : `“${node.name}” will be permanently deleted.`;

    const confirmed = await confirm({
      title: `Delete ${node.type}?`,
      message,
      confirmLabel: "Delete",
      danger: true,
    });

    if (confirmed) deleteNode(node.id);
  }

  async function handleReset() {
    const confirmed = await confirm({
      title: "Reset workspace?",
      message: "Every folder and file you created will be replaced by the starting example.",
      confirmLabel: "Reset",
      danger: true,
    });

    if (confirmed) resetWorkspace();
  }

  return (
    <section className={styles.panel}>
      <header className={styles.header}>
        <button
          type="button"
          className={styles.menuButton}
          onClick={onOpenSidebar}
          aria-label="Show workspace tree"
        >
          Tree
        </button>

        <Breadcrumb />

        <button type="button" className={styles.reset} onClick={() => void handleReset()}>
          Reset
        </button>
      </header>

      {openFile ? (
        <FileEditor key={openFile.id} fileId={openFile.id} />
      ) : (
        <>
          <Toolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onCreateFolder={() => setDialog({ kind: "create", nodeType: "folder" })}
            onCreateFile={() => setDialog({ kind: "create", nodeType: "file" })}
          />

          <div className={styles.body}>
            {isSearching ? (
              <SearchResults query={searchQuery} onNavigated={() => setSearchQuery("")} />
            ) : (
              <ItemList
                onRename={(node) => setDialog({ kind: "rename", node })}
                onDelete={(node) => void handleDelete(node)}
              />
            )}
          </div>
        </>
      )}

      {/* শুধু খোলা থাকলেই mount হয় আর key দেওয়া, তাই প্রতিবার নতুন করে শুরু হয়। */}
      {dialog.kind === "create" && (
        <NameDialog
          key={`create-${dialog.nodeType}`}
          title={dialog.nodeType === "folder" ? "New folder" : "New file"}
          submitLabel="Create"
          initialValue=""
          validate={(name) => validateName(state.nodes, state.selectedFolderId, name)}
          onSubmit={(name) => {
            createNode(state.selectedFolderId, name, dialog.nodeType);
            closeDialog();
          }}
          onClose={closeDialog}
        />
      )}

      {dialog.kind === "rename" && (
        <NameDialog
          key={`rename-${dialog.node.id}`}
          title="Rename"
          submitLabel="Save"
          initialValue={dialog.node.name}
          validate={(name) =>
            validateName(
              state.nodes,
              dialog.node.parentId ?? state.rootId,
              name,
              dialog.node.id,
            )
          }
          onSubmit={(name) => {
            renameNode(dialog.node.id, name);
            closeDialog();
          }}
          onClose={closeDialog}
        />
      )}
    </section>
  );
}
