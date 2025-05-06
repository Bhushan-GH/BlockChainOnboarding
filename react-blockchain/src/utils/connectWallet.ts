declare global {
    interface Window {
      ethereum?: any;
    }
  }
  
export const connectWallet = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      return accounts[0];
    }
    throw new Error("MetaMask not installed");
  };
  