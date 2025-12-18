"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Upload, Trash2, Copy, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

type MediaGalleryProps = {
  images: {
    url: string;
    name: string;
    uploadTime: string;
    size: string;
    fullUrl: string;
  }[];
};

const MediaGallery: React.FC<MediaGalleryProps> = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState<
    MediaGalleryProps["images"][0] | null
  >(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [galleryImages, setGalleryImages] = useState(images);
  const [file, setFile] = useState<File | null>(null);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // When an image is clicked, open details and reset copied state
  const handleImageClick = (image: MediaGalleryProps["images"][0]) => {
    setSelectedImage(image);
    setCopied(false);
  };

  // Close the image details dialog
  const handleCloseDialog = () => {
    setSelectedImage(null);
    setCopied(false);
  };

  // Delete the selected image with error handling
  const handleDeleteImage = async () => {
    if (selectedImage) {
      try {
        const response = await fetch("/api/media", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageName: selectedImage.name }),
        });

        if (response.ok) {
          setGalleryImages(
            galleryImages.filter((img) => img.name !== selectedImage.name)
          );
          setSelectedImage(null);
        } else {
          console.error("Failed to delete image");
        }
      } catch (error) {
        console.error("Error deleting image:", error);
      }
    }
  };

  // Handle file selection and open the upload preview dialog
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setIsUploadDialogOpen(true);
    }
  };

  // Upload the selected image file with error handling
  const handleUploadImage = async () => {
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const newImage = await response.json();
          // Expected newImage properties: url, name, uploadTime, size, fullUrl
          // Insert the new image at the beginning of the gallery
          setGalleryImages([newImage, ...galleryImages]);
          setIsUploadDialogOpen(false);
        } else {
          console.error("Failed to upload image");
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  // Copy the image full URL to the clipboard
  const handleCopyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy URL:", error);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 px-4 pr-12">
        <h2 className="text-3xl font-bold text-gray-800">Media Gallery</h2>
        <Button onClick={() => document.getElementById("image")?.click()}>
          <Upload className="h-4 w-4 mr-2" /> Add Image
        </Button>
      </div>

      {/* Hidden file input */}
      <input
        id="image"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Gallery Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "16px",
          padding: "16px",
        }}
      >
        {galleryImages.length === 0 ? (
          <p>No images found.</p>
        ) : (
          galleryImages.map((image) => (
            <div
              key={image.name}
              className="relative cursor-pointer overflow-hidden rounded-lg transition-all duration-300 hover:shadow-xl"
              onClick={() => handleImageClick(image)}
            >
              <Image
                src={image.url}
                alt={image.name}
                width={300}
                height={192}
                className="w-full h-48 object-contain transition-transform duration-300 hover:scale-110 hover:opacity-90 rounded-lg"
              />
              {/* Delete Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage(image);
                  setIsDeleteDialogOpen(true);
                }}
                className="absolute top-2 right-2 bg-white rounded-md p-1 shadow-md"
              >
                <Trash2 className="h-4 w-4 text-red-600" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Image Details Modal */}
      {selectedImage && (
        <Dialog open={true} onOpenChange={handleCloseDialog}>
          <DialogContent className="bg-[#f9f9f9]">
            <DialogHeader>
              <DialogTitle>Image Details</DialogTitle>
            </DialogHeader>
            <div>
              <Image
                src={selectedImage.url}
                alt={selectedImage.name}
                width={600}
                height={256}
                className="w-full h-64 object-contain rounded-md mb-4"
              />
              <div className="space-y-2 text-xs">
                <p>
                  <strong>Name:</strong> {selectedImage.name}
                </p>
                <p>
                  <strong>Upload Date:</strong> {selectedImage.uploadTime}
                </p>
                <p>
                  <strong>Size:</strong> {selectedImage.size}
                </p>
                <p className="flex">
                  <strong className="mr-2">URL:</strong>
                  <a
                    href={selectedImage.fullUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline break-all"
                  >
                    {selectedImage.fullUrl}
                  </a>
                  <button
                    className="ml-2 text-gray-600 hover:text-black transition-colors"
                    onClick={() => handleCopyUrl(selectedImage.fullUrl)}
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-black" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleCloseDialog}>
                Close
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  setIsDeleteDialogOpen(true);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete this image?</p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                handleDeleteImage();
                setIsDeleteDialogOpen(false);
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Image Preview and Confirmation Dialog */}
      {isUploadDialogOpen && file && (
        <Dialog open={true} onOpenChange={() => setIsUploadDialogOpen(false)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Preview & Upload</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Image
                src={URL.createObjectURL(file)}
                alt="Image Preview"
                width={600}
                height={256}
                className="w-full h-64 object-cover rounded-md"
              />
              <div className="mt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsUploadDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  onClick={handleUploadImage}
                  className="ml-2"
                >
                  Upload
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default MediaGallery;
