
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function generateImage({
  mode,
  prompt,
  image,
  style,
  aspectRatio,
  negativePrompt
}) {
  const formData = new FormData();

  formData.append("mode", mode);
  formData.append("prompt", prompt);
  formData.append("style", style);
  formData.append("aspectRatio", aspectRatio);
  formData.append("negativePrompt", negativePrompt || "");

  if (mode === "image" && image) {
    formData.append("image", image);
  }

  const response = await fetch(
    `${API_BASE_URL}/api/images/generate`,
    {
      method: "POST",
      body: formData
    }
  );

  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error("Server returned an invalid response.");
  }

  if (!response.ok) {
    throw new Error(
      data.message || "Image generation failed."
    );
  }

  if (!data.imageUrl) {
    throw new Error("Server did not return an image URL.");
  }

  return data;
}
