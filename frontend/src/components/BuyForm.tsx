import { useState } from 'react';
import { useMockContract } from '../context/MockContractContext';

export default function BuyForm({ address }: { address: string | null }) {
  const [tokenId, setTokenId] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const { buyShares } = useMockContract();

  const handleBuy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) return setStatus("Please connect wallet first");
    
    setLoading(true);
    setStatus("Buying shares...");
    try {
      await buyShares(address, tokenId, parseInt(amount));
      setStatus(`Successfully bought ${amount} shares of Token ${tokenId}!`);
      setTokenId('');
      setAmount('');
    } catch (error: any) {
      setStatus(error.message || "Failed to buy shares");
    }
    setLoading(false);
  };

  return (
    <div className="glass-card">
      <h3>Buy Shares</h3>
      <form onSubmit={handleBuy}>
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
          <label>Amount of Shares</label>
          <input 
            type="number" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g. 50"
            required
          />
        </div>
        <button type="submit" className="btn-secondary" disabled={!address || loading}>
          {loading ? 'Processing...' : 'Buy Shares'}
        </button>
      </form>
      {status && <p className="status-msg">{status}</p>}
    </div>
  );
}
