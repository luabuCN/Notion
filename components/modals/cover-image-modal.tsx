"use client";

import { useCoverImage } from "@/hooks/use-cover-image";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import { useState } from "react";
import { useEdgeStore } from "@/lib/edgestore";
import { useParams } from "next/navigation";
import { SingleImageDropzone } from "../single-image-dropzone";
import { useUpdateDoc } from "@/app/(main)/useDocumentQuery";

const CoverImageModal = () => {
  const params = useParams();
  const { mutate: update } = useUpdateDoc();
  const [file, setFile] = useState<File>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { edgestore } = useEdgeStore();
  const coverImage = useCoverImage();

  const onClose = () => {
    setFile(undefined);
    setIsSubmitting(false);
    coverImage.onClose();
  };

  const onChange = async (file?: File) => {
    if (file) {
      setIsSubmitting(true);
      setFile(file);
      const res = await edgestore.publicFiles.upload({
        options: {
          replaceTargetUrl: coverImage.url,
        },
        file,
      });

      update({
        id: params.documentId as string,
        coverImage: res.url,
      });

      onClose();
    }
  };

  return (
    <Dialog open={coverImage.isOpen} onOpenChange={coverImage.onClose}>
      <DialogContent>
        <DialogHeader>
          <h2 className=" text-center text-lg font-semibold">Cover Image</h2>
        </DialogHeader>
        <SingleImageDropzone
          className=" w-full outline-none"
          disabled={isSubmitting}
          onChange={onChange}
          value={file}
        ></SingleImageDropzone>
      </DialogContent>
    </Dialog>
  );
};

export default CoverImageModal;
