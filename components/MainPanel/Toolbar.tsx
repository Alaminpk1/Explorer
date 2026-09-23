"use client";

import { SearchIcon } from "@/components/ui/icons";
import styles from "./Toolbar.module.scss";

interface ToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onCreateFolder: () => void;
  onCreateFile: () => void;
}

export function Toolbar({
  searchQuery,
  onSearchChange,
  onCreateFolder,
  onCreateFile,
}: ToolbarProps) {
  return (
    <div className={styles.toolbar}>
      <div className={styles.search}>
        <SearchIcon className={styles.searchIcon} />
        <input
          type="search"
          className={styles.searchInput}
          placeholder="Search the whole workspace"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          aria-label="Search the whole workspace"
          autoComplete="off"
        />
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.secondary}
          onClick={onCreateFolder}
        >
          New folder
        </button>
        <button
          type="button"
          className={styles.primary}
          onClick={onCreateFile}
        >
          New file
        </button>
      </div>
    </div>
  );
}
