import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ImageUploaderProps {
  onFilesSelected: (files: File[]) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onFilesSelected }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      onFilesSelected(files);
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
