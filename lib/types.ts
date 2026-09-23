export type NodeId = string;

export type NodeType = "folder" | "file";

export interface FsNode {
  id: NodeId;
  name: string;
  type: NodeType;
  parentId: NodeId | null;
}

// Flat tree: parentId gives the shape, not nested children arrays.
export type NodeMap = Record<NodeId, FsNode>;

export type FileContentMap = Record<NodeId, string>;

export interface WorkspaceState {
  nodes: NodeMap;
  fileContents: FileContentMap;
  rootId: NodeId;
  selectedFolderId: NodeId;
  openFileId: NodeId | null;
  expanded: Record<NodeId, boolean>;
}

export type ValidationResult =
  | { ok: true }
  | { ok: false; message: string };

export interface SearchHit {
  node: FsNode;
  breadcrumb: string[];
}
