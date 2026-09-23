# Mini Workspace Explorer

A file manager that runs entirely in the browser. You can create folders and
text files, nest them as deep as you like, rename and delete things, search the
whole workspace, and edit file contents. Everything is saved in the browser, so
it survives a refresh. There is no backend and nothing is uploaded anywhere.

Built with Next.js (App Router), TypeScript and SCSS Modules.

---

## Running it

You need Node.js 20.9 or newer — that is what Next.js 16 requires. Check with
`node -v`.

Install the dependencies once:

```bash
npm install
```

Then start the app:

```bash
npm run dev
```

Open **http://localhost:3000** in your browser. Save any file and the page
reloads by itself.

If port 3000 is already busy, Next.js will tell you and pick another port —
read the URL it prints rather than assuming 3000.

### Other commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server, with hot reload |
| `npm run build` | Production build |
| `npm start` | Serves the production build (run `build` first) |
| `npm run lint` | ESLint |
| `npx tsc --noEmit` | Type check only, no output files |

---

## Using the app

### Getting around

The **sidebar** on the left is the folder tree. Click the arrow to open or
close a folder, and click a folder's name to show its contents in the main
panel. Files and folders are joined to their parent by a curved line, so you
can see what belongs to what. Click a file and it opens in the editor.

The **breadcrumb** at the top shows where you are, like
`Workspace / Projects / Webbly`. Every part of it is clickable, so it is the
quickest way back up.

### Creating things

Pick the folder you want to create in, then use **New folder** or **New file**.
The new item goes inside whichever folder is currently open.

Two names are rejected: an empty one, and one that is already taken in that
same folder. Names are compared without case, so you cannot have both
`Notes.txt` and `notes.txt` side by side. The same name in a *different* folder
is fine. The dialog tells you which rule you hit.

### Renaming and deleting

Hover a row in the main panel and **Rename** and **Delete** appear on the right.
On a touch screen they are always visible.

Renaming follows the same naming rules, except you are allowed to keep your own
name — so changing `notes` to `Notes` works.

Deleting a folder deletes everything inside it. You get a confirmation first
that says how many items will go, so you are never surprised. If you delete the
folder you were looking at, the app moves you up to the nearest folder that
still exists rather than leaving you nowhere.

### Editing a file

Click any file to open the editor. Type, then press **Save** or hit
**Ctrl+S** (**Cmd+S** on a Mac).

While you have unsaved edits an **Unsaved changes** badge appears. If you try to
click away to another file or folder, the app asks before throwing your work
away. Closing the browser tab gives you the browser's own warning. Once saved,
your text is still there when you come back to the file later, or after a
refresh.

### Searching

Type in the search box to search the whole workspace at once, not just the
folder you are in. It searches names, and depth does not matter — a file buried
six folders down is found just as easily as one at the top.

The part of the name that matched is highlighted, and underneath each result
you can see the folder path it lives in. Click a result and the app jumps
there, opening the folders above it in the sidebar so you can see where you
landed. Clear the box to go back to browsing.

### File icons

Files get an icon based on their extension, so `clip.mp4` looks like a video
and `photo.png` looks like an image. There are six groups — text, image, video,
audio, code and archive — and anything unrecognised gets a plain document icon.

One thing to be clear about: the icon is based on the **name only**. This app
stores text, so a file called `clip.mp4` is still a text file that opens in the
text editor. The icon does not change how anything behaves.

### Starting over

**Reset** in the top right wipes your workspace and puts the starting example
back. It asks first.

---

## How it works

### The data structure

This is the decision everything else follows from. The tree is stored **flat** —
one big lookup keyed by id — rather than as folders containing arrays of
children:

```ts
interface FsNode {
  id: string;
  name: string;
  type: "folder" | "file";
  parentId: string | null;   // null only for the root
}

type NodeMap = Record<string, FsNode>;
```

A folder does not hold its children. Instead every node records who its parent
is, and the shape of the tree is worked out from that when it is needed.

That sounds like extra work, but it makes almost everything easier:

- **Renaming** changes one entry. With nested arrays you would have to copy your
  way down to the right node and rebuild the tree around it.
- **Searching** is a single pass over the list, so a deeply buried file costs no
  more to find than a top-level one, and no recursion is involved.
- **Breadcrumbs** just follow `parentId` upwards until they hit the root.
- **Updates stay shallow**, which is what keeps React re-rendering cheaply.

The trade-off is that listing one folder's children means filtering the whole
list instead of reading an array. For a workspace this size that is nothing. A
much larger tree would want a `parentId -> childIds` index kept alongside.

File contents are stored **separately**, in their own `Record<id, string>`.
Renaming a file should not touch its text, and drawing a folder listing should
not drag every file's contents into memory.

### State management

`useReducer` plus React context — no Redux, Zustand or similar. The whole app is
one tree owned by one screen, which is exactly what a reducer is good at.

A few things worth knowing if you are reading the code:

- **All changes go through one reducer.** If you want to know how deleting
  works, there is exactly one place to look.
- **The reducer is pure.** New ids are generated by the caller and passed in
  with the action, never created inside the reducer.
- **State and actions are two separate contexts.** The actions never change
  identity, so a button that only fires actions does not re-render every time
  the tree changes.

### Saving your work

Everything goes into `localStorage` under one key, written whenever the
workspace changes.

The tricky part is the first render. The app renders on the server too, where
`localStorage` does not exist, so the saved data can only be read once the page
is running in the browser. Until that read happens the app shows a short
loading state, then swaps in your real workspace. There is also a guard that
stops the very first render from saving the example workspace over the top of
your real one.

Saved data is version-stamped and checked when it loads. Anything corrupt,
outdated or unreadable is thrown away and you get the starting workspace back
instead of a broken app.

### The tree

`TreeNode` renders a row, then renders `TreeNode` again for each of its
children. That one piece of recursion is the entire reason folders can nest as
deep as you want. It stops naturally at files and at closed folders, so a large
collapsed folder costs nothing to draw.

The connector lines are pure CSS, not images or SVG. Each child draws its own
elbow, and the vertical line continues down to the next sibling — except for
the last child, which stops, so a branch visibly ends.

---

## Project structure

```
app/
  layout.tsx          fonts, metadata, the html shell
  page.tsx            wires the providers together
  globals.scss        reset and theme colours

lib/                  plain logic, no React anywhere
  types.ts            the core types
  workspace.ts        tree operations, validation, search
  fileKind.ts         extension -> icon category
  storage.ts          localStorage read and write
  seed.ts             the starting workspace
  ids.ts              id generation

state/
  workspaceReducer.ts every change to the workspace
  WorkspaceProvider.tsx  the store, plus saving and loading
  UnsavedChangesProvider.tsx  the "you have unsaved edits" guard

components/
  Explorer.tsx        the overall layout
  Sidebar/            the folder tree
  MainPanel/          breadcrumb, toolbar, listing, search results
  FileEditor/         the text editor
  ui/                 dialogs, icons, shared pieces

styles/               shared SCSS variables and mixins
```

The rule across those folders: `lib/` knows nothing about React, `state/` knows
nothing about the DOM, and the components hold no business rules. Anything in
`lib/` can be tested without rendering a single component.

Each component keeps its styles in a `.module.scss` file next to it, so class
names are scoped locally and cannot leak.

---

## Things handled that are easy to miss

- Duplicate names in the same folder, compared without case
- Empty or whitespace-only names
- Names containing slashes
- Deleting a folder that has contents, with a count in the warning
- Deleting the folder you are currently looking at
- Deleting a folder while one of its files is open in the editor
- Leaving the editor with unsaved text
- Closing the browser tab with unsaved text
- Empty folders, which show a message rather than a blank panel
- Searching for something nested very deep
- Saved data that is corrupt, outdated, or blocked by the browser
- Names containing characters like `<b>`, which are shown as text and never
  treated as markup

---

## Known limitations

- You cannot move items between folders, and there is no drag and drop
- Search looks at names only, not at what is inside files
- Two browser tabs do not stay in sync; whichever saves last wins
- Empty folders still show an expand arrow
- Everything lives in one browser, so your workspace does not follow you to
  another device

---

## A note on authorship

This code was written by an AI assistant (Claude) as a reference example. It is
not anyone's original assessment submission and should not be presented as one.
