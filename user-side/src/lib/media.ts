const VIDEO_EXTENSIONS = [".mp4", ".webm", ".ogg", ".mov", ".m4v"];

// Decide whether a media URL (or a selected File) should be shown in a <video> tag.
export const isVideo = (source?: string | File | null): boolean => {
  if (!source) return false;
  if (typeof source !== "string") return source.type.startsWith("video/");
  const path = source.split("?")[0].toLowerCase();
  return VIDEO_EXTENSIONS.some((ext) => path.endsWith(ext));
};

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // keep in sync with the server limit
