'use client';

import { useEffect, useRef, useState } from 'react';
import { Camera, RefreshCw, Plus, Check, Trash2 } from 'lucide-react';
import Modal from '@/components/modal';
import { Button } from '@/components/ui/button';

interface CameraCaptureProps {
  onImage?: (imageFiles: File[]) => void;
  multiple?: boolean;
  children?: React.ReactNode;
  t: (key: string) => string;
}

export default function CameraCapture({
  onImage,
  multiple = false,
  t,
  children,
}: CameraCaptureProps) {
  const [open, setOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImages, setCapturedImages] = useState<
    { url: string; file: File }[]
  >([]);
  const [currentCapture, setCurrentCapture] = useState<{
    url: string;
    file: File;
  } | null>(null);

  const startCamera = async () => {
    try {
      // Stop any existing stream first
      stopCamera();

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }, // Default to back camera if available
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current
              .play()
              .catch((err) => console.error('Error playing video:', err));
          }
        };
      }
      setStream(mediaStream);
    } catch (error) {
      console.error('Camera access denied:', error);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Generate timestamp for filename
    const now = new Date();
    // Format the timestamp as "yyyymmdd-hhmm"
    const timestamp =
      now.getFullYear().toString() +
      (now.getMonth() + 1).toString().padStart(2, '0') +
      now.getDate().toString().padStart(2, '0') +
      now.getHours().toString().padStart(2, '0') +
      now.getMinutes().toString().padStart(2, '0') +
      now.getSeconds().toString().padStart(2, '0');
    const filename = `img-${timestamp}.jpg`;

    // Ensure compatibility with older iOS versions
    if (canvas.toBlob) {
      canvas.toBlob(
        (blob) => {
          if (!blob) return;

          const imageUrl = URL.createObjectURL(blob);
          setPhoto(imageUrl);

          // Create a File object but store it temporarily
          const file = new File([blob], filename, { type: 'image/jpeg' });

          // Set as current capture, but don't add to list yet
          setCurrentCapture({ url: imageUrl, file });
        },
        'image/jpeg',
        0.8
      );
    } else {
      // Fallback for older Safari versions
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      setPhoto(dataUrl);
      console.warn(
        "Browser doesn't support toBlob, multiple image capture limited"
      );
    }
  };

  // Add current photo to captured images and reset to take another
  const addCurrentAndContinue = () => {
    if (currentCapture) {
      setCapturedImages((prev) => [...prev, currentCapture]);
      setCurrentCapture(null);
      setPhoto(null);
      startCamera();
    }
  };

  // Discard current photo and retake
  const resetCapture = () => {
    setCurrentCapture(null);
    setPhoto(null);
    // Restart the camera when retaking
    startCamera();
  };

  const deleteImage = (index: number) => {
    setCapturedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDone = () => {
    // Include both saved images and current capture
    const allImages = currentCapture
      ? [...capturedImages, currentCapture]
      : capturedImages;

    // Call onImage with all captured files
    if (onImage && allImages.length > 0) {
      onImage(allImages.map((img) => img.file));
    }

    // Close modal and clean up
    setOpen(false);
    setCapturedImages([]);
    setCurrentCapture(null);
    setPhoto(null);
  };

  // Handle modal close with proper cleanup
  const handleModalClose = () => {
    stopCamera();
    setOpen(false);
    setCapturedImages([]);
    setCurrentCapture(null);
    setPhoto(null);
  };

  useEffect(() => {
    // Start camera when modal opens
    if (open) {
      startCamera();
    } else {
      stopCamera();
      setPhoto(null);
    }

    // Clean up when component unmounts
    return () => {
      stopCamera();
    };
  }, [open]);

  // Custom trigger or default button
  const triggerElement = children ? (
    <div onClick={() => setOpen(true)}>{children}</div>
  ) : (
    <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
      <Camera className="size-4" />
    </Button>
  );

  return (
    <div>
      {triggerElement}
      <Modal
        mode="dialog"
        showCloseButton={false}
        open={open}
        onClose={handleModalClose}
        className="p-0 h-full md:h-auto"
      >
        <div className="flex flex-col items-center p-4 relative max-h-screen overflow-auto">
          {!photo ? (
            <>
              <div className="rounded-lg overflow-hidden mb-4 bg-black w-full max-w-xl">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-auto"
                />
              </div>
              <Button
                onClick={capturePhoto}
                size="lg"
                className="rounded-full w-16 h-16 flex items-center justify-center"
              >
                <Camera className="size-6" />
              </Button>
            </>
          ) : (
            <>
              <div className="rounded-lg overflow-hidden mb-4 bg-black w-full max-w-xl">
                <img src={photo} alt="Captured" className="w-full h-auto" />
              </div>
              <div className="flex gap-4 mb-6">
                <Button onClick={resetCapture} variant="outline">
                  <RefreshCw className="size-4 mr-2" /> {t('camera.retake')}
                </Button>
                {multiple && (
                  <Button variant="outline" onClick={addCurrentAndContinue}>
                    <Plus className="size-4 mr-2" /> {t('camera.add')}
                  </Button>
                )}
              </div>
            </>
          )}

          {/* Image preview thumbnails */}
          {capturedImages.length > 0 && (
            <div className="w-full mt-4">
              <h3 className="text-sm font-medium mb-2">
                {t('camera.capturedImages')} ({capturedImages.length})
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {capturedImages.map((img, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={img.url}
                      alt={`Capture ${index + 1}`}
                      className="w-full h-24 object-cover rounded"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => deleteImage(index)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 w-full flex justify-between">
            <Button variant="outline" onClick={handleModalClose}>
              {t('camera.cancel')}
            </Button>
            <Button
              variant="default"
              onClick={handleDone}
              disabled={capturedImages.length === 0 && !currentCapture}
            >
              <Check className=" mr-2" /> {t('camera.end')}
            </Button>
          </div>

          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
      </Modal>
    </div>
  );
}
