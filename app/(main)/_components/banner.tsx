"use client";

import ConfirmModal from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface BannerProps {
  documentId: Id<"documents">;
}

const Banner = ({ documentId }: BannerProps) => {
  const router = useRouter();
  const remove = useMutation(api.documents.remove);
  const restore = useMutation(api.documents.restore);

  const onRemove = () => {
    const promise = remove({ id: documentId });

    toast.promise(promise, {
      loading: "正在删除笔记...",

      success: "笔记删除成功",

      error: "删除笔记失败",
    });
    router.push("/documents");
  };

  const onRestore = () => {
    const promise = restore({ id: documentId });

    toast.promise(promise, {
      loading: "正在恢复笔记...",

      success: "笔记恢复成功",

      error: "恢复笔记失败",
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
