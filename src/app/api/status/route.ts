import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const { accessCode } = await request.json();

    if (!accessCode) {
      return NextResponse.json(
        { error: "Access code required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("temporary_files")
      .select("is_accessed, expires_at, file_path, id")
      .eq("access_code", accessCode.toUpperCase())
      .eq("is_active", true)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "File not found" },
        { status: 404 }
      );
    }

    // expiry cleanup
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      await supabaseAdmin.storage
        .from("temp-files")
        .remove([data.file_path]);

      await supabaseAdmin
        .from("temporary_files")
        .delete()
        .eq("id", data.id);

      return NextResponse.json({
        expired: true,
      });
    }

    return NextResponse.json({
      isAccessed: data.is_accessed,
    });

  } catch {
    return NextResponse.json(
      { error: "Status check failed" },
      { status: 500 }
    );
  }
}