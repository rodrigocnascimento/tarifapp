import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';

export default function BarcodeScanner() {
  const videoRef = useRef(null);
  const [result, setResult] = useState('');
  const [status, setStatus] = useState('Escaneando...');

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
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

  return (
    <div className="scanner-container">
      <div className="video-container">
        <video ref={videoRef} />
        <div className="overlay">
          <div className="line" />
        </div>
      </div>
      <div className="instruction-card">
        <span role="img" aria-label="barcode">
          📷
        </span>
        <p>Posicione o código de barras dentro da moldura</p>
      </div>
      <p className="status">{status}</p>
      {result && <p>Result: {result}</p>}
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
