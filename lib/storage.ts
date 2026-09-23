import type { WorkspaceState } from "./types";

// Checks for window and wraps everything in try/catch. localStorage is missing
// during SSR, and throws in private mode or when full.

const STORAGE_KEY = "workspace-explorer";

// Bump this when the saved shape changes. Old data is dropped, not migrated.
const STORAGE_VERSION = 1;

interface PersistedPayload {
  version: number;
  state: WorkspaceState;
}

function isWorkspaceState(value: unknown): value is WorkspaceState {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Partial<WorkspaceState>;

  return (
    typeof candidate.rootId === "string" &&
    typeof candidate.selectedFolderId === "string" &&
    typeof candidate.nodes === "object" &&
    candidate.nodes !== null &&
    typeof candidate.fileContents === "object" &&
    candidate.fileContents !== null &&
    Boolean(candidate.nodes[candidate.rootId])
  );
}

export function loadState(): WorkspaceState | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<PersistedPayload>;
    if (parsed.version !== STORAGE_VERSION) return null;
    if (!isWorkspaceState(parsed.state)) return null;

    const state = parsed.state;

    if (!state.nodes[state.selectedFolderId]) {
      state.selectedFolderId = state.rootId;
    }
    if (state.openFileId && !state.nodes[state.openFileId]) {
      state.openFileId = null;
    }

    return state;
  } catch {
    return null;
  }
}

export function saveState(state: WorkspaceState): void {
  if (typeof window === "undefined") return;

  try {
    const payload: PersistedPayload = { version: STORAGE_VERSION, state };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Storage full or blocked. The app keeps working in memory.
  }
}

export function clearState(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
  }
}
