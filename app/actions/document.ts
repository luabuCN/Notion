"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function createDocument(title: string, parentDocumentId?: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("未授权");
  }
  const document = await prisma.document.create({
    data: {
      title,
      parentDocumentId: parentDocumentId || null,
      userId,
      isArchived: false,
      isPublished: false,
    },
  });
  revalidatePath(`/documents/${document.id}`);
  return document;
}

export async function getSidebar(parentDocumentId?: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("未授权");
  }
  const documents = await prisma.document.findMany({
    where: {
      userId,
      parentDocumentId: parentDocumentId || null,
      isArchived: false,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return documents;
}

export async function getDocumentById(documentId: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("未授权");
  }
  const document = await prisma.document.findUnique({
    where: {
      userId,
      id: documentId,
    },
  });
  return document;
}
