import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Camera, RotateCcw, TriangleAlert, X } from "lucide-react";

export default function CameraCaptureModal({
  title,
  subtitle,
  facingMode = "user",
  aspect = "aspect-[4/3]",
  mirror = true,
  onClose,
  onCapture,
}) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [shot, setShot] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    navigator.mediaDevices
      ?.getUserMedia({ video: { facingMode }, audio: false })
      .then((stream) => {
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch(() => setError("Camera access denied or unavailable. Check browser permissions."));

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [facingMode]);

  const capture = () => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (mirror) {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    setShot(canvas.toDataURL("image/jpeg", 0.9));
  };

  const confirm = () => {
    if (shot) onCapture(shot);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.97 }}
        transition={{ type: "spring", stiffness: 340, damping: 32 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[720px] rounded-2xl border border-line bg-surface p-7 shadow-[var(--shadow-panel)]"
      >
        <div className="mb-5 flex items-start justify-between">
          <div>
            <div className="text-[17px] font-semibold text-ink">{title}</div>
            <p className="mt-0.5 text-[12.5px] text-ink-faint">{subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-ink-faint hover:bg-surface-sunken"
          >
            <X size={16} strokeWidth={1.75} />
          </button>
        </div>

        <div className={`relative ${aspect} w-full overflow-hidden rounded-xl border border-line bg-surface-sunken`}>
          {error ? (
            <div className="flex h-full flex-col items-center justify-center gap-2.5 px-6 text-center">
              <TriangleAlert size={26} strokeWidth={1.75} className="text-warn-ink" />
              <span className="text-[13px] text-ink-dim">{error}</span>
            </div>
          ) : shot ? (
            <img src={shot} alt="Captured" className="h-full w-full object-cover" />
          ) : (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`h-full w-full object-cover ${mirror ? "scale-x-[-1]" : ""}`}
            />
          )}
        </div>

        {!error && (
          <div className="mt-5 flex gap-2.5">
            {shot ? (
              <>
                <button
                  onClick={() => setShot(null)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-line py-3 text-[13px] font-semibold text-ink-dim hover:bg-surface-sunken"
                >
                  <RotateCcw size={15} strokeWidth={2} />
                  Retake
                </button>
                <motion.button
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={confirm}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-navy py-3 text-[13px] font-semibold text-white shadow-sm"
                >
                  Use This Photo
                </motion.button>
              </>
            ) : (
              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={capture}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-navy py-3 text-[13px] font-semibold text-white shadow-sm"
              >
                <Camera size={16} strokeWidth={2} />
                Capture Photo
              </motion.button>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
