import type {
  FsNode,
  NodeId,
  NodeMap,
  NodeType,
  SearchHit,
  ValidationResult,
  WorkspaceState,
} from "./types";

function compareNodes(a: FsNode, b: FsNode): number {
  if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
  return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
}

export function getChildren(nodes: NodeMap, parentId: NodeId): FsNode[] {
  return Object.values(nodes)
    .filter((node) => node.parentId === parentId)
    .sort(compareNodes);
}

export function getAncestorPath(nodes: NodeMap, id: NodeId): FsNode[] {
  const trail: FsNode[] = [];
  let current: FsNode | undefined = nodes[id];

  while (current) {
    trail.unshift(current);
    current = current.parentId ? nodes[current.parentId] : undefined;
  }

  return trail;
}

// Collect the ids first, then delete. Deleting while walking would lose the
// parentId links we still need.
export function collectSubtreeIds(nodes: NodeMap, id: NodeId): NodeId[] {
  const collected: NodeId[] = [];
  const queue: NodeId[] = [id];

  const childrenByParent = new Map<NodeId, NodeId[]>();
  for (const node of Object.values(nodes)) {
    if (node.parentId === null) continue;
    const bucket = childrenByParent.get(node.parentId);
    if (bucket) bucket.push(node.id);
    else childrenByParent.set(node.parentId, [node.id]);
  }

  while (queue.length > 0) {
    const currentId = queue.pop() as NodeId;
    collected.push(currentId);
    const children = childrenByParent.get(currentId);
    if (children) queue.push(...children);
  }

  return collected;
}

export function findSurvivingAncestor(
  nodes: NodeMap,
  startParentId: NodeId | null,
  rootId: NodeId,
): NodeId {
  let candidate = startParentId;

  while (candidate) {
    if (nodes[candidate]) return candidate;
    candidate = nodes[candidate]?.parentId ?? null;
  }

  return rootId;
}

export function findChildByName(
  nodes: NodeMap,
  parentId: NodeId,
  name: string,
): FsNode | undefined {
  const needle = name.trim().toLowerCase();
  return Object.values(nodes).find(
    (node) =>
      node.parentId === parentId && node.name.toLowerCase() === needle,
  );
}

// excludeId lets a rename keep its own name.
export function validateName(
  nodes: NodeMap,
  parentId: NodeId,
  rawName: string,
  excludeId?: NodeId,
): ValidationResult {
  const name = rawName.trim();

  if (name.length === 0) {
    return { ok: false, message: "Name cannot be empty." };
  }

  if (name.length > 60) {
    return { ok: false, message: "Name cannot be longer than 60 characters." };
  }

  if (/[\/]/.test(name)) {
    return { ok: false, message: "Name cannot contain slashes." };
  }

  const clash = findChildByName(nodes, parentId, name);
  if (clash && clash.id !== excludeId) {
    return {
      ok: false,
      message: `A ${clash.type} named "${clash.name}" already exists here.`,
    };
  }

  return { ok: true };
}

export function searchWorkspace(
  state: WorkspaceState,
  rawQuery: string,
): SearchHit[] {
  const query = rawQuery.trim().toLowerCase();
  if (query.length === 0) return [];

  return Object.values(state.nodes)
    .filter(
      (node) =>
        node.id !== state.rootId && node.name.toLowerCase().includes(query),
    )
    .sort(compareNodes)
    .map((node) => ({
      node,
      breadcrumb: getAncestorPath(state.nodes, node.id)
        .slice(0, -1)
        .map((ancestor) => ancestor.name),
    }));
}

export interface TextSegment {
  text: string;
  matched: boolean;
}

// Do not use a RegExp here. The query is user text, so "." would match
// everything and "(" would throw.
export function splitOnMatch(text: string, rawQuery: string): TextSegment[] {
  const query = rawQuery.trim().toLowerCase();
  if (query.length === 0) return [{ text, matched: false }];

  const haystack = text.toLowerCase();
  const segments: TextSegment[] = [];
  let cursor = 0;

  for (;;) {
    const found = haystack.indexOf(query, cursor);
    if (found === -1) break;

    if (found > cursor) {
      segments.push({ text: text.slice(cursor, found), matched: false });
    }
    segments.push({ text: text.slice(found, found + query.length), matched: true });
    cursor = found + query.length;
  }

  if (cursor < text.length) {
    segments.push({ text: text.slice(cursor), matched: false });
  }

  return segments.length > 0 ? segments : [{ text, matched: false }];
}

export function makeNode(
  id: NodeId,
  name: string,
  type: NodeType,
  parentId: NodeId | null,
): FsNode {
  return { id, name: name.trim(), type, parentId };
}
