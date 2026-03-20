import { useState } from 'react';
import WalletConnect from './components/WalletConnect';
import MintForm from './components/MintForm';
import FractionalizeForm from './components/FractionalizeForm';
import BuyForm from './components/BuyForm';
import ViewSharesForm from './components/ViewSharesForm';
import { MockContractProvider } from './context/MockContractContext';
import './App.css';

function App() {
  const [address, setAddress] = useState<string | null>(null);

  return (
    <div className="app-container">
      <div className="background-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>
      
      <header className="navbar">
        <div className="logo-container">
          <h1 className="logo-text">Stellar<span className="highlight">Frac</span></h1>
        </div>
        <WalletConnect address={address} onConnect={setAddress} />
      </header>

      <main className="main-content">
        <div className="hero-section">
          <h2>Fractionalize your NFTs on Soroban</h2>
          <p>Mint, divide, and trade shares of digital assets efficiently on the Stellar network.</p>
        </div>

        <MockContractProvider>
          <div className="grid-container">
            <MintForm address={address} />
            <FractionalizeForm address={address} />
            <BuyForm address={address} />
            <ViewSharesForm address={address} />
          </div>
        </MockContractProvider>
      </main>

      <footer className="footer">
        <p>Built for Stellar / Soroban</p>
      </footer>
    </div>
  );
}

export default App;
