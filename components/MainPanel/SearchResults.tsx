"use client";

import { searchWorkspace } from "@/lib/workspace";
import { useUnsavedChanges } from "@/state/UnsavedChangesProvider";
import { useWorkspace, useWorkspaceActions } from "@/state/WorkspaceProvider";
import { NodeIcon } from "@/components/ui/NodeIcon";
import { HighlightedText } from "@/components/ui/HighlightedText";
import styles from "./SearchResults.module.scss";

interface SearchResultsProps {
  query: string;
  onNavigated: () => void;
}

export function SearchResults({ query, onNavigated }: SearchResultsProps) {
  const { state } = useWorkspace();
  const { selectFolder, openFile, revealNode } = useWorkspaceActions();
  const { guard } = useUnsavedChanges();

  const hits = searchWorkspace(state, query);

  if (hits.length === 0) {
    return (
      <div className={styles.empty}>
        <p className={styles.emptyTitle}>No matches for “{query.trim()}”</p>
        <p className={styles.emptyHint}>Try a shorter word or a different spelling.</p>
      </div>
    );
  }

  async function handleOpen(id: string, isFolder: boolean) {
    if (!(await guard())) return;

    revealNode(id);
    if (isFolder) selectFolder(id);
    else openFile(id);

    onNavigated();
  }

  return (
    <div>
      <p className={styles.count}>
        {hits.length} {hits.length === 1 ? "match" : "matches"}
      </p>

      <ul className={styles.list}>
        {hits.map(({ node, breadcrumb }) => (
          <li key={node.id}>
            <button
              type="button"
              className={styles.hit}
              onClick={() => void handleOpen(node.id, node.type === "folder")}
            >
              <NodeIcon node={node} />

              <span className={styles.text}>
                <span className={styles.name}>
                  <HighlightedText text={node.name} query={query} />
                </span>
                <span className={styles.path}>{breadcrumb.join(" / ")}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
