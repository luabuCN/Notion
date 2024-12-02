"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/clerk-react";
import { PlusCircle } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import axios from "axios";

const Documents = () => {
  const { user } = useUser();
  const router = useRouter();
  
  const onCreate = async () => {
    try {
      const response = await axios.post('/api/documents', {
        title: "Untitled"
      });

      const documentId = response.data.id;
      router.push(`/documents/${documentId}`);

      toast.success("New note created!");
    } catch (error) {
      toast.error("Failed to create a new note");
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <Image
        src="/empty.png"
        width={300}
        height={300}
        alt="empty"
        className="dark:hidden"
      />
      <Image
        src="/empty-dark.png"
        width={300}
        height={300}
        alt="empty"
        className="hidden dark:block"
      />
      <h2 className="text-lg font-medium">
        Welcome to {user?.fullName}&apos;s Notion
      </h2>
      <Button onClick={onCreate}>
        <PlusCircle className="w-4 h-4 mr-2" />
        Create a note
      </Button>
    </div>
  );
};

export default Documents;
