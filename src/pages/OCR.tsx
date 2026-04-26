import { useState, useRef } from "react";

const OCR = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [text, setText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Convert file to data URL (used by both file upload and paste)
  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Tesseract recognition (dynamic import to stay Vite‑friendly)
  const recognizeText = async (imgUrl: string) => {
    setLoading(true);
    setError(null);
    try {
      const { default: Tesseract } = await import("tesseract.js");
      const worker = await Tesseract.createWorker("eng");
      const { data } = await worker.recognize(imgUrl);
      setText(data.text);
      await worker.terminate();
    } catch (err) {
      console.error(err);
      setError("Recognition failed. Please try a clearer image.");
    } finally {
      setLoading(false);
    }
  };

  // Regular file input upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await readFileAsDataURL(file);
      setImageUrl(dataUrl);
      setText("");
      setError(null);
      await recognizeText(dataUrl);
    } catch (err) {
      setError("Failed to read image.");
    }
  };

  // Paste handler for Ctrl+V
  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) {
          e.preventDefault(); // stop default paste behavior
          setText("");
          setError(null);
          const dataUrl = await readFileAsDataURL(file);
          setImageUrl(dataUrl);
          await recognizeText(dataUrl);
          break; // only first image
        }
      }
    }
  };

  // Manual re‑run button
  const handleManualRecognize = () => {
    if (imageUrl) recognizeText(imageUrl);
  };

  return (
    <div
      onPaste={handlePaste}
      tabIndex={0} // needed for paste to fire without clicking an input
      style={{ outline: "none", minHeight: "100vh", padding: "1rem" }}
    >
      <h2>Handwriting Recognition</h2>
      <p style={{ color: "#888", fontStyle: "italic" }}>
        Tip: You can also paste an image (Ctrl+V) anywhere on this page.
      </p>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleImageUpload}
      />

      {imageUrl && (
        <div>
          <img
            src={imageUrl}
            alt="Uploaded handwriting"
            style={{ maxWidth: "100%", maxHeight: "300px" }}
          />
          <button onClick={handleManualRecognize} disabled={loading}>
            {loading ? "Recognizing..." : "Re‑run Recognition"}
          </button>
        </div>
      )}

      {loading && <p>Processing… (this may take a few seconds)</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {text && (
        <div>
          <h3>Recognized Text:</h3>
          <pre
            style={{
              whiteSpace: "pre-wrap",
              background: "#f5f5f5",
              padding: "1rem",
            }}
          >
            {text}
          </pre>
        </div>
      )}
    </div>
  );
};

export default OCR;
