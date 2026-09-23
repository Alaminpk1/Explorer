// A category only picks an icon. A "video" file still holds plain text.
export type FileCategory =
  | "text"
  | "image"
  | "video"
  | "audio"
  | "code"
  | "archive"
  | "generic";

// idx <= 0 means no dot, or a dot at the start. So .gitignore has no extension.
export function deriveExtension(name: string): string | null {
  const trimmed = name.trim();
  const idx = trimmed.lastIndexOf(".");

  if (idx <= 0) return null;
  if (idx === trimmed.length - 1) return null; // trailing dot

  return trimmed.slice(idx + 1).toLowerCase();
}

const CATEGORY_BY_EXTENSION: Record<string, FileCategory> = {
  txt: "text",
  md: "text",
  log: "text",
  rtf: "text",
  png: "image",
  jpg: "image",
  jpeg: "image",
  gif: "image",
  svg: "image",
  webp: "image",
  avif: "image",
  bmp: "image",
  ico: "image",
  mp4: "video",
  mov: "video",
  avi: "video",
  mkv: "video",
  webm: "video",
  mp3: "audio",
  wav: "audio",
  ogg: "audio",
  flac: "audio",
  m4a: "audio",
  js: "code",
  ts: "code",
  jsx: "code",
  tsx: "code",
  json: "code",
  html: "code",
  css: "code",
  scss: "code",
  py: "code",
  zip: "archive",
  rar: "archive",
  "7z": "archive",
  tar: "archive",
  gz: "archive",
};

export function categoryOf(name: string): FileCategory {
  const extension = deriveExtension(name);
  if (!extension) return "generic";
  return CATEGORY_BY_EXTENSION[extension] ?? "generic";
}
