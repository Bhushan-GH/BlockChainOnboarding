import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  connectWallet,
  disconnectWallet,
  fetchBalance,
  mintTokens,
  burnTokens,
  transferTokens,
  approveSpender,
  checkAllowance,
} from './redux/tokenSlice';
import { RootState, AppDispatch } from './redux/store';
import Grid from '@mui/material/Grid'; // ✅ CORRECT

import {
  Box,
  Button,
  Container,
  Divider,
  TextField,
  Typography,
  Paper,
  CssBaseline,
} from '@mui/material';

const App = () => {
  const dispatch = useDispatch<AppDispatch>();

  const walletAddress = useSelector((state: RootState) => state.token.walletAddress);
  const balance = useSelector((state: RootState) => state.token.balance);
  const allowance = useSelector((state: RootState) => state.token.allowance);

  const [mintTo, setMintTo] = useState('');
  const [mintAmount, setMintAmount] = useState('');
  const [burnAmount, setBurnAmount] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferTo, setTransferTo] = useState('');
  const [spenderAddress, setSpenderAddress] = useState('');
  const [approveAmount, setApproveAmount] = useState('');
  const [allowanceOwner, setAllowanceOwner] = useState('');
  const [allowanceSpender, setAllowanceSpender] = useState('');

  useEffect(() => {
    const init = async () => {
      const resultAction = await dispatch(connectWallet());
      if (connectWallet.fulfilled.match(resultAction)) {
        dispatch(fetchBalance(resultAction.payload));
      }
    };
    init();
  }, [dispatch]);

  const handleMint = () => {
    if (mintTo && mintAmount) {
      dispatch(mintTokens({ to: mintTo, amount: mintAmount }));
    }
  };

  const handleBurn = () => {
    if (burnAmount) {
      dispatch(burnTokens(burnAmount));
    }
  };

  const handleTransfer = () => {
    if (transferTo && transferAmount) {
      dispatch(transferTokens({ to: transferTo, amount: transferAmount }));
    }
  };

  const handleApprove = () => {
    if (spenderAddress && approveAmount) {
      dispatch(approveSpender({ spender: spenderAddress, amount: approveAmount }));
    }
  };

  const handleCheckAllowance = () => {
    if (allowanceOwner && allowanceSpender) {
      dispatch(checkAllowance({ owner: allowanceOwner, spender: allowanceSpender }));
    }
  };

  const handleDisconnect = () => {
    dispatch(disconnectWallet());
  };

  return (
    <>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          bgcolor: '#f5f5f5',
          px: 2,
        }}
      >
        <Container maxWidth="md">
          <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="h4" gutterBottom align="center">
              ERC-20 Token Dashboard
            </Typography>
  
            <Typography variant="subtitle1" align="center" color="text.secondary" gutterBottom>
              Wallet: {walletAddress || 'Not connected'}
            </Typography>
            <Typography variant="subtitle1" align="center" color="text.secondary">
              Balance: {balance} MTK | Allowance: {allowance} MTK
            </Typography>
  
            <Box display="flex" justifyContent="center" mt={2}>
              <Button
                variant="outlined"
                onClick={handleDisconnect}
                disabled={!walletAddress}
                color="secondary"
              >
                Disconnect Wallet
              </Button>
            </Box>
  
            <Divider sx={{ my: 4 }} />
  
            <Grid container spacing={4}>
              {/* Mint Tokens */}
              <Grid item xs={12} sm={6}>
                <Typography variant="h6">Mint Tokens</Typography>
                <TextField
                  fullWidth
                  label="To Address"
                  value={mintTo}
                  onChange={(e) => setMintTo(e.target.value)}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Amount"
                  value={mintAmount}
                  onChange={(e) => setMintAmount(e.target.value)}
                  margin="normal"
                />
                <Button variant="contained" fullWidth onClick={handleMint}>
                  Mint
                </Button>
              </Grid>
  
              {/* Burn Tokens */}
              <Grid item xs={12} sm={6}>
                <Typography variant="h6">Burn Tokens</Typography>
                <TextField
                  fullWidth
                  label="Amount"
                  type="number"
                  value={burnAmount}
                  onChange={(e) => setBurnAmount(e.target.value)}
                  margin="normal"
                />
                <Button variant="contained" fullWidth color="error" onClick={handleBurn}>
                  Burn
                </Button>
              </Grid>
  
              {/* Transfer Tokens */}
              <Grid item xs={12}>
                <Typography variant="h6">Transfer Tokens</Typography>
                <TextField
                  fullWidth
                  label="Recipient Address"
                  value={transferTo}
                  onChange={(e) => setTransferTo(e.target.value)}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Amount"
                  type="number"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  margin="normal"
                />
                <Button variant="contained" fullWidth onClick={handleTransfer}>
                  Transfer
                </Button>
              </Grid>
  
              {/* Approve Spender */}
              <Grid item xs={12} sm={6}>
                <Typography variant="h6">Approve Spender</Typography>
                <TextField
                  fullWidth
                  label="Spender Address"
                  value={spenderAddress}
                  onChange={(e) => setSpenderAddress(e.target.value)}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Amount"
                  type="number"
                  value={approveAmount}
                  onChange={(e) => setApproveAmount(e.target.value)}
                  margin="normal"
                />
                <Button variant="contained" fullWidth onClick={handleApprove}>
                  Approve
                </Button>
              </Grid>
  
              {/* Check Allowance */}
              <Grid item xs={12} sm={6}>
                <Typography variant="h6">Check Allowance</Typography>
                <TextField
                  fullWidth
                  label="Owner Address"
                  value={allowanceOwner}
                  onChange={(e) => setAllowanceOwner(e.target.value)}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Spender Address"
                  value={allowanceSpender}
                  onChange={(e) => setAllowanceSpender(e.target.value)}
                  margin="normal"
                />
                <Button variant="contained" fullWidth onClick={handleCheckAllowance}>
                  Check
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>
    </>
  );
  
}
export default App;