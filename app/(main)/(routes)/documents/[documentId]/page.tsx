"use client";

import Toolbar from "@/app/(main)/_components/Toobar";
import Cover from "@/components/cover";
import { Skeleton } from "@/components/ui/skeleton";
import { useDocumentQuery } from "@/app/(main)/useDocumentQuery";
interface DocumentIdPageProps {
  params: { documentId: string };
}

const DocumentIdPage = ({ params }: DocumentIdPageProps) => {
  const { data: document, isLoading } = useDocumentQuery(
    params.documentId as string
  );

  if (isLoading) {
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
      </div>
    </div>
  );
};

export default DocumentIdPage;
