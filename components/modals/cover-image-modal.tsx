"use client";

import { useCoverImage } from "@/hooks/use-cover-image";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import { useState } from "react";
import { useEdgeStore } from "@/lib/edgestore";
import { useParams } from "next/navigation";
import { SingleImageDropzone } from "../single-image-dropzone";
import axios from "axios";

const CoverImageModal = () => {
  const params = useParams();
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

      try {
        const res = await edgestore.publicFiles.upload({
          options: {
            replaceTargetUrl: coverImage.url,
          },
          file,
        });

        await axios.patch(`/api/documents/${params.documentId}`, {
          coverImage: res.url,
        });

        onClose();
      } catch (error) {
        console.error("Failed to update cover image:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <Dialog open={coverImage.isOpen} onOpenChange={coverImage.onClose}>
      <DialogContent>
        <DialogHeader>
          <h2 className="text-center text-lg font-semibold">Cover Image</h2>
        </DialogHeader>
        <SingleImageDropzone
          className="w-full outline-none"
          disabled={isSubmitting}
          onChange={onChange}
          value={file}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CoverImageModal;
