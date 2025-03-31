"use client";

import { useCoverImage } from "@/hooks/use-cover-image";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import { useState } from "react";
import { useParams } from "next/navigation";
import { useUpdateDoc } from "@/app/(main)/useDocumentQuery";
import { UploadDropzone } from "@/lib/uploadthing";

const CoverImageModal = () => {
  const params = useParams();
  const { mutate: update } = useUpdateDoc();
  const [file, setFile] = useState<File>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const coverImage = useCoverImage();

  const onClose = () => {
    setFile(undefined);
    setIsSubmitting(false);
    coverImage.onClose();
  };

  return (
    <Dialog open={coverImage.isOpen} onOpenChange={coverImage.onClose}>
      <DialogContent>
        <DialogHeader>
          <h2 className=" text-center text-lg font-semibold">封面图片</h2>
        </DialogHeader>
        <UploadDropzone
          endpoint="imageUploader"
          disabled={isSubmitting}
          onClientUploadComplete={(res) => {
            if (res && res.length > 0) {
              update({
                id: params.documentId as string,
                coverImage: res[0].url,
              });
              onClose();
            }
          }}
          onUploadError={(error) => {
            console.error("上传失败:", error);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CoverImageModal;
