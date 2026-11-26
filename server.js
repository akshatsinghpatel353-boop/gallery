
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const GENERATED_DIR = path.join(__dirname, "generated");

if (!fs.existsSync(GENERATED_DIR)) {
  fs.mkdirSync(GENERATED_DIR, { recursive: true });
}

app.use(cors());
app.use(express.json());
app.use("/generated", express.static(GENERATED_DIR));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024
  }
});

app.get("/", (req, res) => {
  res.json({
    message: "WEB GALLERY Gemini Backend is running!"
  });
});

app.post(
  "/api/images/generate",
  upload.single("image"),
  async (req, res) => {
    try {
      const {
        mode,
        prompt,
        style,
        aspectRatio,
        negativePrompt
      } = req.body;

      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({
          message: "Gemini API key is missing in backend/.env"
        });
      }

      if (!prompt || !prompt.trim()) {
        return res.status(400).json({
          message: "Please enter an image prompt."
        });
      }

      if (mode === "image" && !req.file) {
        return res.status(400).json({
          message: "Please upload an image first."
        });
      }

      const { GoogleGenAI } = await import("@google/genai");

      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY
      });

      const fullPrompt = `
        ${prompt}

        Visual style: ${style || "Realistic"}.
        Aspect ratio: ${aspectRatio || "1:1"}.
        ${negativePrompt ? `Avoid: ${negativePrompt}.` : ""}
        Create a high-quality image.
      `;

      let input = fullPrompt;

      if (mode === "image" && req.file) {
        input = [
          {
            type: "image",
            mime_type: req.file.mimetype,
            data: req.file.buffer.toString("base64")
          },
          {
            type: "text",
            text: fullPrompt
          }
        ];
      }

      const interaction = await ai.interactions.create({
        model: "gemini-nano-banana-2.1",
        input,
        response_format: {
          type: "image",
          aspect_ratio: aspectRatio || "1:1",
          image_size: "1K"
        }
      });

      const generatedImage = interaction.output_image;

      if (!generatedImage || !generatedImage.data) {
        throw new Error("Gemini did not return an image.");
      }

      const imageBuffer = Buffer.from(
        generatedImage.data,
        "base64"
      );

      const extension =
        generatedImage.mime_type === "image/jpeg"
          ? "jpg"
          : "png";

      const filename = `${crypto.randomUUID()}.${extension}`;

      fs.writeFileSync(
        path.join(GENERATED_DIR, filename),
        imageBuffer
      );

      const imageUrl =
        `http://localhost:${PORT}/generated/${filename}`;

      res.json({
        success: true,
        imageUrl
      });

    } catch (error) {
      console.error("Gemini image error:", error);

      res.status(500).json({
        message:
          error.message || "Image generation failed."
      });
    }
  }
);

app.listen(PORT, () => {
  console.log(
    `WEB GALLERY backend running on http://localhost:${PORT}`
  );
});
