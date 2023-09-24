"use client";

import toast from "react-hot-toast";

import { UploadDropzone } from "@/lib/uploadthing";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import { useEffect, useState } from "react";

interface FileUploadProps {
  onChange: (url?: string) => void;
  endpoint: keyof typeof ourFileRouter;
  toastId?: string;
}

export const FileUpload = ({
  onChange,
  endpoint,
  toastId,
}: FileUploadProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url);
        toast.dismiss(toastId);
        toast.success(`Wysłano!`);
        console.log(res);
      }}
      onUploadError={(error: Error) => {
        toast.error(`${error?.message}`);
        console.log(error);
      }}
      onUploadBegin={(name: string) => {
        // Do something once upload begins
        toast.loading(`Wysyłam ${name}...`, { id: toastId });
      }}
      className="bg-green-800  ut-button:text-white ut-allowed-content:text-gray-400 ut-label:text-white"
      content={{
        allowedContent({ ready, fileTypes, isUploading }) {
          if (!ready) return "Sprawdzanie dostępnych typów plików...";
          if (isUploading) return "Wygląda na to, że plik jest już wysyłany...";
          return `Możliwe typy plików: ${fileTypes.join(", ")}`;
        },
        label: "Wybierz plik lub przeciągnij go tutaj",
        button: "Wyślij plik",
      }}
    />
  );
};
