import {
  collectSubtreeIds,
  findSurvivingAncestor,
  getAncestorPath,
  makeNode,
} from "@/lib/workspace";
import type { NodeId, NodeType, WorkspaceState } from "@/lib/types";

// The id comes in with the action 
export type WorkspaceAction =
  | { type: "selectFolder"; id: NodeId }
  | { type: "toggleFolder"; id: NodeId }
  | { type: "revealNode"; id: NodeId }
  | { type: "openFile"; id: NodeId }
  | { type: "closeFile" }
  | {
      type: "createNode";
      id: NodeId;
      parentId: NodeId;
      name: string;
      nodeType: NodeType;
    }
  | { type: "renameNode"; id: NodeId; name: string }
  | { type: "deleteNode"; id: NodeId }
  | { type: "saveFile"; id: NodeId; content: string }
  | { type: "reset"; state: WorkspaceState };

export function workspaceReducer(
  state: WorkspaceState,
  action: WorkspaceAction,
): WorkspaceState {
  switch (action.type) {
    case "reset":
      return action.state;

    case "selectFolder": {
      const target = state.nodes[action.id];
      if (!target || target.type !== "folder") return state;

      return {
        ...state,
        selectedFolderId: action.id,
        openFileId: null,
        expanded: { ...state.expanded, [action.id]: true },
      };
    }

    case "toggleFolder": {
      const isExpanded = state.expanded[action.id] ?? false;
      return {
        ...state,
        expanded: { ...state.expanded, [action.id]: !isExpanded },
      };
    }

    case "revealNode": {
      const trail = getAncestorPath(state.nodes, action.id);
      const expanded = { ...state.expanded };

      for (const ancestor of trail) {
        if (ancestor.type === "folder") expanded[ancestor.id] = true;
      }

      return { ...state, expanded };
    }

    case "openFile": {
      const file = state.nodes[action.id];
      if (!file || file.type !== "file") return state;

      return {
        ...state,
        openFileId: action.id,
        selectedFolderId: file.parentId ?? state.rootId,
      };
    }

    case "closeFile":
      return { ...state, openFileId: null };

    case "createNode": {
      const parent = state.nodes[action.parentId];
      if (!parent || parent.type !== "folder") return state;

      const node = makeNode(action.id, action.name, action.nodeType, action.parentId);

      return {
        ...state,
        nodes: { ...state.nodes, [node.id]: node },
        fileContents:
          node.type === "file"
            ? { ...state.fileContents, [node.id]: "" }
            : state.fileContents,
        expanded: { ...state.expanded, [action.parentId]: true },
      };
    }

    case "renameNode": {
      const node = state.nodes[action.id];
      if (!node) return state;

      return {
        ...state,
        nodes: {
          ...state.nodes,
          [action.id]: { ...node, name: action.name.trim() },
        },
      };
    }

    case "deleteNode": {
      const node = state.nodes[action.id];
      if (!node || node.id === state.rootId) return state;

      const doomed = new Set(collectSubtreeIds(state.nodes, action.id));

      const nodes = { ...state.nodes };
      const fileContents = { ...state.fileContents };
      const expanded = { ...state.expanded };

      for (const id of doomed) {
        delete nodes[id];
        delete fileContents[id];
        delete expanded[id];
      }

      // The folder we were viewing is gone, so move up to one that still exists.
      const selectedFolderId = doomed.has(state.selectedFolderId)
        ? findSurvivingAncestor(nodes, node.parentId, state.rootId)
        : state.selectedFolderId;

      const openFileId =
        state.openFileId && doomed.has(state.openFileId)
          ? null
          : state.openFileId;

      return { ...state, nodes, fileContents, expanded, selectedFolderId, openFileId };
    }

    case "saveFile": {
      const file = state.nodes[action.id];
      if (!file || file.type !== "file") return state;

      return {
        ...state,
        fileContents: { ...state.fileContents, [action.id]: action.content },
      };
    }

    default: {
      const exhaustive: never = action;
      return exhaustive;
    }
  }
}
