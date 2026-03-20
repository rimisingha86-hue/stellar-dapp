import { useState, useEffect } from 'react';
import {
  isConnected,
  requestAccess,
} from '@stellar/freighter-api';

interface WalletConnectProps {
  onConnect: (address: string) => void;
  address: string | null;
}

export default function WalletConnect({ onConnect, address }: WalletConnectProps) {
  const [hasFreighter, setHasFreighter] = useState(false);

  useEffect(() => {
    async function checkConnection() {
      if (await isConnected()) {
        setHasFreighter(true);
      }
    }
    checkConnection();
  }, []);

  const connectWallet = async () => {
    if (!hasFreighter) {
      alert("Please install Freighter wallet.");
      return;
    }
    try {
      const pubKey = await requestAccess();
      if (pubKey) {
        onConnect(typeof pubKey === 'string' ? pubKey : String(pubKey));
      }
    } catch (e) {
      console.error("Wallet connection failed:", e);
    }
  };

  return (
    <div className="wallet-connect">
      {address ? (
        <div className="connected-badge">
          <span className="dot"></span>
          <span>{address.substring(0, 6)}...{address.substring(address.length - 4)}</span>
        </div>
      ) : (
        <button className="btn-primary" onClick={connectWallet}>
          Connect Freighter
        </button>
      )}
    </div>
  );
}
