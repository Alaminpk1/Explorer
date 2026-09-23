import type { WorkspaceState } from "./types";

// Fixed ids, not random ones. This renders on the server and again in the
// browser, and random ids would differ between the two.
export function createSeedState(): WorkspaceState {
  return {
    rootId: "root",
    selectedFolderId: "root",
    openFileId: null,
    expanded: { root: true, projects: true },
    nodes: {
      root: { id: "root", name: "Workspace", type: "folder", parentId: null },
      projects: { id: "projects", name: "Projects", type: "folder", parentId: "root" },
      webbly: { id: "webbly", name: "Webbly", type: "folder", parentId: "projects" },
      personal: { id: "personal", name: "Personal", type: "folder", parentId: "projects" },
      documents: { id: "documents", name: "Documents", type: "folder", parentId: "root" },
      notes: { id: "notes", name: "notes.txt", type: "file", parentId: "webbly" },
      tasks: { id: "tasks", name: "tasks.txt", type: "file", parentId: "webbly" },
      readme: { id: "readme", name: "README.txt", type: "file", parentId: "root" },
    },
    fileContents: {
      notes: "Meeting notes for the Webbly project.\n\nNothing decided yet.",
      tasks: "- Build the tree view\n- Wire up search\n- Handle the delete edge cases",
      readme: "Welcome to the workspace.\n\nPick a folder on the left to get started.",
    },
  };
}
