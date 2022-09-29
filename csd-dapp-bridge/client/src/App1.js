import React, { useState, useEffect } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";
import "./assets/stylesheets/application.css";
import "./assets/stylesheets/custom.css";
import BridgeBase from "./contracts/BridgeBase.json";
import BridgeEth from "./contracts/BridgeEth.json";
import BridgeBsc from "./contracts/BridgeBsc.json";
import "./App.css";
import { useBlockChainContext } from "./BlockChainContext";
import { ChildComponent } from "./ChildComponent";
import Logo from "./logo.png";

function App() {
   //Setting elements
   const [toNetwork, setToNetwork] = useState({});
   const { setNet, net, nets, ammount, handleChange, transaction } =
     useBlockChainContext();
   const [locked, setLocked] = useState(false);
  const [storageValue, setStorageValue] = useState(undefined);
  const [web3, setWeb3] = useState(undefined);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState([]);

useEffect(() =>{
  const init =async()=> {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const contract = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      const deployedBridgeEth = BridgeEth.amount;

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      setWeb3(web3);
      setAccounts(accounts);
      setContract(contract);
      
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  }
  init();
}, []);
useEffect(() => {
  //Setting "To" netwoek
  nets.map((index) => {
    if (net.name !== index.name) setToNetwork({ ...index });
  });
}, [net]);

useEffect(()=>{  
  const load = async()=>{
    // Stores a given value, 5 by default.
  //  await contract.methods.set(5).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();

    // Update state with the result.
    setStorageValue(response);
  };
  if(typeof web3!=="undefined"
     && typeof accounts !== "undefined" 
     && typeof contract !== "undefined"){
      // load();
     }
},[web3, accounts, contract]);
  const bscToken = "Binance Smart Chain";
  const ethToken = "ETH mainnet";
  const [tokenSelected, setToken] = useState(true);
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
