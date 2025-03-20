"use client";

import Toolbar from "@/app/(main)/_components/Toobar";
import Cover from "@/components/cover";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { getDocumentById } from "@/app/actions/document";
import { Document } from "@prisma/client";

interface DocumentIdPageProps {
  params: { documentId: string };
}

const DocumentIdPage = ({ params }: DocumentIdPageProps) => {
  // const Editor = useMemo(
  //   () =>
  //     dynamic(() => import("@/components/editor"), {
  //       ssr: false,
  //     }),
  //   []
  // );
  const [document, setDocuments] = useState<Document>();
  // const document = useQuery(api.documents.getById, {
  //   documentId: params.documentId,
  // });

  // const update = useMutation(api.documents.update);

  useEffect(() => {
    const fetchDocument = async () => {
      const res = await getDocumentById(params.documentId);
      res && setDocuments(res);
    };
    fetchDocument();
  }, [params.documentId]);

  // const handleChange = (content: string) => {
  //   update({
  //     id: params.documentId,
  //     content,
  //   });
  // };
  if (document === undefined) {
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
    </div>;
  }

  if (document === null) {
    return <div>Not Found </div>;
  }
  return (
    <div className="pb-40 ">
      <div className="h-[35vh]">
        <Cover url={document?.coverImage} />
      </div>
      <div className="mx-auto md:max-w-3xl lg:max-w-4xl">
        <Toolbar initialData={document!} />
        {/* <Editor onChange={handleChange} initialContent={document?.content} /> */}
      </div>
    </div>
  );
};

export default DocumentIdPage;
