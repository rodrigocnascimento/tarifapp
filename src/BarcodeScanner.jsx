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
  const codeReaderRef = useRef(new BrowserMultiFormatReader());
  const [result, setResult] = useState('');
  const [torchEnabled, setTorchEnabled] = useState(false);
  const [torchSupported, setTorchSupported] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    setTorchSupported(
      !!navigator.mediaDevices?.getSupportedConstraints?.().torch
    );

    const codeReader = codeReaderRef.current;
    let active = true;

    codeReader
      .listVideoInputDevices()
      .then((videoInputDevices) => {
        const firstDeviceId = videoInputDevices[0]?.deviceId;
        if (!firstDeviceId) {
          setStatus('Nenhuma câmera encontrada');
          return;
        }
        codeReader.decodeFromVideoDevice(
          firstDeviceId,
          videoRef.current,
          (res, err) => {
            if (!active) return;
            if (res) {
              setResult(res.getText());
              setStatus('Código detectado');
              codeReader.reset();
            }
            if (err && !(err instanceof NotFoundException)) {
              console.error(err);
              setStatus('Erro ao escanear');
            }
          }
        );
      })
      .catch((err) => {
        console.error(err);
        setStatus('Erro ao acessar câmera');
      });

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
      {status && <p className="status">{status}</p>}
      <style>{`
        .video-container {
          position: relative;
          width: 100%;
        }
        .video-container video {
          width: 100%;
          display: block;
        }
        .overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border: 4px solid rgba(255, 255, 255, 0.8);
          box-sizing: border-box;
          pointer-events: none;
        }
        .overlay .line {
          position: absolute;
          left: 0;
          right: 0;
          height: 2px;
          background: rgba(255, 0, 0, 0.7);
          animation: scan 2s linear infinite;
        }
        @keyframes scan {
          0% { top: 0; }
          100% { top: calc(100% - 2px); }
        }
        .instruction-card {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #fff;
          padding: 8px;
          border-radius: 4px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          margin-top: 12px;
        }
        .status {
          margin-top: 8px;
        }
      `}</style>
    </div>
  );
}
