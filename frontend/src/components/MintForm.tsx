import { useState } from 'react';
import { useMockContract } from '../context/MockContractContext';

export default function MintForm({ address }: { address: string | null }) {
  const [tokenId, setTokenId] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const { mintNft } = useMockContract();

  const handleMint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) return setStatus("Please connect wallet first");
    
    setLoading(true);
    setStatus("Minting...");
    try {
      await mintNft(address, tokenId);
      setStatus(`Successfully minted Token ${tokenId}!`);
      setTokenId('');
    } catch (error: any) {
      setStatus(error.message || "Failed to mint");
    }
    setLoading(false);
  };

  return (
    <div className="glass-card">
      <h3>Mint NFT</h3>
      <form onSubmit={handleMint}>
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
        <button type="submit" className="btn-secondary" disabled={!address || loading}>
          {loading ? 'Processing...' : 'Mint'}
        </button>
      </form>
      {status && <p className="status-msg">{status}</p>}
    </div>
  );
}
