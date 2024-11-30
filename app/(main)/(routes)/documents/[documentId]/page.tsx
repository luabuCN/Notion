"use client";

import Toolbar from "@/app/(main)/_components/Toobar";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";

interface DocumentIdPageProps {
  params: { documentId: Id<"documents"> };
}

const DocumentIdPage = ({ params }: DocumentIdPageProps) => {
  const document = useQuery(api.documents.getById, {
    documentId: params.documentId,
  });
  if (document === undefined) {
    <div>loading...</div>;
  }

  if (document === null) {
    return <div>Not Found </div>;
  }
  return (
    <div className="pb-40 ">
      <div className="h-[35vh]"></div>
      <div className="mb:max-w-3xl lg:md-w-4xl md-auto">
        <Toolbar initialData={document!} />
      </div>
    </div>
  );
};

export default DocumentIdPage;
