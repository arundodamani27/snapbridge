import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { supabaseAdmin } from "@/lib/supabase/server";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/plain",
  "image/jpeg",
  "image/png",
  "image/webp",
];

function sanitizeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Unsupported file type" },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File exceeds 50MB limit" },
        { status: 400 }
      );
    }

    const accessCode = nanoid(6).toUpperCase();
    const sanitizedName = sanitizeFileName(file.name);
    const filePath = `${accessCode}/${sanitizedName}`;

    const fileBuffer = await file.arrayBuffer();

    const { error: uploadError } = await supabaseAdmin.storage
      .from("temp-files")
      .upload(filePath, fileBuffer, {
        contentType: file.type,
      });

    if (uploadError) {
      return NextResponse.json(
        { error: uploadError.message },
        { status: 500 }
      );
    }

    // 10 minute expiry
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const { error: dbError } = await supabaseAdmin
      .from("temporary_files")
      .insert({
        access_code: accessCode,
        file_name: sanitizedName,
        file_path: filePath,
        mime_type: file.type,
        file_size: file.size,
        expires_at: expiresAt.toISOString(),
        is_active: true,
      });

    if (dbError) {
      return NextResponse.json(
        { error: dbError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      accessCode,
      expiresAt: expiresAt.toISOString(),
      fileName: sanitizedName,
    });
  } catch {
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}