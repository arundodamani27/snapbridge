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
      .select("*")
      .eq("access_code", accessCode.toUpperCase())
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "File not found" },
        { status: 404 }
      );
    }

    // delete from storage
    await supabaseAdmin.storage
      .from("temp-files")
      .remove([data.file_path]);

    // delete from database
    await supabaseAdmin
      .from("temporary_files")
      .delete()
      .eq("id", data.id);

    return NextResponse.json({
      success: true,
      message: "File deleted successfully",
    });

  } catch {
    return NextResponse.json(
      { error: "Delete failed" },
      { status: 500 }
    );
  }
}