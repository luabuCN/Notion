"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import Toolbar from "@/app/(main)/_components/Toobar";
import Cover from "@/components/cover";
import { Skeleton } from "@/components/ui/skeleton";
import { useDocumentQuery } from "@/app/(main)/useDocumentQuery";
interface DocumentIdPageProps {
  params: {
    documentId: string;
  };
}

export default function DocumentIdPage({ params }: DocumentIdPageProps) {
  const { data: document, isLoading } = useDocumentQuery(
    params.documentId as string
  );

  if (isLoading) {
    return (
      <div>
        <Cover.Skeleton />
        <div className="mx-auto mt-10 md:max-w-3xl lg:max-w-4xl">
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
    return <div>Not found</div>;
  }

  return (
    <section className="pb-40">
      <Cover preview url={document?.coverImage} />
      <div className="mx-auto md:max-w-3xl lg:max-w-4xl">
        <Toolbar preview initialData={document!} />
        {/* <Editor
          editable={false}
          onChange={handleChange}
          initialContent={document?.content}
        /> */}
      </div>
    </section>
  );
}
