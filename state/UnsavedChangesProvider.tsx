"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";

import { useConfirm } from "@/components/ui/ConfirmProvider";

// A ref, not state. State here would re-render everything on each keystroke.

interface UnsavedChangesApi {
  setDirty: (dirty: boolean) => void;
  guard: () => Promise<boolean>;
}

const UnsavedChangesContext = createContext<UnsavedChangesApi | null>(null);

export function UnsavedChangesProvider({ children }: { children: ReactNode }) {
  const dirtyRef = useRef(false);
  const confirm = useConfirm();

  const setDirty = useCallback((dirty: boolean) => {
    dirtyRef.current = dirty;
  }, []);

  const guard = useCallback(async () => {
    if (!dirtyRef.current) return true;

    const discard = await confirm({
      title: "Discard unsaved changes?",
      message: "This file has edits that have not been saved. Leaving now loses them.",
      confirmLabel: "Discard",
      cancelLabel: "Keep editing",
      danger: true,
    });

    if (discard) dirtyRef.current = false;
    return discard;
  }, [confirm]);

  
  useEffect(() => {
    function handleBeforeUnload(event: BeforeUnloadEvent) {
      if (!dirtyRef.current) return;
      event.preventDefault();
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  const value = useMemo<UnsavedChangesApi>(() => ({ setDirty, guard }), [setDirty, guard]);

  return (
    <UnsavedChangesContext.Provider value={value}>{children}</UnsavedChangesContext.Provider>
  );
}

export function useUnsavedChanges(): UnsavedChangesApi {
  const api = useContext(UnsavedChangesContext);
  if (!api) {
    throw new Error("useUnsavedChanges must be used inside <UnsavedChangesProvider>.");
  }
  return api;
}
