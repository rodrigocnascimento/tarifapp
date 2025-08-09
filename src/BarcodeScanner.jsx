import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';

export default function BarcodeScanner() {
  const videoRef = useRef(null);
  const [result, setResult] = useState('');

  useEffect(() => {
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

  return (
    <div>
      <video ref={videoRef} style={{ width: '100%' }} />
      {result && <p>Result: {result}</p>}
    </div>
  );
}
