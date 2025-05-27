import React, { useEffect, useRef, useState } from "react";

import { CloudUpload } from "lucide-react";

import { cn } from "@/lib/utils";

interface FileUploadProps {
  value?: Blob | null;
  onChange?: (file: File | null) => void;
  className?: string;
  id?: string;
}

const isImageFile = (file: File | null) => {
  return file ? file.type.startsWith("image/") : false;
};

const FilePreview: React.FC<{
  preview: string | null;
  fileName: string | null;
  onClick: () => void;
}> = ({ preview, fileName, onClick }) => {
  return (
    <div className="group relative w-full max-w-[906px] items-center justify-center">
      {preview ? (
        <div
          style={{
            backgroundImage: `url(${preview})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            height: "132px",
          }}
          aria-label="Preview"
        />
      ) : (
        <div className="flex h-[132px] items-center justify-center">
          <span>{fileName}</span>
        </div>
      )}
      <div
        onClick={onClick}
        className="absolute inset-0 cursor-pointer items-center justify-center transition-opacity duration-300 hover:flex group-hover:opacity-100"
      >
        <div className="flex size-10 items-center justify-center gap-2 rounded-full bg-white p-3">
          <CloudUpload className="hidden text-black group-hover:block" />
        </div>
      </div>
    </div>
  );
};

export const FileUpload: React.FC<FileUploadProps> = ({ value, onChange, className, id }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  useEffect(() => {
    if (value) {
      setFile(value as File);
      setPreview(isImageFile(value as File) ? URL.createObjectURL(value) : null);
    }
  }, [value]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);
    setPreview(isImageFile(selectedFile) ? URL.createObjectURL(selectedFile ?? new Blob()) : null);
    onChange?.(selectedFile);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const droppedFile = event.dataTransfer.files?.[0] || null;
    setFile(droppedFile);
    setPreview(isImageFile(droppedFile) ? URL.createObjectURL(droppedFile ?? new Blob()) : null);
    onChange?.(droppedFile);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={cn(
        "relative flex h-[134px] flex-col items-center justify-center rounded-lg border border-dashed border-grey-300 bg-white",
        preview ? "" : "px-4 py-6",
        className,
        isDragging ? "border-blue-500" : "",
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        onChange={handleFileChange}
        className="hidden"
        ref={fileInputRef}
        id={`file-upload-${id}`}
      />
      {file ? (
        <FilePreview preview={preview} fileName={file.name} onClick={triggerFileInput} />
      ) : (
        <label htmlFor={`file-upload-${id}`} style={{ cursor: "pointer" }}>
          <div className="flex flex-col items-center gap-2">
            <span role="img" aria-label="upload">
              <CloudUpload />
            </span>
            <div className="flex">
              <a className="cursor-pointer text-moss-700 hover:underline">{"Upload a file"}</a>
              &nbsp;
              <span>{"or drag and drop"}</span>
            </div>
          </div>
        </label>
      )}
    </div>
  );
};
