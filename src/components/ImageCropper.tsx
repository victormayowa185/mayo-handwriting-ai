import { useState, useRef } from "react";
import ReactCrop, { type Crop, type PixelCrop } from "react-image-crop";
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
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleCropComplete = (c: PixelCrop) => {
    setCompletedCrop(c);
  };

  const handleScanCropped = () => {
    if (!completedCrop || !imageRef.current) return;
    const canvas = document.createElement("canvas");
    const scaleX = imageRef.current.naturalWidth / imageRef.current.width;
    const scaleY = imageRef.current.naturalHeight / imageRef.current.height;
    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(
      imageRef.current,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height,
    );
    const croppedDataUrl = canvas.toDataURL("image/jpeg", 0.9);
    onCrop(croppedDataUrl);
  };

  const handleScanFull = () => {
    // pass original image unchanged
    onCrop(imageUrl);
  };

  return (
    <div className="crop-overlay">
      <div className="crop-card">
        <h3 className="crop-title">Crop to focus on handwriting</h3>
        <ReactCrop
          crop={crop}
          onChange={(c) => setCrop(c)}
          onComplete={handleCropComplete}
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
          <button
            className="crop-btn scan-crop-btn"
            onClick={handleScanCropped}
          >
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
