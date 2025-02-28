import { NextResponse } from "next/server";
import { createClient } from "@/utils/sever";

export async function POST(req: Request) {
  const supabase = await createClient();
  const { filename } = await req.json();
  const filePath = `uploads/${filename}`;

  const { error } = await supabase.storage.from("photos").remove([filePath]);

  if (error) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }

  return NextResponse.json({ message: "Deleted successfully" });
}
