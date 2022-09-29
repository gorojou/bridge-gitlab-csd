import React, { useContext, useEffect, useState } from "react";
import { ethers, Signer } from "ethers";

import Web3Modal from "web3modal";
import Authereum from "authereum";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { contracts } from "./contractsAbis";
import Web3 from "web3";
import bnb from "./assets/images/networks/bnb.png";
import eth from "./assets/images/networks/eth.png";
import phantom from "./assets/images/networks/phantom.png";
import avalanche from "./assets/images/networks/avalanche.png";
import matic from "./assets/images/networks/matic.png";
import tron from "./assets/images/networks/tron.png";

const BCContext = React.createContext();

export function useBlockChainContext() {
  return useContext(BCContext);
}

export function BlockchainContext({ children }) {
  //Setting Variables
  const nets = [
    {
      name: "Binance Smart Chain",
      logo: bnb,
      byteCode: "0x61",
      contract: "0x279c4f664eECd154E4130DB017c956649b1ee4ae",
      token: "0xAA78E5E4fc6d22c501E567bDF7c29D8A8C9bd173",
      provider: "https://data-seed-prebsc-1-s1.binance.org:8545",
      tokenAbi: contracts.BscTokenAbi,
      abi: contracts.BridgeBscContractAbi,
    },
    {
      name: "ETH Mainnet",
      logo: eth,
      byteCode: "0x3",
      contract: "0x027230dBA001eC0F1Dea3d30292D1e72489E0A39",
      token: "0x12299165697f75c61506d14878E614fed96A85F2",
      provider: "https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
      tokenAbi: contracts.EthTokenAbi,
      abi: contracts.BridgeEthContractAbi,
    },
    {
      name: "Fantom",
      logo: phantom,
    },
    {
      name: "Avalanche",
      logo: avalanche,
    },
    {
      name: "Matic",
      logo: matic,
    },
    {
      name: "Tron",
      logo: tron,
    },
  ];
  const privKey =
    "0x3996049a3275c629f46099e28f658b88e74577c9622260b5301e26b47a263bdd";
  const web3Eth = new Web3(
    "https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
  );

  const web3Bsc = new Web3("https://data-seed-prebsc-1-s1.binance.org:8545");

  const [account, setAccount] = useState();
  const [instance, setInstance] = useState();
  const [provider, setProvider] = useState();
  const [net, setNet] = useState({
    from: { ...nets[0] },
    to: { ...nets[1] },
  });
  const [ammount, setAmmount] = useState(0.0);
  const [locked, setLocked] = useState(false);
  const [message, setMessage] = useState();
  //Setting web3modal
  const providerOptions = {
    metamask: {
      id: "injected",
      name: "MetaMask",
      type: "injected",
      check: "isMetaMask",
    },
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        infuraId: "04bfa7d48b3e4d0e87bf5c8c7e15b4c3", // Required
        network: "ropsten",
        qrcodeModalOptions: {
          mobileLinks: [
            "rainbow",
            "metamask",
            "argent",
            "trust",
            "imtoken",
            "pillar",
          ],
        },
      },
    },
    authereum: {
      package: Authereum,
    },
    theme: "dark",
  };
  const web3Modal = new Web3Modal({
    providerOptions,
  });

  //Set user in web3Modal
  const connectWeb3Modal = async () => {
    try {
      web3Modal.clearCachedProvider();
      const instance = await web3Modal.connect();
      const provider = new Web3(instance);
      setInstance(instance);
      setProvider(provider);
      setAccount(await provider.eth.getAccounts());
    } catch (err) {
      setMessage("Please Connect your wallet");
      console.log(err);
    }
  };

  //Update user's metamask network
  const updateNet = (id) => {
    let match = false;
    nets.map((index) => {
      if (id === index.byteCode) {
        match = true;
        if (net.to.byteCode === index.byteCode)
          return setNet({ to: net.from, from: net.to });
        return setNet({ ...net, from: index });
      }
    });
    if (!match) {
      setMessage("Unknown Network");
      throw "Unknown Network";
    }
  };

  const checkForWeb3 = () => {
    if (!provider) {
      setMessage("Please connect a wallet");
      return false;
    }
    return true;
  };

  //Handle user changes to input
  const handleChange = (e) => {
    const { id, value } = e.target;
    setAmmount(value);
  };

  useEffect(() => {
    const init = async () => {
      if (instance) {
        instance.on("accountsChanged", async (account) => {
          if (account.length == 0) {
            setAccount("");
            return setMessage("Please connect your wallet");
          }
          const provider = new Web3(instance);
          setAccount(await provider.eth.getAccounts());
          setProvider(provider);
        });
        instance.on("chainChanged", async (chainId) => {
          setProvider(await new ethers.providers.Web3Provider(instance));
          updateNet(chainId);
        });
        if (provider)
          updateNet(ethers.utils.hexValue(provider._network.chainId));
      }
    };
    init();
  }, [instance]);
  return (
    <BCContext.Provider
      value={{
        net,
        nets,
        handleChange,
        setNet,
        connectWeb3Modal,
        provider,
        account,
        locked,
        setLocked,
        ammount,
        updateNet,
        setMessage,
        checkForWeb3,
      }}
    >
      {children}
      {message && <Modal message={message} setMessage={setMessage} />}
    </BCContext.Provider>
  );
}

const Modal = ({ message, setMessage }) => {
  const [animation, setAnimation] = useState(false);
  const goBack = () => {
    setTimeout(() => {
      setMessage("");
    }, 400);
  };
  useEffect(() => {
    if (message) {
      setTimeout(() => {
        setAnimation(true);
        goBack();
      }, 3000);
    }
  }, [message]);

  return (
    <>
      <div key={message} className={`modal ${animation ? "go-back" : "go-in"}`}>
        {message}
      </div>
    </>
  );
};
