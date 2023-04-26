import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { io } from "socket.io-client"

// Components
import Navigation from './components/Navigation'
import Servers from './components/Servers'
import Channels from './components/Channels'
import Messages from './components/Messages'

// ABIs
import DecentChat from './abis/DecentChat.json'

// Config
import config from './config.json';

// Socket
// const socket = io('ws://localhost:3030');

function App() {
  const [account, setAccount] = useState(null);

  const loadBlockchainData = async () => {
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    const account = ethers.utils.getAddress(accounts[0]);
    setAccount(account);
  };

  useEffect(() => {
    loadBlockchainData();
  }, []);

  return (
    <div>
      <Navigation
        account={account}
        setAccount={setAccount}
      />
      <main>

      </main>
    </div>
  );
}

export default App;
