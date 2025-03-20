"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/clerk-react";
import { PlusCircle } from "lucide-react";
import Image from "next/image";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
const Documents = () => {
  const { user } = useUser();
  const create = useMutation(api.documents.create);
  const router = useRouter();
  const onCreate = () => {
    const promise = create({
      title: "未命名",
    }).then((documentId) => router.push(`/documents/${documentId}`));

    toast.promise(promise, {
      loading: "正在创建新笔记...",
      success: "新笔记已创建！",
      error: "创建新笔记失败",
    });
  };

  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <Image
        src="/empty.png"
        width={300}
        height={300}
        alt="空的"
        className="dark:hidden"
      />
      <Image
        src="/empty-dark.png"
        width={300}
        height={300}
        alt="空的"
        className="hidden dark:block"
      />
      <h2 className=" text-lg font-medium">
        欢迎来到 {user?.fullName} 的 Jotion
      </h2>
      <Button onClick={onCreate}>
        <PlusCircle className="w-4 h-4 mr-2" />
        创建笔记
      </Button>
    </div>
  );
};

export default Documents;
