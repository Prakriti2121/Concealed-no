"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  AlertCircle,
  Upload,
  X,
  ExternalLink,
  Edit,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRouter } from "next/navigation";

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

export default function BannerPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [newBanner, setNewBanner] = useState({
    title: "",
    link: "",
    image: "",
    description: "",
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMediaGalleryOpen, setIsMediaGalleryOpen] = useState(false);
  const [mediaImages, setMediaImages] = useState<MediaImage[]>([]);
  const [selectedImageFromGallery, setSelectedImageFromGallery] = useState<
    string | null
  >(null);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchBanners();
    fetchMediaImages();
  }, []);

  async function fetchBanners() {
    try {
      setIsLoading(true);
      // Use relative URL - this runs in the browser via useEffect
      const response = await fetch("/api/banners");
      if (!response.ok) throw new Error("Failed to fetch banners");
      const data = await response.json();
      setBanners(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching banners:", error);
      setError("Failed to load banners. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchMediaImages() {
    try {
      // Use relative URL - this runs in the browser via useEffect
      const response = await fetch("/api/media", {
        cache: "no-store",
      });
      if (!response.ok) throw new Error("Failed to fetch media images");
      const images = await response.json();
      setMediaImages(images); // images is an array of objects
    } catch (error) {
      // Silently fail - media images are optional
      console.warn("Could not load media images:", error);
      setMediaImages([]); // Set empty array instead of showing error
    }
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);
    setIsUploadDialogOpen(false); // Close upload dialog after selecting a file
  };

  // Updated to use the media object's url property
  const handleSelectImageFromGallery = (imageUrl: string) => {
    setSelectedImageFromGallery(imageUrl);
    setPreviewImage(imageUrl);
    setIsMediaGalleryOpen(false);
  };

  const handleUploadFromDevice = () => {
    document.getElementById("image")?.click();
    setIsUploadDialogOpen(false);
  };

  const handleAddBanner = async () => {
    //validation that requires at least one field
    if (
      newBanner.title.trim() !== "" ||
      newBanner.link.trim() !== "" ||
      newBanner.description.trim() !== "" ||
      previewImage !== null
    ) {
      try {
        let imageUrl = "";

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

        const bannerData = {
          title: newBanner.title.trim(),
          link: newBanner.link.trim(),
          description: newBanner.description.trim(),
          image: imageUrl || previewImage || "",
        };

        const response = await fetch("/api/banners", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bannerData),
        });

        if (!response.ok) throw new Error("Failed to add banner");

        const newBannerData = await response.json();

        setBanners((prevBanners) => [
          ...prevBanners,
          {
            ...newBannerData,
            image: bannerData.image,
            link: bannerData.link,
            description: bannerData.description,
          },
        ]);

        setNewBanner({ title: "", link: "", image: "", description: "" });
        setPreviewImage(null);
        setSelectedFile(null);
        setIsAddDialogOpen(false);
        setError(null);
      } catch (error) {
        console.error("Error adding banner:", error);
        setError("Failed to add banner. Please try again.");
      }
    }
  };

  const handleDeleteBanner = async () => {
    if (bannerToDelete !== null) {
      try {
        const response = await fetch("/api/banners", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: bannerToDelete }),
        });

        if (response.ok) {
          setBanners(banners.filter((banner) => banner.id !== bannerToDelete));
          setError(null);
        } else {
          throw new Error("Failed to delete banner");
        }
      } catch (error) {
        console.error("Error deleting banner:", error);
        setError("Failed to delete banner. Please try again.");
      } finally {
        setIsDeleteDialogOpen(false);
        setBannerToDelete(null);
      }
    }
  };

  const handleEditBanner = (id: number) => {
    router.push(`/admin/banner/${id}/edit`);
  };

  if (isLoading) {
    return <div className="p-6">Loading banners...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Banners</h1>
          <p className="text-muted-foreground">Manage your banners</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="default">
              <Plus className="h-4 w-4 mr-2" /> Add Banner
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Banner</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newBanner.title}
                  onChange={(e) =>
                    setNewBanner((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="link">Link</Label>
                <Input
                  id="link"
                  value={newBanner.link}
                  onChange={(e) =>
                    setNewBanner((prev) => ({
                      ...prev,
                      link: e.target.value,
                    }))
                  }
                  className="bg-background"
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
                      className="w-full flex items-center justify-center"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {previewImage ? "Change Image" : "Upload Image"}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Short Description</Label>
                <Textarea
                  id="description"
                  value={newBanner.description}
                  onChange={(e) =>
                    setNewBanner((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="bg-background"
                  rows={3}
                />
              </div>

              <Button
                type="button"
                className="w-full mt-4"
                onClick={handleAddBanner}
              >
                Add Banner
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Dialog for Image Selection (Choose Device or Media) */}
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

      {/* Media Gallery Dialog */}
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
                {/* Fixed container with uniform dimensions */}
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

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 gap-6">
        {banners.map((banner) => (
          <div
            key={banner.id}
            className="relative overflow-hidden rounded-lg shadow-lg"
          >
            <Image
              src={banner.image || "/placeholder.svg"}
              alt={banner.title || "Banner image"}
              className="w-full h-64 object-cover"
              width={300}
              height={150}
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-6">
              <h3 className="text-2xl font-bold text-white mb-2">
                {banner.title}
              </h3>
              <p className="text-white text-sm mb-4">{banner.description}</p>
              <div className="flex justify-between items-center">
                <a
                  href={banner.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:underline flex items-center"
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Visit Link
                </a>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditBanner(banner.id)}
                  >
                    <Edit className="h-4 w-4" /> Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setBannerToDelete(banner.id);
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {banners.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No banners found. Add your first banner to get started.
          </div>
        )}
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this banner?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteBanner}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
