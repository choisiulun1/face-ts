import { NextResponse } from "next/server";
import { createClient } from "@/utils/server";

export async function POST(req: Request) {
  console.log("POST /api/upload");
  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  console.log(user);
  const fileExt = file.name.split(".").pop();
  const filePath = `uploads/${Date.now()}.${fileExt}`;
  const { error } = await supabase.storage
    .from("photos")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });
  console.log(error);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: publicURL } = supabase.storage
    .from("photos")
    .getPublicUrl(filePath);

  return NextResponse.json({
    message: "Uploaded successfully",
    url: publicURL,
  });
}
