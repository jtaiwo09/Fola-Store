// components/admin/products/ImageUploadField.tsx
"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Upload, Link as LinkIcon, Loader2 } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUploadImages } from "@/lib/hooks/useUpload";
import { toast } from "sonner";

interface ImageUploadFieldProps {
  label: string;
  images: string[];
  onChange: (images: string[]) => void;
  error?: any;
  maxImages?: number;
  required?: boolean;
}

export default function ImageUploadField({
  label,
  images,
  onChange,
  error,
  maxImages = 5,
  required,
}: ImageUploadFieldProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [uploadMethod, setUploadMethod] = useState<"url" | "upload">("upload");

  const uploadImages = useUploadImages();

  const handleAddUrl = () => {
    if (urlInput && images.length < maxImages) {
      onChange([...images, urlInput]);
      setUrlInput("");
      setDialogOpen(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const remainingSlots = maxImages - images.length;
    const filesToUpload = files.slice(0, remainingSlots);

    if (files.length > remainingSlots) {
      toast.warning(
        `Only uploading ${remainingSlots} image(s). Maximum of ${maxImages} images allowed.`
      );
    }

    uploadImages.mutate(filesToUpload, {
      onSuccess: (data) => {
        const newUrls = data.data.images.map((img) => img.url);
        onChange([...images, ...newUrls]);
        setDialogOpen(false);
        toast.success(`${newUrls.length} image(s) uploaded successfully`);

        // Reset input
        e.target.value = "";
      },
    });
  };

  const handleRemove = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div>
      <Label>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>

      <div className="mt-2">
        {images.length > 0 && (
          <div className="grid grid-cols-3 md:grid-cols-4 gap-4 mb-4">
            {images.map((img, index) => (
              <div
                key={index}
                className="relative group aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden"
              >
                <Image
                  src={img}
                  alt={`${label} ${index + 1}`}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    onClick={() => handleRemove(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                {index === 0 && (
                  <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                    Primary
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {images.length < maxImages && (
          <Button
            type="button"
            variant="outline"
            onClick={() => setDialogOpen(true)}
            className="w-full"
            disabled={uploadImages.isPending}
          >
            {uploadImages.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Add Image ({images.length}/{maxImages})
              </>
            )}
          </Button>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600 mt-1">
          {error.message || "At least one image is required"}
        </p>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Image</DialogTitle>
            <DialogDescription>
              Upload an image or provide a URL
            </DialogDescription>
          </DialogHeader>

          <Tabs
            value={uploadMethod}
            onValueChange={(v) => setUploadMethod(v as any)}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">Upload File</TabsTrigger>
              <TabsTrigger value="url">Image URL</TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-4">
              <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500 mb-4">
                  PNG, JPG, WEBP up to 5MB
                </p>
                <Input
                  type="file"
                  accept="image/*"
                  multiple={maxImages > 1}
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                  disabled={uploadImages.isPending}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    document.getElementById("file-upload")?.click()
                  }
                  disabled={uploadImages.isPending}
                >
                  {uploadImages.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Select Files
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="url" className="space-y-4">
              <div>
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  placeholder="https://example.com/image.jpg"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="mt-1.5"
                />
              </div>
              <Button
                type="button"
                onClick={handleAddUrl}
                disabled={!urlInput}
                className="w-full"
              >
                <LinkIcon className="w-4 h-4 mr-2" />
                Add from URL
              </Button>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}
