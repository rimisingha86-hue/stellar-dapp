import { useState } from 'react';
import { useMockContract } from '../context/MockContractContext';

export default function ViewSharesForm({ address }: { address: string | null }) {
  const [tokenId, setTokenId] = useState('');
  const [shares, setShares] = useState<string | null>(null);
  const [status, setStatus] = useState('');
  const { getShares, nfts, fractionalized } = useMockContract();

  const handleView = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) return setStatus("Please connect wallet first");
    
    const count = getShares(address, tokenId);
    setShares(count.toString());
    
    let msg = '';
    const nft = nfts[tokenId];
    const frac = fractionalized[tokenId];
    
    if (!nft) {
      msg = "NFT does not exist yet.";
    } else if (!frac) {
      msg = `NFT minted by ${nft.owner.substring(0, 4)}... but not fractionalized.`;
    } else {
      msg = `Total shares: ${frac.totalShares} (${frac.totalShares - frac.distributedShares} available)`;
    }
    setStatus(msg);
  };

  return (
    <div className="glass-card">
      <h3>View My Shares</h3>
      <form onSubmit={handleView}>
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
        <button type="submit" className="btn-secondary" disabled={!address}>
          Check Shares
        </button>
      </form>
      {status && <p className="status-msg">{status}</p>}
      {shares !== null && parseInt(shares) > 0 && (
        <div className="result-box">
          <p>You own <strong>{shares}</strong> shares of Token {tokenId}</p>
        </div>
      )}
      {shares !== null && parseInt(shares) === 0 && (
        <div className="result-box" style={{ borderColor: 'rgba(255,255,255,0.2)', color: '#94a3b8' }}>
          <p>You own 0 shares of Token {tokenId}</p>
        </div>
      )}
    </div>
  );
}
