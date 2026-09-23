# Workspace Explorer

A browser-only file manager for folders and text files. The whole workspace is
one tree held in the browser; there is no server and no real filesystem behind
it.

## Language

### Structure

**Node**:
Any item in the workspace. Every node is either a Folder or a File.
_Avoid_: item, entry, entity

**Folder**:
A node that contains other nodes. May contain both Folders and Files, to any
depth.
_Avoid_: directory, dir

**File**:
A node that holds a single piece of text. Every File holds text, whatever its
name suggests.
_Avoid_: document, text file, blob

**Root**:
The single Folder at the top of the tree. It has no parent and cannot be
renamed or deleted.
_Avoid_: home, top folder, workspace folder

**Subtree**:
A Folder together with every descendant beneath it. Deleting a Folder deletes
its whole Subtree.
_Avoid_: branch, tree, contents

### Naming

**Extension**:
The lowercased segment after the final dot in a File's name. A name with no
dot, a leading dot, or a trailing dot has no Extension — so `.gitignore` has
none. Derived from the name, never stored.
_Avoid_: file type, suffix, format

**File Category**:
The grouping a File's Extension maps to: text, image, video, audio, code,
archive, or generic. Derived from the name, never stored.

A File Category carries no behaviour. It chooses which icon is drawn and
nothing else — a File in the video category still holds text and still opens in
the text editor.
_Avoid_: file type, kind, MIME type

### Interaction

**Selected Folder**:
The Folder whose contents the main panel is showing. There is always exactly
one, and it is always a Folder.
_Avoid_: current folder, active directory, cwd

**Open File**:
The File currently loaded in the editor, if any.
_Avoid_: active file, current document

**Draft**:
Edited text in the editor that has not been saved yet. A Draft that differs
from the saved text makes the editor dirty, and leaving with a dirty editor
asks for confirmation.
_Avoid_: unsaved changes, buffer, working copy
