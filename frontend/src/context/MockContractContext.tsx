import React, { createContext, useContext, useState } from 'react';

type NFT = { owner: string };
type FractionalizedNFT = { totalShares: number; distributedShares: number };

interface MockContractContextType {
  nfts: Record<string, NFT>;
  fractionalized: Record<string, FractionalizedNFT>;
  userShares: Record<string, Record<string, number>>;
  mintNft: (owner: string, tokenId: string) => Promise<void>;
  fractionalizeNft: (owner: string, tokenId: string, totalShares: number) => Promise<void>;
  buyShares: (buyer: string, tokenId: string, amount: number) => Promise<void>;
  getShares: (user: string, tokenId: string) => number;
}

const MockContractContext = createContext<MockContractContextType | undefined>(undefined);

export function MockContractProvider({ children }: { children: React.ReactNode }) {
  const [nfts, setNfts] = useState<Record<string, NFT>>({});
  const [fractionalized, setFractionalized] = useState<Record<string, FractionalizedNFT>>({});
  // user => tokenId => amount
  const [userShares, setUserShares] = useState<Record<string, Record<string, number>>>({});

  const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

  const mintNft = async (owner: string, tokenId: string) => {
    await delay(500); // Simulate network request
    if (nfts[tokenId]) throw new Error("NFT already minted");
    setNfts(prev => ({ ...prev, [tokenId]: { owner } }));
  };

  const fractionalizeNft = async (owner: string, tokenId: string, totalShares: number) => {
    await delay(500);
    const nft = nfts[tokenId];
    if (!nft) throw new Error("NFT does not exist");
    if (nft.owner !== owner) throw new Error("Not the owner");
    if (fractionalized[tokenId]) throw new Error("Already fractionalized");
    
    setFractionalized(prev => ({ ...prev, [tokenId]: { totalShares, distributedShares: 0 } }));
  };

  const buyShares = async (buyer: string, tokenId: string, amount: number) => {
    await delay(500);
    const frac = fractionalized[tokenId];
    if (!frac) throw new Error("NFT is not fractionalized");
    if (frac.distributedShares + amount > frac.totalShares) {
      throw new Error(`Not enough shares available (only ${frac.totalShares - frac.distributedShares} left)`);
    }

    setFractionalized(prev => ({
      ...prev,
      [tokenId]: { ...frac, distributedShares: frac.distributedShares + amount }
    }));

    setUserShares(prev => {
      const userRec = prev[buyer] || {};
      const currentShares = userRec[tokenId] || 0;
      return {
        ...prev,
        [buyer]: {
          ...userRec,
          [tokenId]: currentShares + amount
        }
      };
    });
  };

  const getShares = (user: string, tokenId: string) => {
    if (!userShares[user]) return 0;
    return userShares[user][tokenId] || 0;
  };

  return (
    <MockContractContext.Provider value={{ nfts, fractionalized, userShares, mintNft, fractionalizeNft, buyShares, getShares }}>
      {children}
    </MockContractContext.Provider>
  );
}

export function useMockContract() {
  const ctx = useContext(MockContractContext);
  if (!ctx) throw new Error("useMockContract must be used within MockContractProvider");
  return ctx;
}
