"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";

import { createId } from "@/lib/ids";
import { createSeedState } from "@/lib/seed";
import { loadState, saveState } from "@/lib/storage";
import type { NodeId, NodeType, WorkspaceState } from "@/lib/types";
import { workspaceReducer, type WorkspaceAction } from "./workspaceReducer";


interface WorkspaceStore {
  state: WorkspaceState;
  hydrated: boolean;
}

type StoreAction =
  | { type: "hydrateFromStorage"; saved: WorkspaceState | null }
  | WorkspaceAction;

function storeReducer(store: WorkspaceStore, action: StoreAction): WorkspaceStore {
  if (action.type === "hydrateFromStorage") {
    return { state: action.saved ?? store.state, hydrated: true };
  }

  return { ...store, state: workspaceReducer(store.state, action) };
}

interface WorkspaceActions {
  selectFolder: (id: NodeId) => void;
  toggleFolder: (id: NodeId) => void;
  revealNode: (id: NodeId) => void;
  openFile: (id: NodeId) => void;
  closeFile: () => void;
  createNode: (parentId: NodeId, name: string, nodeType: NodeType) => void;
  renameNode: (id: NodeId, name: string) => void;
  deleteNode: (id: NodeId) => void;
  saveFile: (id: NodeId, content: string) => void;
  resetWorkspace: () => void;
}

const WorkspaceStateContext = createContext<WorkspaceStore | null>(null);
const WorkspaceActionsContext = createContext<WorkspaceActions | null>(null);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [store, dispatch] = useReducer(storeReducer, undefined, () => ({
    state: createSeedState(),
    hydrated: false,
  }));

  // localStorage does not exist during SSR, so this cannot run earlier.
  useEffect(() => {
    dispatch({ type: "hydrateFromStorage", saved: loadState() });
  }, []);

  // Only save after hydrating, or the first render writes the seed over saved data.
  useEffect(() => {
    if (!store.hydrated) return;
    saveState(store.state);
  }, [store.state, store.hydrated]);

  const actions = useMemo<WorkspaceActions>(
    () => ({
      selectFolder: (id) => dispatch({ type: "selectFolder", id }),
      toggleFolder: (id) => dispatch({ type: "toggleFolder", id }),
      revealNode: (id) => dispatch({ type: "revealNode", id }),
      openFile: (id) => dispatch({ type: "openFile", id }),
      closeFile: () => dispatch({ type: "closeFile" }),
      createNode: (parentId, name, nodeType) =>
        dispatch({ type: "createNode", id: createId(), parentId, name, nodeType }),
      renameNode: (id, name) => dispatch({ type: "renameNode", id, name }),
      deleteNode: (id) => dispatch({ type: "deleteNode", id }),
      saveFile: (id, content) => dispatch({ type: "saveFile", id, content }),
      resetWorkspace: () => dispatch({ type: "reset", state: createSeedState() }),
    }),
    [],
  );

  return (
    <WorkspaceActionsContext.Provider value={actions}>
      <WorkspaceStateContext.Provider value={store}>
        {children}
      </WorkspaceStateContext.Provider>
    </WorkspaceActionsContext.Provider>
  );
}

export function useWorkspace(): WorkspaceStore {
  const store = useContext(WorkspaceStateContext);
  if (!store) throw new Error("useWorkspace must be used inside <WorkspaceProvider>.");
  return store;
}

export function useWorkspaceActions(): WorkspaceActions {
  const actions = useContext(WorkspaceActionsContext);
  if (!actions) {
    throw new Error("useWorkspaceActions must be used inside <WorkspaceProvider>.");
  }
  return actions;
}
