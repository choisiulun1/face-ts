"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import Image from "next/image";

interface Photo {
  name: string;
  url: string;
}

export default function PhotosPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const res = await fetch("/api/list");
      if (!res.ok) throw new Error("Failed to fetch photos");
      const data = await res.json();
      console.log(data);
      setPhotos(data.images);
    } catch (error) {
      toast.error("Error fetching photos");
    }
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      toast.success("Uploaded successfully");
      fetchPhotos();
    } catch (error) {
      toast.error("Upload failed");
    }
  };

  const handleDelete = async (filename: string) => {
    try {
      const res = await fetch("/api/delete", {
        method: "POST",
        body: JSON.stringify({ filename }),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Delete failed");
      toast.success("Deleted successfully");
      fetchPhotos();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-extrabold text-center mb-6">
        Photo Manager
      </h1>

      <div className="flex justify-center mb-6">
        <label className="cursor-pointer bg-blue-500 text-white px-6 py-2 rounded shadow hover:bg-blue-600 transition-colors">
          Upload Photo
          <input type="file" onChange={handleUpload} className="hidden" />
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {photos.map((photo, index) => (
          <Card
            key={index}
            className="relative rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <CardContent className="p-2">
              <div className="relative w-full h-40">
                <Image
                  src={photo.url}
                  alt={photo.name}
                  fill
                  className="object-cover rounded"
                />
              </div>
              <div className="mt-2 flex justify-between">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(photo.name)}
                >
                  Delete
                </Button>
                <a
                  href={photo.url}
                  download
                  className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
                >
                  Download
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
