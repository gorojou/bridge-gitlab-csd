import React, { useState, useEffect } from "react";
import { useBlockChainContext } from "./BlockChainContext.jsx";
import {useEthBridge} from "./scripts/bsc-eth-transfer.js";
import {useBscBridge} from "./scripts/eth-bsc-transfer.js";

import logo from "./logo.svg";
import "./assets/stylesheets/application.css";
import "./assets/stylesheets/custom.css";
import "./App.css";
import Logo from "./assets/images/logos/logo.png";
import Web3Modal from "web3modal";
import Authereum from "authereum";
import WalletConnectProvider from "@walletconnect/web3-provider";

function App() {
  //Web3modal
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
        network: "rinkeby",
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
      package: Authereum, // required
    },
  };
  const web3Modal = new Web3Modal({
    providerOptions, // required
  });
  useEffect(() => {
    const app = async () => {
      const provider = await web3Modal.connectTo("walletconnect");
    };
    return app();
  }, []);

  // const provider = new ethers.providers.Web3Provider(instance);
  //const signer = provider.getSigner();

  //Setting elements
  const [toNetwork, setToNetwork] = useState({});
  const { setNet, net, nets, ammount, handleChange, transaction } =
    useBlockChainContext();
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    //Setting "To" netwoek
    nets.map((index) => {
      if (net.name !== index.name) setToNetwork({ ...index });
    });
  }, [net]);
  
  //Bridge
  const [ethmint, ethburn] =useEthBridge();
  const [bscmint, bscburn] =useBscBridge();

  return (
    <div className="App">
      <div className="nav">
        <img src={Logo} alt="" />
      </div>
      <div className="bridge-container-custom">
        <div className="networks-info">
          <div className="from-network">
            <h3 className="grey">From</h3>
            <h2>{net.name}</h2>
          </div>
          <div className="to-network">
            <h3 className="grey">To</h3>
            <h2>{toNetwork.name}</h2>
          </div>
        </div>
        <div className="bridge-form-container">
          <div className="sm-network left">
            <h3 className="grey">From</h3>
            <h2>{net.name}</h2>
          </div>
          <div className="input-area from-input-area">
            <div className="token-selection">
              <img src={Logo} className="token-logo from-token-logo" alt="" />
              <h3 className="input-area-network-title">{net.name}</h3>
              <h5 className="grey right">Balance: 0.000</h5>
            </div>
            <input
              type="text"
              className="input from-input"
              placeholder="0.000"
              value={ammount}
              onChange={handleChange}
              readOnly={locked}
            />
          </div>
          <div className="buttons">
            <div className="top"></div>
            <div className="bottom"></div>
            <button onClick={() => setLocked(!locked)}>
              <h3>
                <b>{locked ? "Locked" : "Unlocked"}</b>
              </h3>{" "}
              <span className="material-icons">
                {locked ? "lock" : "lock_open"}
              </span>
            </button>
            <div
              className="swap-button"
              onClick={() => locked || setNet({ ...net, ...toNetwork })}
            >
              <span className="material-icons">swap_horiz</span>
            </div>
            <button onClick={() => locked || transaction()}>
              <h3>
                <b>Transfer</b>
              </h3>
              <span className="material-icons">arrow_forward</span>
            </button>
          </div>
          <div className="sm-network right">
            <h3 className="grey">To</h3>
            <h2>{toNetwork.name}</h2>
          </div>
          <div className="input-area to-input-area">
            <div className="token-selection">
              <img src={Logo} className="token-logo from-token-logo" alt="" />
              <h3 className="input-area-network-title">{toNetwork.name}</h3>
              <h5 className="grey right">Balance: 0.000</h5>
            </div>
            <input
              type="text"
              className="input to-input"
              readOnly
              placeholder="0.000"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;