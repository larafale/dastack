import { uploadFiles } from "@/actions/docs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('files') as File[];
    
    if (!files || files.length === 0) {
      return NextResponse.json({ err: { message: 'No files provided' } }, { status: 400 });
    }

    const docs = await uploadFiles(files);
    return NextResponse.json(docs);
  } catch (err) {
    return NextResponse.json(
      { err: { message: 'Failed to process upload' } },
      { status: 500 }
    );
  }
}