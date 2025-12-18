"use client";

import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X, Upload } from "lucide-react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Banner {
  id: number;
  title: string;
  link: string;
  image: string;
  description: string;
}

interface MediaImage {
  url: string;
}
export default function EditBannerPage() {
  const { id } = useParams();
  const router = useRouter();
  const [banner, setBanner] = useState<Banner | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // New states for image upload options
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isMediaGalleryOpen, setIsMediaGalleryOpen] = useState(false);
  const [mediaImages, setMediaImages] = useState<MediaImage[]>([]);
  const [selectedImageFromGallery, setSelectedImageFromGallery] = useState<
    string | null
  >(null);

  useEffect(() => {
    // Fetch banner data
    const fetchBanner = async () => {
      try {
        const res = await fetch(`/api/banners/${id}`);
        if (!res.ok) throw new Error("Failed to fetch banner");
        const data = await res.json();
        setBanner(data);
        setPreviewImage(data.image);
      } catch (err) {
        setError("Error loading banner details.");
        console.error("Error fetching banner:", err);
      }
    };

    // Fetch media images for "Select from Media"
    const fetchMediaImages = async () => {
      try {
        const res = await fetch("/api/media", {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to fetch media images");
        const images = await res.json();
        setMediaImages(images);
      } catch (err) {
        console.error("Error fetching media images:", err);
      }
    };

    if (id) {
      fetchBanner();
      fetchMediaImages();
    }
  }, [id]);

  const handleImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Opens file input for device upload
  const handleUploadFromDevice = () => {
    document.getElementById("image")?.click();
    setIsUploadDialogOpen(false);
  };

  // Set image from media gallery
  const handleSelectImageFromGallery = (imageUrl: string) => {
    setSelectedImageFromGallery(imageUrl);
    setPreviewImage(imageUrl);
    setIsMediaGalleryOpen(false);
  };

  const handleSaveChanges = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      let imageUrl = banner?.image || "";

      if (selectedFile) {
        const uploadFormData = new FormData();
        uploadFormData.append("file", selectedFile);

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: uploadFormData,
        });

        if (!uploadResponse.ok) throw new Error("Image upload failed");
        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.url;
      } else if (selectedImageFromGallery) {
        imageUrl = selectedImageFromGallery;
      }

      const updatedBannerData = {
        title: banner?.title || null,
        link: banner?.link || null,
        description: banner?.description || null,
        image: imageUrl || previewImage || null,
      };

      // Add validation that requires at least one field
      if (
        !updatedBannerData.title &&
        !updatedBannerData.link &&
        !updatedBannerData.description &&
        !updatedBannerData.image
      ) {
        setError("At least one banner field is required");
        setIsSaving(false);
        return;
      }

      const response = await fetch(`/api/banners/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedBannerData),
      });

      if (!response.ok) throw new Error("Failed to update banner");

      router.push("/admin/banner");
    } catch (err) {
      console.error("Error updating banner:", err);
      setError("Failed to update banner. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!banner) {
    return <div className="p-6">Loading banner...</div>;
  }

  return (
    <div className="p-6 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Edit Banner</h1>
      </div>

      {error && (
        <div className="alert alert-error">
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSaveChanges} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={banner?.title || ""}
              onChange={(e) => setBanner({ ...banner!, title: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="link">Link</Label>
            <Input
              id="link"
              value={banner?.link || ""}
              onChange={(e) => setBanner({ ...banner!, link: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={banner?.description || ""}
              onChange={(e) =>
                setBanner({ ...banner!, description: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Image</Label>
            <div className="flex flex-col gap-4">
              {previewImage && (
                <div className="relative w-full h-48">
                  <Image
                    src={previewImage || "/placeholder.svg"}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-md"
                    width={300}
                    height={150}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-0 right-0 h-6 w-6"
                    onClick={() => {
                      setPreviewImage(null);
                      setSelectedFile(null);
                      setSelectedImageFromGallery(null);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <div className="flex gap-2">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsUploadDialogOpen(true)}
                  className="flex-1 flex items-center justify-center"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {previewImage ? "Change Image" : "Upload Image"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </form>

      {/* Dialog for Image Source Selection */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Image Source</DialogTitle>
          </DialogHeader>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={handleUploadFromDevice}
              className="w-full"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload from Device
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setIsMediaGalleryOpen(true);
                setIsUploadDialogOpen(false);
              }}
              className="w-full"
            >
              <Upload className="h-4 w-4 mr-2" />
              Select from Media
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Media Gallery Dialog with fixed size grid */}
      <Dialog open={isMediaGalleryOpen} onOpenChange={setIsMediaGalleryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select an Image from Media</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-2 h-64 overflow-y-auto">
            {mediaImages.map((media, index) => (
              <div
                key={index}
                className="cursor-pointer"
                onClick={() => handleSelectImageFromGallery(media.url)}
              >
                <div className="relative w-full h-32">
                  <Image
                    src={media.url}
                    alt={`Image ${index}`}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
