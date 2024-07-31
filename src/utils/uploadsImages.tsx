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

      const { data: publicData } = await supabase.storage
        .from("items")
        .getPublicUrl(`public/${file.name}`);

      if (!publicData) {
        throw new Error("Error getting public URL: publicData is undefined");
      }

      imageUrls.push(publicData.publicUrl);
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Upload failed: ${error.message}`);
        throw error;
      } else {
        console.error("Unknown error occurred during upload.");
        throw new Error("Unknown error occurred during upload.");
      }
    }
  }

  return imageUrls;
}

export { uploadImages };
