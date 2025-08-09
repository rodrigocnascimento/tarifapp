import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';

function FlashlightIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      width="24"
      height="24"
      {...props}
    >
      <path d="M7 2a2 2 0 00-2 2v4a2 2 0 00.586 1.414L9 13v8a1 1 0 001 1h4a1 1 0 001-1v-8l3.414-3.586A2 2 0 0019 8V4a2 2 0 00-2-2H7z" />
    </svg>
  );
}

export default function BarcodeScanner() {
  const videoRef = useRef(null);
  const [result, setResult] = useState('');
  const [torchEnabled, setTorchEnabled] = useState(false);
  const [torchSupported, setTorchSupported] = useState(false);

  useEffect(() => {
    setTorchSupported(
      !!navigator.mediaDevices?.getSupportedConstraints?.().torch
    );

    const codeReader = new BrowserMultiFormatReader();
    let active = true;

    codeReader
      .listVideoInputDevices()
      .then((videoInputDevices) => {
        const firstDeviceId = videoInputDevices[0]?.deviceId;
        if (!firstDeviceId) return;
        codeReader.decodeFromVideoDevice(firstDeviceId, videoRef.current, (res, err) => {
          if (!active) return;
          if (res) {
            setResult(res.getText());
            codeReader.reset();
          }
          if (err && !(err instanceof NotFoundException)) {
            console.error(err);
          }
        });
      })
      .catch((err) => console.error(err));

    return () => {
      active = false;
      codeReader.reset();
    };
  }, []);

  const toggleTorch = async () => {
    try {
      const track = videoRef.current?.srcObject?.getVideoTracks?.()[0];
      if (!track) return;
      const newState = !torchEnabled;
      await track.applyConstraints({
        advanced: [{ torch: newState }],
      });
      setTorchEnabled(newState);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <video ref={videoRef} style={{ width: '100%' }} />
      {torchSupported && (
        <button
          onClick={toggleTorch}
          style={{
            backgroundColor: torchEnabled ? '#ffd700' : 'transparent',
          }}
          aria-label="Toggle flashlight"
        >
          <FlashlightIcon />
        </button>
      )}
      {result && <p>Result: {result}</p>}
    </div>
  );
}
