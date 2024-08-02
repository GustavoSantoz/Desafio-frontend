import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ImageUploaderProps {
  onFilesSelected: (files: File[]) => void;
}

const ImageUploader = ({ onFilesSelected }: ImageUploaderProps) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      onFilesSelected(Array.from(files));
    }
  };

  return (
    <div>
      <Label htmlFor="images" className="block">
        Imagens
      </Label>
      <Input
        type="file"
        id="images"
        multiple
        onChange={handleFileChange}
        className="block w-full mt-1"
      />
    </div>
  );
};

export default ImageUploader;
