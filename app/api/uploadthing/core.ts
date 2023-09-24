import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  NFT: f({
    image: { maxFileSize: "8MB", maxFileCount: 1 },
    video: { maxFileSize: "32MB", maxFileCount: 1 },
    audio: { maxFileSize: "8MB", maxFileCount: 1 },
    pdf: { maxFileSize: "8MB", maxFileCount: 1 },
    "image/svg+xml": { maxFileSize: "8MB", maxFileCount: 1 },
  }).onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
