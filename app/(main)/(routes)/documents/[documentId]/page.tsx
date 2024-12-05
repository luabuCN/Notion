"use client";

import Toolbar from "@/app/(main)/_components/Toobar";
import Cover from "@/components/cover";
import { Skeleton } from "@/components/ui/skeleton";
import dynamic from "next/dynamic";
import { useMemo, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";

interface DocumentIdPageProps {
  params: { documentId: string };
}

const DocumentIdPage = ({ params }: DocumentIdPageProps) => {
  const [document, setDocument] = useState<any>(undefined);
  const [loading, setLoading] = useState(true);

  // const Editor = useMemo(
  //   () =>
  //     dynamic(() => import("@/components/editor"), {
  //       ssr: false,
  //     }),
  //   []
  // );

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await axios.get(`/api/documents/${params.documentId}`);
        setDocument(response.data);
      } catch (error) {
        console.error('Failed to fetch document', error);
        setDocument(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [params.documentId]);

  const handleChange = async (content: string) => {
    try {
      await axios.patch(`/api/documents/${params.documentId}`, { content });
    } catch (error) {
      toast.error('Failed to update document');
    }
  };

  if (loading) {
    return (
      <div>
        <Cover.Skeleton />
        <div className="md:max-w-3xl lg:max-w-4xl mx-auto mt-10">
          <div className="space-y-4 pl-8 pt-4">
            <Skeleton className="h-14 w-[50%]" />
            <Skeleton className="h-14 w-[80%]" />
            <Skeleton className="h-14 w-[40%]" />
            <Skeleton className="h-14 w-[60%]" />
          </div>
        </div>
      </div>
    );
  }

  if (document === null) {
    return <div>Not Found</div>;
  }

  return (
    <div className="pb-40">
      <div className="h-[35vh]">
        <Cover url={document?.coverImage} />
      </div>
      <div className="mx-auto md:max-w-3xl lg:max-w-4xl">
        <Toolbar initialData={document} />
        {/* <Editor onChange={handleChange} initialContent={document?.content} /> */}
      </div>
    </div>
  );
};

export default DocumentIdPage;
