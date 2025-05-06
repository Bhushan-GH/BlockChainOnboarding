// src/redux/tokenSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ethers } from 'ethers';
import contractJson from '../contracts/MyToken.json';

// Types
interface TokenState {
  balance: string;
  allowance: string;
  walletAddress: string;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: TokenState = {
  balance: '0',
  allowance: '0',
  walletAddress: '',
  status: 'idle',
  error: null,
};

let contract: ethers.Contract;

// Connect Wallet
export const connectWallet = createAsyncThunk('token/connectWallet', async () => {
  if (!window.ethereum) throw new Error('MetaMask not detected');
  const provider = new ethers.BrowserProvider(window.ethereum);
  const accounts = await provider.send('eth_requestAccounts', []);
  const signer = await provider.getSigner();
  contract = new ethers.Contract(contractJson.address, contractJson.abi, signer);
  return accounts[0];
});

// Disconnect Wallet
export const disconnectWallet = createAsyncThunk('token/disconnectWallet', async () => {
  return ''; // Reset wallet state
});

// Get Balance
export const fetchBalance = createAsyncThunk<string, string>('token/getBalance', async (address) => {
  const balance = await contract.balanceOf(address);
  return ethers.formatUnits(balance, 18);
});

// Mint Tokens
export const mintTokens = createAsyncThunk('token/mintTokens', async ({ to, amount }: { to: string; amount: string }) => {
  const tx = await contract.mint(to, ethers.parseUnits(amount, 18));
  await tx.wait();
  return `Minted ${amount} to ${to}`;
});

// Burn Tokens
export const burnTokens = createAsyncThunk('token/burnTokens', async (amount: string) => {
  const tx = await contract.burn(ethers.parseUnits(amount, 18));
  await tx.wait();
  return `Burned ${amount}`;
});

// Transfer Tokens
export const transferTokens = createAsyncThunk('token/transferTokens', async ({ to, amount }: { to: string; amount: string }) => {
  const tx = await contract.transfer(to, ethers.parseUnits(amount, 18));
  await tx.wait();
  return `Transferred ${amount} to ${to}`;
});

// Approve Spender
export const approveSpender = createAsyncThunk('token/approveSpender', async ({ spender, amount }: { spender: string; amount: string }) => {
  const tx = await contract.approve(spender, ethers.parseUnits(amount, 18));
  await tx.wait();
  return `Approved ${amount} to ${spender}`;
});

// Check Allowance
export const checkAllowance = createAsyncThunk<string, { owner: string; spender: string }>('token/checkAllowance', async ({ owner, spender }) => {
  const result = await contract.allowance(owner, spender);
  return ethers.formatUnits(result, 18);
});

const tokenSlice = createSlice({
  name: 'token',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(connectWallet.fulfilled, (state, action: PayloadAction<string>) => {
        state.walletAddress = action.payload;
      })
      .addCase(disconnectWallet.fulfilled, (state) => {
        state.walletAddress = '';
        state.balance = '0';
        state.allowance = '0';
      })
      .addCase(fetchBalance.fulfilled, (state, action: PayloadAction<string>) => {
        state.balance = action.payload;
      })
      .addCase(checkAllowance.fulfilled, (state, action: PayloadAction<string>) => {
        state.allowance = action.payload;
      })
      .addCase(mintTokens.fulfilled, (_state, action: PayloadAction<string>) => {
        console.log('Mint successful:', action.payload);
      })
      .addCase(burnTokens.fulfilled, (_state, action: PayloadAction<string>) => {
        console.log('Burn successful:', action.payload);
      })
      .addCase(transferTokens.fulfilled, (_state, action: PayloadAction<string>) => {
        console.log('Transfer successful:', action.payload);
      })
      .addCase(approveSpender.fulfilled, (_state, action: PayloadAction<string>) => {
        console.log('Approve successful:', action.payload);
      });
  },
});

export default tokenSlice.reducer;
