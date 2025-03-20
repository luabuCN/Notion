"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/clerk-react";
import { PlusCircle } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useCreateDocument } from "../../useDocumentQuery";
import { useQueryClient } from "@tanstack/react-query";
const Documents = () => {
  const { user } = useUser();
  const router = useRouter();
  const { mutate } = useCreateDocument();
  const queryClient = useQueryClient();
  const onCreate = () => {
    mutate(
      {
        title: "未命名",
      },
      {
        onSuccess: async (res) => {
          await queryClient.invalidateQueries({
            queryKey: ["sidebarDocuments"],
          });
          router.push(`/documents/${res.id}`);
          toast.success("新笔记已创建！");
        },
        onError: () => {
          toast.error("创建新笔记失败");
        },
      }
    );
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
