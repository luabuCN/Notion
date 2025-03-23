"use client";

import ConfirmModal from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useRemove, useRestore } from "../useDocumentQuery";

interface BannerProps {
  documentId: string;
}

const Banner = ({ documentId }: BannerProps) => {
  const router = useRouter();
  const { mutate:remove } = useRemove()
  const { mutate:restore } = useRestore();

  const onRemove = () => {
    remove(documentId, {
      onSuccess: () => {
        toast.success("笔记已删除");
        router.push("/documents");
      },
      onError: () => {
        toast.error("删除笔记失败");
      },
    })
  };

  const onRestore = () => {
  restore(documentId, {
    onSuccess: () => {
      toast.success("笔记已恢复！");
    },
    onError: () => {
      toast.error("恢复笔记失败。");
    },
  });
  };

  return (
    <div className="w-full bg-rose-500 text-center text-white text-sm p-2 flex items-center gap-x-2 justify-center">
      <p> 此页面在回收站中</p>
      <Button
        size="sm"
        onClick={onRestore}
        variant="outline"
        className=" border-white bg-transparent hover:bg-primary/5 text-white hover:text-muted-foreground p-1 px-2 h-auto font-normal"
      >
        恢复页面
      </Button>
      <ConfirmModal onConfirm={onRemove}>
        <Button
          size="sm"
          variant="outline"
          className=" border-white bg-transparent hover:bg-primary/5 text-white hover:text-muted-foreground  p-1 px-2 h-auto font-normal"
        >
          删除页面
        </Button>
      </ConfirmModal>
    </div>
  );
};
export default Banner;
