"use client";

import ConfirmModal from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";

interface BannerProps {
  documentId: string;
}

const Banner = ({ documentId }: BannerProps) => {
  const router = useRouter();

  const onRemove = async () => {
    try {
      await axios.delete(`/api/documents/${documentId}`);
      toast.success("Note deleted successfully");
      router.push("/documents");
    } catch (error) {
      toast.error("Failed to delete note");
    }
  };

  const onRestore = async () => {
    try {
      await axios.patch(`/api/documents/${documentId}/restore`);
      toast.success("Note restored successfully");
    } catch (error) {
      toast.error("Failed to restore note");
    }
  };

  return (
    <div className="w-full bg-rose-500 text-center text-white text-sm p-2 flex items-center gap-x-2 justify-center">
      <p>This page is in Trash</p>
      <Button
        size="sm"
        onClick={onRestore}
        variant="outline"
        className="border-white bg-transparent hover:bg-primary/5 text-white hover:text-muted-foreground p-1 px-2 h-auto font-normal"
      >
        Restore Page
      </Button>
      <ConfirmModal onConfirm={onRemove}>
        <Button
          size="sm"
          variant="outline"
          className="border-white bg-transparent hover:bg-primary/5 text-white hover:text-muted-foreground p-1 px-2 h-auto font-normal"
        >
          Remove Page
        </Button>
      </ConfirmModal>
    </div>
  );
};

export default Banner;
