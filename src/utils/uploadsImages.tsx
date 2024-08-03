import supabase from "@/Supabase/supabaseClient";

async function generateFileHash(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export async function uploadImages(selectedFiles: File[]): Promise<string[]> {
  const imageUrls: string[] = [];

  for (const file of selectedFiles) {
    try {
      const hash = await generateFileHash(file);
      const fileExtension = file.name.split('.').pop(); 
      const filePath = `public/${hash}.${fileExtension}`;

      const { error } = await supabase.storage
        .from("items")
        .upload(filePath, file);

      if (error) {
        throw new Error(`Error uploading image: ${error.message}`);
      }

      const { data: publicData } = supabase.storage
        .from("items")
        .getPublicUrl(filePath);

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
