#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, Symbol, Vec};

#[derive(Clone)]
#[contracttype]
pub struct NFT {
    pub owner: Address,
    pub token_id: u64,
}

#[derive(Clone)]
#[contracttype]
pub struct FractionalizedNFT {
    pub nft: NFT,
    pub total_shares: u64,
    pub shares_distributed: u64,
}

#[contract]
pub struct FractionalNFTContract;

#[contractimpl]
impl FractionalNFTContract {

    // Mint NFT
    pub fn mint_nft(env: Env, owner: Address, token_id: u64) {
        let nft = NFT { owner: owner.clone(), token_id };
        env.storage().instance().set(&token_id, &nft);
    }

    // Fractionalize NFT
    pub fn fractionalize(env: Env, owner: Address, token_id: u64, total_shares: u64) {
        let nft: NFT = env.storage().instance().get(&token_id).unwrap();

        if nft.owner != owner {
            panic!("Not owner");
        }

        let frac = FractionalizedNFT {
            nft,
            total_shares,
            shares_distributed: 0,
        };

        env.storage().instance().set(&(token_id, Symbol::short("FRAC")), &frac);
    }

    // Buy shares
    pub fn buy_shares(env: Env, buyer: Address, token_id: u64, amount: u64) {
        let key = (token_id, Symbol::short("FRAC"));
        let mut frac: FractionalizedNFT = env.storage().instance().get(&key).unwrap();

        if frac.shares_distributed + amount > frac.total_shares {
            panic!("Not enough shares");
        }

        frac.shares_distributed += amount;

        // Store buyer shares
        env.storage().persistent().set(&(buyer, token_id), &amount);

        env.storage().instance().set(&key, &frac);
    }

    // View shares
    pub fn get_shares(env: Env, user: Address, token_id: u64) -> u64 {
        env.storage().persistent().get(&(user, token_id)).unwrap_or(0)
    }
}