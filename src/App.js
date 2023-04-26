import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
// import { io } from "socket.io-client"

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
  const [provider, setProvider] = useState(null);
  const [decentchat, setDecentChat] = useState(null);
  const [channels, setChannels] = useState([]);
  const [currentChannel, setCurrentChannel] = useState(null);

  const loadBlockchainData = async () => {
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    const account = ethers.utils.getAddress(accounts[0]);
    setAccount(account);

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);

    const network = await provider.getNetwork();
    const decentchat = new ethers.Contract(config[network.chainId].DecentChat.address, DecentChat, provider);
    setDecentChat(decentchat);

    const totalChannels = await decentchat.totalChannels();
    const channels = [];
    for (var i = 1; i <= totalChannels; i++) {
      const channel = await decentchat.getChannel(i);
      channels.push(channel);
    }
    setChannels(channels);
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
        <Servers />
        <Channels 
          provider={provider}
          account={account}
          decentchat={decentchat}
          channels={channels}
          currentChannel={currentChannel}
          setCurrentChannel={setCurrentChannel}
        />
        <Messages />
      </main>
    </div>
  );
}

export default App;
