import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

interface IParams {
  documentId: string;
}

export async function GET(
  req: Request,
  { params }: { params: IParams }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const document = await db.document.findUnique({
      where: {
        id: params.documentId,
        userId
      }
    });

    return NextResponse.json(document);
  } catch (error) {
    console.log("[DOCUMENT_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: IParams }
) {
  try {
    const { userId } = await auth();
    const body = await req.json();

    const { title, content, coverImage, icon, isPublished } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const document = await db.document.update({
      where: {
        id: params.documentId,
        userId
      },
      data: {
        title,
        content,
        coverImage,
        icon,
        isPublished
      }
    });

    return NextResponse.json(document);
  } catch (error) {
    console.log("[DOCUMENT_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: IParams }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const document = await db.document.delete({
      where: {
        id: params.documentId,
        userId
      }
    });

    return NextResponse.json(document);
  } catch (error) {
    console.log("[DOCUMENT_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
