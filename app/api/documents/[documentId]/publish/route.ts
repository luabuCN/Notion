import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

interface IParams {
  documentId: string;
}

export async function PATCH(
  req: Request,
  { params }: { params: IParams }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const document = await db.document.update({
      where: {
        id: params.documentId,
        userId
      },
      data: {
        isPublished: true
      }
    });

    return NextResponse.json(document);
  } catch (error) {
    console.log("[DOCUMENT_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
