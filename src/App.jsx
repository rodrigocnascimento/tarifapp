import { useState } from 'react';
import BarcodeScanner from './BarcodeScanner';
function App() {
  const [showScanner, setShowScanner] = useState(false);

  return (
    <div>
      <h1>TarifApp</h1>
      {showScanner ? (
        <div>
          <BarcodeScanner />
          <button onClick={() => setShowScanner(false)}>Fechar</button>
        </div>
      ) : (
        <button onClick={() => setShowScanner(true)}>Iniciar Escaneamento</button>
      )}
    </div>
  );
}

export default App;
