"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { Html5Qrcode } from "html5-qrcode";
import { Button } from "@/components/ui/button";
import { Camera, CameraOff, Loader2 } from "lucide-react";

type Props = {
  onScan: (decodedText: string) => void;
  disabled?: boolean;
};

export function PassQrScanner({ onScan, disabled }: Props) {
  const reactId = useId().replace(/:/g, "");
  const containerId = `pass-qr-${reactId}`;
  const [scanning, setScanning] = useState(false);
  const [starting, setStarting] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const instanceRef = useRef<Html5Qrcode | null>(null);
  const handledRef = useRef(false);

  const stopScanner = useCallback(async () => {
    const h = instanceRef.current;
    instanceRef.current = null;
    if (h) {
      try {
        await h.stop();
      } catch {
        /* already stopped */
      }
      try {
        h.clear();
      } catch {
        /* noop */
      }
    }
    setScanning(false);
    handledRef.current = false;
  }, []);

  useEffect(() => {
    return () => {
      void stopScanner();
    };
  }, [stopScanner]);

  const startScanner = async () => {
    if (disabled) return;
    setScanError(null);
    handledRef.current = false;
    setStarting(true);
    try {
      const { Html5Qrcode, Html5QrcodeSupportedFormats } = await import("html5-qrcode");
      const html5 = new Html5Qrcode(containerId, {
        verbose: false,
        formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
      });
      instanceRef.current = html5;

      const scanConfig = {
        fps: 10,
        qrbox: (viewfinderWidth: number, viewfinderHeight: number) => {
          const m = Math.min(viewfinderWidth, viewfinderHeight);
          const side = Math.min(280, Math.floor(m * 0.72));
          return { width: side, height: side };
        },
        aspectRatio: 1,
      };

      const onOk = (text: string) => {
        if (handledRef.current || disabled) return;
        handledRef.current = true;
        void (async () => {
          await stopScanner();
          onScan(text);
        })();
      };

      const onFail = () => {};

      try {
        await html5.start({ facingMode: "environment" }, scanConfig, onOk, onFail);
      } catch {
        const cameras = await Html5Qrcode.getCameras();
        if (!cameras.length) {
          throw new Error("No camera is available on this device.");
        }
        await html5.start(cameras[0].id, scanConfig, onOk, onFail);
      }
      setScanning(true);
    } catch (e) {
      instanceRef.current = null;
      const msg = e instanceof Error ? e.message : "Could not start the camera.";
      setScanError(
        /denied|NotAllowedError|Permission/i.test(msg)
          ? "Camera access was blocked. Allow camera for this site, or use “Paste instead” below."
          : msg
      );
    } finally {
      setStarting(false);
    }
  };

  return (
    <div className="space-y-3">
      <div
        id={containerId}
        className="relative min-h-[220px] overflow-hidden rounded-xl bg-neutral-950 sm:min-h-[300px]"
      />
      <div className="flex flex-wrap gap-2">
        {!scanning ? (
          <Button
            type="button"
            className="min-h-12 bg-[#6B46FE] text-white hover:bg-[#5b3ad4]"
            onClick={() => void startScanner()}
            disabled={disabled || starting}
          >
            {starting ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Starting camera…
              </>
            ) : (
              <>
                <Camera className="mr-2 size-4" />
                Scan QR code
              </>
            )}
          </Button>
        ) : (
          <Button
            type="button"
            variant="outline"
            className="min-h-12 border-neutral-300"
            onClick={() => void stopScanner()}
            disabled={disabled}
          >
            <CameraOff className="mr-2 size-4" />
            Stop camera
          </Button>
        )}
      </div>
      {scanError && (
        <p className="text-sm text-red-600" role="alert">
          {scanError}
        </p>
      )}
      <p className="text-xs text-neutral-500">
        Point your camera at the traveller&apos;s pass QR. Use HTTPS (or localhost) and allow camera
        access when prompted.
      </p>
    </div>
  );
}
