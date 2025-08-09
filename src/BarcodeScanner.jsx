import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';

export default function BarcodeScanner() {
  const videoRef = useRef(null);
  const codeReaderRef = useRef(new BrowserMultiFormatReader());
  const [result, setResult] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const startScanning = async () => {
    setIsScanning(true);
    const codeReader = codeReaderRef.current;
    try {
      const videoInputDevices = await codeReader.listVideoInputDevices();
      const firstDeviceId = videoInputDevices[0]?.deviceId;
      if (!firstDeviceId) return;

      const res = await codeReader.decodeOnceFromVideoDevice(
        firstDeviceId,
        videoRef.current
      );
      setResult(res.getText());
    } catch (err) {
      if (err && !(err instanceof NotFoundException)) {
        console.error(err);
      }
    } finally {
      codeReader.reset();
      setIsScanning(false);
    }
  };

  useEffect(() => {
    return () => {
      codeReaderRef.current.reset();
    };
  }, []);

  return (
    <div>
      <video ref={videoRef} style={{ width: '100%' }} />
      <button onClick={startScanning} disabled={isScanning}>
        Escanear
      </button>
      {result && <p>Result: {result}</p>}
    </div>
  );
}
