"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

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

export async function archive(documentId: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("未授权");
  }

  const existingDocument = await prisma.document.findUnique({
    where: {
      userId,
      id: documentId,
    },
  });
  if (!existingDocument) {
    throw new Error("文档不存在");
  }

  const archiveDocumentsRecursively = async (docId: string) => {
    const childrenDocuments = await prisma.document.findMany({
      where: {
        parentDocumentId: docId,
      },
      select: {
        id: true,
      },
    });
    await prisma.document.updateMany({
      where: { parentDocumentId: docId },
      data: { isArchived: true },
    });
    for (const child of childrenDocuments) {
      await archiveDocumentsRecursively(child.id);
    }
  };
  await prisma.document.update({
    where: {
      userId,
      id: documentId,
    },
    data: {
      isArchived: true,
    },
  });
  await archiveDocumentsRecursively(documentId);
  return { success: true };
}

export async function getTrashDocuments() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("未授权");
  }
  const documents = await prisma.document.findMany({
    where: {
      userId,
      isArchived: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return documents;
}

export async function restore(documentId: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("未授权");
  }

  const existingDocument = await prisma.document.findUnique({
    where: { id: documentId, userId },
  });

  if (!existingDocument) {
    throw new Error("文档不存在");
  }

  // 递归恢复文档
  const recursiveRestore = async (parentId: string) => {
    const children = await prisma.document.findMany({
      where: { parentDocumentId: parentId, userId },
    });

    for (const child of children) {
      await prisma.document.update({
        where: { id: child.id },
        data: { isArchived: false },
      });
      await recursiveRestore(child.id);
    }
  };

  let updateData: Partial<{ isArchived: boolean; parentDocumentId?: string }> =
    {
      isArchived: false,
    };

  if (existingDocument.parentDocumentId) {
    const parent = await prisma.document.findUnique({
      where: { id: existingDocument.parentDocumentId },
    });

    if (parent?.isArchived) {
      updateData.parentDocumentId = undefined;
    }
  }

  const document = await prisma.document.update({
    where: { id: documentId },
    data: updateData,
  });

  await recursiveRestore(documentId);

  return document;
}

export async function remove(documentId: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("未授权");
  }

  const existingDocument = await prisma.document.findUnique({
    where: { id: documentId, userId },
  });

  if (!existingDocument) {
    throw new Error("文档不存在");
  }

  const deletedDocument = await prisma.document.delete({
    where: { id: documentId },
  });

  return deletedDocument;
}
