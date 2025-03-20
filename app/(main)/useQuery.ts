import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createDocument, getSidebar } from "@/app/actions/document";
export const useSidebarDocuments = (parentDocumentId?: string) => {
  return useQuery({
    queryKey: ["sidebarDocuments", parentDocumentId],
    queryFn: () => getSidebar(parentDocumentId),
    staleTime: 0,
  });
};

export const useCreateDocument = () => {
  return useMutation({
    mutationFn: async (params: {
      title: string;
      parentDocumentId?: string;
    }) => {
      return createDocument(params.title, params.parentDocumentId);
    },
  });
};
