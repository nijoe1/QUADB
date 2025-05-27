/**
 * Creates a File-like object that works in Node.js server environment
 * @param content - The content as a string or buffer
 * @param name - The file name
 * @param options - File options including type
 * @returns A File-like object with required properties and methods
 */
export function createServerFile(
  content: string | Buffer | Uint8Array,
  name: string,
  options: { type?: string; lastModified?: number } = {},
): File {
  const buffer =
    typeof content === "string"
      ? Buffer.from(content, "utf-8")
      : content instanceof Uint8Array
        ? Buffer.from(content)
        : content;

  const fileObject = {
    name,
    size: buffer.length,
    type: options.type || "application/octet-stream",
    lastModified: options.lastModified || Date.now(),
    webkitRelativePath: "", // Required File property

    // Required methods for the unixfs library
    stream(): ReadableStream<Uint8Array> {
      return new ReadableStream({
        start(controller) {
          controller.enqueue(new Uint8Array(buffer));
          controller.close();
        },
      });
    },

    async arrayBuffer(): Promise<ArrayBuffer> {
      return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
    },

    async text(): Promise<string> {
      return buffer.toString("utf-8");
    },

    async bytes(): Promise<Uint8Array> {
      return new Uint8Array(buffer);
    },

    slice(start?: number, end?: number, contentType?: string): File {
      const slicedBuffer = buffer.slice(start, end);
      return createServerFile(slicedBuffer, this.name, {
        type: contentType || this.type,
        lastModified: this.lastModified,
      });
    },
  };

  return fileObject as unknown as File;
}
/**
 * Gets the file extension from a MIME type
 * @param mimeType - The MIME type (e.g., "image/png")
 * @returns The file extension (e.g., "png")
 */
export function getExtensionFromMimeType(mimeType: string): string {
  const mimeToExtension: Record<string, string> = {
    // Images
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/gif": "gif",
    "image/webp": "webp",
    "image/svg+xml": "svg",
    "image/bmp": "bmp",
    "image/tiff": "tiff",
    "image/ico": "ico",

    // Documents
    "application/pdf": "pdf",
    "text/plain": "txt",
    "text/html": "html",
    "text/css": "css",
    "text/javascript": "js",
    "application/json": "json",
    "application/xml": "xml",
    "text/csv": "csv",

    // Archives
    "application/zip": "zip",
    "application/x-rar-compressed": "rar",
    "application/x-7z-compressed": "7z",
    "application/x-tar": "tar",
    "application/gzip": "gz",

    // Audio
    "audio/mpeg": "mp3",
    "audio/wav": "wav",
    "audio/ogg": "ogg",
    "audio/mp4": "m4a",

    // Video
    "video/mp4": "mp4",
    "video/mpeg": "mpeg",
    "video/quicktime": "mov",
    "video/x-msvideo": "avi",
    "video/webm": "webm",

    // Office documents
    "application/msword": "doc",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
    "application/vnd.ms-excel": "xls",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
    "application/vnd.ms-powerpoint": "ppt",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": "pptx",
  };

  return mimeToExtension[mimeType] || "bin";
}

export async function modifyFile(file: File, name: string, type: string) {
  const arrayBuffer = await file.arrayBuffer();
  return createServerFile(new Uint8Array(arrayBuffer), name, { type });
}

/**
 * Validates environment variables required for Storacha
 * @throws Error if required environment variables are missing
 */
export function validateEnvironment(): void {
  if (!process.env.KEY) {
    throw new Error("Missing required environment variable: KEY");
  }
  if (!process.env.PROOF) {
    throw new Error("Missing required environment variable: PROOF");
  }
}

/**
 * Validates the uploaded file
 * @param file - The file to validate
 * @throws Error if file validation fails
 */
export function validateFile(file: File | null): asserts file is File {
  if (!file) {
    throw new Error("No file provided");
  }

  // Check if file has required properties
  if (!file.name || typeof file.size !== "number") {
    throw new Error("Invalid file format");
  }

  // Check file size (1MB limit)
  const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(
      `File size (${file.size} bytes) exceeds maximum allowed size (${MAX_FILE_SIZE} bytes)`,
    );
  }

  // Check if file is empty
  if (file.size === 0) {
    throw new Error("File cannot be empty");
  }
}
