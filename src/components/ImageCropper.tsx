import { useState, useRef } from "react";
import ReactCrop, { type Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import "../styles/imageCropper.css";

interface ImageCropperProps {
  imageUrl: string;
  onCrop: (croppedDataUrl: string) => void;
  onCancel: () => void;
}

const ImageCropper = ({ imageUrl, onCrop, onCancel }: ImageCropperProps) => {
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    width: 80,
    height: 60,
    x: 10,
    y: 15,
  });
  const imageRef = useRef<HTMLImageElement>(null);

  const handleScanCropped = () => {
    const img = imageRef.current;
    if (!img) return;

    const displayedWidth = img.width;
    const displayedHeight = img.height;
    const naturalWidth = img.naturalWidth;
    const naturalHeight = img.naturalHeight;

    // Normalise crop values to percentages regardless of unit
    let xPercent: number,
      yPercent: number,
      widthPercent: number,
      heightPercent: number;

    if (crop.unit === "px") {
      xPercent = (crop.x / displayedWidth) * 100;
      yPercent = (crop.y / displayedHeight) * 100;
      widthPercent = (crop.width / displayedWidth) * 100;
      heightPercent = (crop.height / displayedHeight) * 100;
    } else {
      // already percentage
      xPercent = crop.x;
      yPercent = crop.y;
      widthPercent = crop.width;
      heightPercent = crop.height;
    }

    // Convert percentages to pixel coordinates on the displayed image
    const x = (xPercent * displayedWidth) / 100;
    const y = (yPercent * displayedHeight) / 100;
    const width = (widthPercent * displayedWidth) / 100;
    const height = (heightPercent * displayedHeight) / 100;

    const scaleX = naturalWidth / displayedWidth;
    const scaleY = naturalHeight / displayedHeight;

    const canvas = document.createElement("canvas");
    canvas.width = width * scaleX;
    canvas.height = height * scaleY;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(
      img,
      x * scaleX,
      y * scaleY,
      canvas.width,
      canvas.height,
      0,
      0,
      canvas.width,
      canvas.height
    );
    const croppedDataUrl = canvas.toDataURL("image/jpeg", 0.9);
    onCrop(croppedDataUrl);
  };

  const handleScanFull = () => {
    onCrop(imageUrl);
  };

  return (
    <div className="crop-overlay">
      <div className="crop-card">
        <h3 className="crop-title">Crop to focus on handwriting</h3>
        <ReactCrop
          crop={crop}
          onChange={(c) => setCrop(c)}
          onComplete={() => {}}
          aspect={undefined}
          className="crop-react-area"
        >
          <img
            ref={imageRef}
            src={imageUrl}
            alt="Crop preview"
            className="crop-preview-img"
          />
        </ReactCrop>
        <div className="crop-actions">
          <button className="crop-btn scan-crop-btn" onClick={handleScanCropped}>
            Scan Cropped
          </button>
          <button className="crop-btn scan-full-btn" onClick={handleScanFull}>
            Scan Full Image
          </button>
          <button className="crop-btn cancel-crop-btn" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;