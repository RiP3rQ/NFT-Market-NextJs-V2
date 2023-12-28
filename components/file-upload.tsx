"use client";

import toast from "react-hot-toast";
import { useCallback, useEffect, useState } from "react";

import { ourFileRouter } from "@/app/api/uploadthing/core";

import type { FileWithPath } from "@uploadthing/react";
import { useDropzone } from "@uploadthing/react/hooks";
import { generateClientDropzoneAccept } from "uploadthing/client";

import { useUploadThing } from "@/lib/uploadthing";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
  onChange: (url?: string) => void;
  endpoint: keyof typeof ourFileRouter;
  toastId?: string;
  setNftFile: (file: File) => void;
  setLoading?: (loading: boolean) => void;
  loading?: boolean;
}

export const FileUpload = ({
  onChange,
  endpoint,
  toastId,
  setNftFile,
  setLoading,
}: FileUploadProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [fileLoading, setFileLoading] = useState(false);

  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    setFiles(acceptedFiles);
  }, []);

  const sendFile = async (file: string | undefined) => {
    onChange(file);
    toast.dismiss(toastId);
    toast.success(`Wysłano!`);
    setFiles(files.slice(1, files.length));
  };

  const { startUpload, permittedFileInfo } = useUploadThing(endpoint, {
    onClientUploadComplete: (res) => {
      sendFile(res?.[0].url);
      if (setLoading) setLoading(false);
      setFileLoading(false);
    },
    onUploadError: (error: Error) => {
      toast.error(`${error?.message}`);
      console.log(error);
    },
    onUploadBegin: (name) => {
      toast.loading(`Wysyłam ${name}...`, { id: toastId });
      setNftFile(files[0]);
    },
  });

  const fileTypes = permittedFileInfo?.config
    ? Object.keys(permittedFileInfo?.config)
    : [];

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: fileTypes ? generateClientDropzoneAccept(fileTypes) : undefined,
  });

  // Hydration issue workaround (fix)
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) return null;

  if (files.length > 0) {
    return (
      <div className="w-full h-full flex items-center justify-center rounded-lg flex-col relative">
        <div className=" flex items-center justify-center flex-col w-full">
          <p className="text-blue-600 w-3/4 h-fit truncate text-center">
            {files[0].name}
          </p>
          <Button
            disabled={fileLoading}
            type="button"
            onClick={() => {
              startUpload(files);
              setFileLoading(true);
              if (setLoading) setLoading(true);
            }}
          >
            Wyślij plik
          </Button>
        </div>
        <Button
          className="absolute top-4 right-4 cursor-pointer w-8 h-8
          bg-red-600 rounded-full flex items-center justify-center
          text-white text-lg hover:text-black"
          onClick={() => {
            setFiles([]);
          }}
          disabled={fileLoading}
        >
          X
        </Button>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className="w-full h-full flex items-center justify-center rounded-lg flex-col"
    >
      <input {...getInputProps()} />

      <p className="text-center text-blue-600">Upuść plik tutaj</p>
      <p className="text-center text-blue-600 mb-2">lub</p>
      <p className="text-center mb-2">
        <Button type="button">Kliknij aby wybrać</Button>
      </p>
      <p className="text-xs text-gray-500 text-center lg:px-4">
        Akceptowane typy plików to: {fileTypes.join(", ")}
      </p>
    </div>
  );
};
