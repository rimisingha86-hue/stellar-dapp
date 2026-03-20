import { useState } from 'react';
import { useMockContract } from '../context/MockContractContext';

export default function FractionalizeForm({ address }: { address: string | null }) {
  const [tokenId, setTokenId] = useState('');
  const [totalShares, setTotalShares] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const { fractionalizeNft } = useMockContract();

  const handleFractionalize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) return setStatus("Please connect wallet first");
    
    setLoading(true);
    setStatus("Fractionalizing...");
    try {
      await fractionalizeNft(address, tokenId, parseInt(totalShares));
      setStatus(`Token ${tokenId} successfully fractionalized into ${totalShares} shares!`);
      setTokenId('');
      setTotalShares('');
    } catch (error: any) {
      setStatus(error.message || "Failed to fractionalize");
    }
    setLoading(false);
  };

  return (
    <div className="glass-card">
      <h3>Fractionalize NFT</h3>
      <form onSubmit={handleFractionalize}>
        <div className="form-group">
          <label>Token ID</label>
          <input 
            type="number" 
            value={tokenId} 
            onChange={(e) => setTokenId(e.target.value)}
            placeholder="e.g. 1"
            required
          />
        </div>
        <div className="form-group">
          <label>Total Shares</label>
          <input 
            type="number" 
            value={totalShares} 
            onChange={(e) => setTotalShares(e.target.value)}
            placeholder="e.g. 1000"
            required
          />
        </div>
        <button type="submit" className="btn-secondary" disabled={!address || loading}>
          {loading ? 'Processing...' : 'Fractionalize'}
        </button>
      </form>
      {status && <p className="status-msg">{status}</p>}
    </div>
  );
}
