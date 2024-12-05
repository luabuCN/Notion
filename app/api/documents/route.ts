import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    
    const { userId } = await auth();
    
    const body = await req.json();
    const { title, parentDocument } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!title) {
      return new NextResponse("Title is required", { status: 400 });
    }

    const document = await db.document.create({
      data: {
        title,
        parentDocument,
        userId,
        isArchived: false,
        isPublished: false,
      }
    });

    return NextResponse.json(document);
  } catch (error) {
    console.log("[DOCUMENTS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const documents = await db.document.findMany({
      where: {
        userId,
        isArchived: false
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return NextResponse.json(documents);
  } catch (error) {
    console.log("[DOCUMENTS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
