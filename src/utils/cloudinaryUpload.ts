import axios from 'axios';

/**
 * Uploads a file to Cloudinary using unsigned preset.
 * @param file - File to upload
 * @returns URL string of the uploaded file
 */
export const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "unsigned_upload"); // Your unsigned preset
  formData.append("cloud_name", "de1c6rdvn");

  try {
    const response = await axios.post(
      "https://api.cloudinary.com/v1_1/de1c6rdvn/upload",
      formData
    );
    return response.data.secure_url;
  } catch (error) {
    console.error("❌ Cloudinary Upload Error:", error);
    throw new Error("Upload to Cloudinary failed");
  }
};