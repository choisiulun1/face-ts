import { NextResponse } from "next/server";
import { createClient } from "@/utils/server";

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase.storage.from("photos").list("uploads");
  if (error) {
    return NextResponse.json(
      { error: "Failed to fetch images" },
      { status: 500 },
    );
  }

  const images = data.map((file) => ({
    name: file.name,
    url: supabase.storage.from("photos").getPublicUrl(`uploads/${file.name}`)
      .data.publicUrl,
  }));

  return NextResponse.json({ images });
}
