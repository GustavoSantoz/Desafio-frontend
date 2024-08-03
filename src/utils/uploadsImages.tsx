import supabase from "@/Supabase/supabaseClient";

function generateRandomString(length: number) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
}

export async function uploadImages(selectedFiles: File[]): Promise<string[]> {
  const imageUrls: string[] = [];

  for (const file of selectedFiles) {
    try {
      const hash = generateRandomString(8);
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
