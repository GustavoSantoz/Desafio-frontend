import supabase from "@/api/supabaseClient";

async function uploadImages(selectedFiles: File[]): Promise<string[]> {
  const imageUrls: string[] = [];

  for (const file of selectedFiles) {
    try {
      const { error: uploadError } = await supabase.storage
        .from("items")
        .upload(`public/${file.name}`, file);

      if (uploadError) {
        throw new Error(`Error uploading image: ${uploadError.message}`);
      }

      const { data: publicData, error: publicUrlError } = supabase.storage
        .from("items")
        .getPublicUrl(`public/${file.name}`);

      if (publicUrlError) {
        throw new Error(`Error getting public URL: ${publicUrlError.message}`);
      }

      if (publicData) {
        imageUrls.push(publicData.publicUrl);
      } else {
        throw new Error("Error getting public URL: publicData is undefined");
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Upload failed: ${error.message}`);
      } else {
        throw new Error("Unknown error occurred during upload.");
      }
    }
  }

  return imageUrls;
}

export { uploadImages };
