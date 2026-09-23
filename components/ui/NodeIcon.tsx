import { categoryOf, type FileCategory } from "@/lib/fileKind";
import type { FsNode } from "@/lib/types";
import {
  ArchiveFileIcon,
  AudioFileIcon,
  CodeFileIcon,
  FileIcon,
  FolderIcon,
  ImageFileIcon,
  TextFileIcon,
  VideoFileIcon,
} from "./icons";
import styles from "./NodeIcon.module.scss";


const GLYPH_BY_CATEGORY: Record<FileCategory, (props: { className?: string }) => React.ReactElement> = {
  text: TextFileIcon,
  image: ImageFileIcon,
  video: VideoFileIcon,
  audio: AudioFileIcon,
  code: CodeFileIcon,
  archive: ArchiveFileIcon,
  generic: FileIcon,
};

export function NodeIcon({ node }: { node: FsNode }) {
  if (node.type === "folder") {
    return (
      <span className={styles.folder}>
        <FolderIcon />
      </span>
    );
  }

  const Glyph = GLYPH_BY_CATEGORY[categoryOf(node.name)];

  return (
    <span className={styles.file}>
      <Glyph />
    </span>
  );
}
