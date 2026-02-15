import { supabase } from "../utils/supabaseClient";

export const uploadProfileImage = async (file) => {
  if (!file) throw new Error("No file selected");

  const ext = file.name.split(".").pop();
  const fileName = `staff/${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from("profile-images")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: true,
      contentType: file.type,
    });

  if (error) throw error;

  const { data } = supabase.storage
    .from("profile-images")
    .getPublicUrl(fileName);

  return data.publicUrl; // ✅ save this in Profile_image
};
