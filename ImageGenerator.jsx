
import { useRef, useState } from "react";
import {
  Sparkles,
  Upload,
  Image as ImageIcon,
  Download,
  RefreshCw
} from "lucide-react";

import { generateImage } from "../services/imageApi";

export default function ImageGenerator({ onImageGenerated }) {
  const [mode, setMode] = useState("text");
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [style, setStyle] = useState("Realistic");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fileRef = useRef(null);

  const styles = [
    "Realistic",
    "Cinematic",
    "Anime",
    "3D Render",
    "Digital Art",
    "Portrait",
    "Fantasy",
    "Minimalist",
    "Vintage",
    "Cyberpunk"
  ];

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Image size must be below 10 MB.");
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
    setError("");
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please enter an image prompt.");
      return;
    }

    if (mode === "image" && !image) {
      setError("Please upload an image first.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await generateImage({
        mode,
        prompt,
        image,
        style,
        aspectRatio,
        negativePrompt
      });

      setPreview(result.imageUrl);

      if (onImageGenerated) {
        onImageGenerated(result.imageUrl);
      }
    } catch (err) {
      setError(err.message || "Image generation failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!preview) return;

    const link = document.createElement("a");
    link.href = preview;
    link.download = "web-gallery-ai-image.png";
    link.click();
  };

  return (
    <section className="generator-section" id="ai-generator">
      <div className="section-heading">
        <div>
          <h2>AI Image Generator</h2>
          <p>Create images from text or transform an existing image.</p>
        </div>
      </div>

      <div className="generator-layout">
        <div className="generator-panel">
          <div className="generator-tabs">
            <button
              className={mode === "text" ? "active" : ""}
              onClick={() => setMode("text")}
            >
              Text to Image
            </button>

            <button
              className={mode === "image" ? "active" : ""}
              onClick={() => setMode("image")}
            >
              Image to Image
            </button>
          </div>

          {mode === "image" && (
            <div
              className="upload-area"
              onClick={() => fileRef.current?.click()}
            >
              <Upload size={28} />
              <p>{image ? image.name : "Click to upload an image"}</p>
              <small>PNG, JPG or WEBP · Maximum 10 MB</small>

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageUpload}
              />
            </div>
          )}

          <div className="generator-field">
            <label>Describe your image</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A cinematic mountain landscape at sunset..."
            />
          </div>

          <div className="generator-field">
            <label>Negative Prompt (Optional)</label>
            <input
              value={negativePrompt}
              onChange={(e) => setNegativePrompt(e.target.value)}
              placeholder="Blurry, low quality, distorted..."
            />
          </div>

          <div className="generator-field">
            <label>Choose Style</label>
            <div className="style-options">
              {styles.map((item) => (
                <button
                  key={item}
                  className={style === item ? "active" : ""}
                  onClick={() => setStyle(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="generator-field">
            <label>Aspect Ratio</label>
            <div className="ratio-options">
              {["1:1", "4:5", "9:16", "16:9"].map((ratio) => (
                <button
                  key={ratio}
                  className={aspectRatio === ratio ? "active" : ""}
                  onClick={() => setAspectRatio(ratio)}
                >
                  {ratio}
                </button>
              ))}
            </div>
          </div>

          <button
            className="btn btn-primary"
            style={{ width: "100%" }}
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? (
              <>
                <RefreshCw size={17} /> Generating...
              </>
            ) : (
              <>
                <Sparkles size={17} /> Generate Image
              </>
            )}
          </button>

          {error && <p className="generator-error">{error}</p>}
        </div>

        <div className="generator-panel">
          <h3 style={{ marginBottom: 18 }}>Your Result</h3>

          <div className="generator-result">
            {preview ? (
              <img src={preview} alt="Generated preview" />
            ) : (
              <p>
                <ImageIcon size={35} />
                <br />
                Your generated image will appear here.
              </p>
            )}
          </div>

          {preview && (
            <button
              className="btn btn-secondary"
              style={{ width: "100%", marginTop: 15 }}
              onClick={handleDownload}
            >
              <Download size={17} /> Download Image
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
