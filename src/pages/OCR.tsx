import { useState, useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import type { Worker } from "tesseract.js";
import CameraCapture from "../components/CameraCapture"; // ← new import
import "../styles/ocr.css";

const OCR = () => {
  const [text, setText] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [phase, setPhase] = useState<"idle" | "scanning" | "result">("idle");
  const [fileName, setFileName] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [showCamera, setShowCamera] = useState(false); // ← new state

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cancelledRef = useRef(false);
  const workerRef = useRef<Worker | null>(null);

  const cornerTLRef = useRef<HTMLDivElement>(null);
  const cornerTRRef = useRef<HTMLDivElement>(null);
  const cornerBLRef = useRef<HTMLDivElement>(null);
  const cornerBRRef = useRef<HTMLDivElement>(null);
  const scanLineRef = useRef<HTMLDivElement>(null);
  const scanBoxRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<gsap.core.Timeline | null>(null);

  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const recognizeText = async (imgUrl: string) => {
    try {
      const { default: Tesseract } = await import("tesseract.js");
      if (cancelledRef.current) return;

      const worker = await Tesseract.createWorker("eng");
      workerRef.current = worker;
      if (cancelledRef.current) {
        await worker.terminate();
        return;
      }

      const { data } = await worker.recognize(imgUrl);
      if (cancelledRef.current) {
        await worker.terminate();
        return;
      }

      if (!data.text.trim()) {
        setError("Couldn't find any text. Please try a clearer image.");
        setPhase("idle");
        await worker.terminate();
        workerRef.current = null;
        return;
      }

      setText(data.text);
      setError(null);
      setPhase("result");
      await worker.terminate();
      workerRef.current = null;
    } catch (err) {
      if (!cancelledRef.current) {
        console.error(err);
        setError("Recognition failed. Please try a clearer image.");
        setPhase("idle");
      }
    }
  };

  const startScan = useCallback(async (dataUrl: string, name: string) => {
    setFileName(name);
    setText("");
    setError(null);
    setCopied(false);
    cancelledRef.current = false;
    setPhase("scanning");
    recognizeText(dataUrl);
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await readFileAsDataURL(file);
      startScan(dataUrl, file.name);
    } catch (err) {
      console.error(err);
      setError("Failed to read image.");
    }
  };

  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) {
          e.preventDefault();
          const dataUrl = await readFileAsDataURL(file);
          startScan(dataUrl, "Pasted image");
          break;
        }
      }
    }
  };

  const handleCancel = () => {
    cancelledRef.current = true;
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
    }
    if (animationRef.current) {
      animationRef.current.kill();
      animationRef.current = null;
    }
    setPhase("idle");
    setFileName("");
  };

  const handleCopy = async () => {
    if (text) {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleScanAgain = () => {
    setPhase("idle");
    setText("");
    setFileName("");
    setError(null);
  };

  useEffect(() => {
    if (phase !== "scanning") return;

    const corners = [
      cornerTLRef.current,
      cornerTRRef.current,
      cornerBLRef.current,
      cornerBRRef.current,
    ];
    const scanLine = scanLineRef.current;
    const scanBox = scanBoxRef.current;
    if (!scanLine || !scanBox) return;

    gsap.set(corners, { opacity: 0, scale: 0.8 });
    gsap.set(scanLine, { top: 0, opacity: 0, visibility: "hidden" });

    const tl = gsap.timeline({ repeat: -1, yoyo: true, repeatDelay: 0.3 });

    tl.to(corners, {
      opacity: 1,
      scale: 1,
      duration: 0.4,
      stagger: 0.08,
      ease: "back.out(1.7)",
    })
      .set(scanLine, { visibility: "visible", top: 0 })
      .to(scanLine, {
        top: scanBox.offsetHeight,
        duration: 1.5,
        ease: "power2.inOut",
        opacity: 1,
      })
      .to(scanLine, { opacity: 0, duration: 0.2 })
      .set(scanLine, { visibility: "hidden" });

    animationRef.current = tl;

    return () => {
      tl.kill();
      animationRef.current = null;
    };
  }, [phase]);

  return (
    <div className="ocr-page" onPaste={handlePaste} tabIndex={0}>
      {/* ── Idle State ── */}
      {phase === "idle" && (
        <div className="idle-container">
          <p className="page-tip">Upload an image or paste from clipboard</p>
          <div className="upload-actions">
            <label htmlFor="file-upload" className="upload-button">
              Choose File
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              style={{ display: "none" }}
            />
            <button
              className="upload-button camera-button"
              onClick={() => setShowCamera(true)}
            >
              Take Photo
            </button>
          </div>
          {error && <p className="error-text">{error}</p>}
        </div>
      )}

      {/* ── Camera Overlay ── */}
      {showCamera && (
        <CameraCapture
          onCapture={(dataUrl) => {
            setShowCamera(false);
            startScan(dataUrl, "Camera photo");
          }}
          onClose={() => setShowCamera(false)}
        />
      )}

      {/* ── Scanning State ── */}
      {phase === "scanning" && (
        <div className="scanning-container">
          <div className="scan-box" ref={scanBoxRef}>
            <div className="corner top-left" ref={cornerTLRef}></div>
            <div className="corner top-right" ref={cornerTRRef}></div>
            <div className="corner bottom-left" ref={cornerBLRef}></div>
            <div className="corner bottom-right" ref={cornerBRRef}></div>
            <div className="scan-line" ref={scanLineRef}></div>
            <div className="scan-info">
              <span className="file-name">Scanning: {fileName}</span>
            </div>
          </div>
          <button className="cancel-button" onClick={handleCancel}>
            Cancel
          </button>
          {error && <p className="error-text">{error}</p>}
        </div>
      )}

      {/* ── Result State ── */}
      {phase === "result" && (
        <div className="result-container">
          <div className="result-card">
            <h3 className="result-title">Recognized Text</h3>
            <pre className="result-text">{text}</pre>
            <div className="result-actions">
              <button className="action-button" onClick={handleCopy}>
                {copied ? "Copied!" : "Copy"}
              </button>
              <button
                className="action-button secondary"
                onClick={handleScanAgain}
              >
                Scan Again
              </button>
            </div>
            <p className="ai-tag">Powered by AI</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OCR;
