"use client";

import { useEffect, useState, type KeyboardEvent } from "react";

import type { NodeId } from "@/lib/types";
import { useUnsavedChanges } from "@/state/UnsavedChangesProvider";
import { useWorkspace, useWorkspaceActions } from "@/state/WorkspaceProvider";
import { NodeIcon } from "@/components/ui/NodeIcon";
import styles from "./FileEditor.module.scss";

// The parent passes key={fileId}, so switching files remounts this and the
// draft below starts fresh.
export function FileEditor({ fileId }: { fileId: NodeId }) {
  const { state } = useWorkspace();
  const { saveFile, closeFile } = useWorkspaceActions();
  const { setDirty, guard } = useUnsavedChanges();

  const file = state.nodes[fileId];
  const savedContent = state.fileContents[fileId] ?? "";

  const [draft, setDraft] = useState(savedContent);
  const isDirty = draft !== savedContent;

  useEffect(() => {
    setDirty(isDirty);
  }, [isDirty, setDirty]);

  // Clear on unmount, or the next navigation stays blocked.
  useEffect(() => () => setDirty(false), [setDirty]);

  if (!file) return null;

  function handleSave() {
    if (!isDirty) return;
    saveFile(fileId, draft);
  }

  async function handleClose() {
    if (!(await guard())) return;
    closeFile();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    // Take Ctrl/Cmd+S before the browser's own save dialog.
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
      event.preventDefault();
      handleSave();
    }
  }

  return (
    <div className={styles.editor}>
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <NodeIcon node={file} />
          <span className={styles.name}>{file.name}</span>
          {isDirty && (
            <span className={styles.badge} role="status">
              Unsaved changes
            </span>
          )}
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.secondary} onClick={() => void handleClose()}>
            Close
          </button>
          <button
            type="button"
            className={styles.primary}
            onClick={handleSave}
            disabled={!isDirty}
          >
            Save
          </button>
        </div>
      </header>

      <textarea
        className={styles.textarea}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={handleKeyDown}
        aria-label={`Contents of ${file.name}`}
        spellCheck={false}
      />
    </div>
  );
}
