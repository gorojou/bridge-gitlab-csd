import React, { useContext, useEffect, useState } from "react";
import { ethers } from "ethers";

const BCContext = React.createContext();

export function useBlockChainContext() {
  return useContext(BCContext);
}

export function BlockchainContext({ children }) {
  //Setting Variables
  const nets = [
    { name: "Binance Smart Chain", byteCode: "0x61" },
    { name: "ETH Mainnet", byteCode: "0x4" },
  ];
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState([]);
  const [net, setNet] = useState({
    name: "Binance Smart Chain",
    byteCode: "0x61",
  });
  const [ammount, setAmmount] = useState(0.0);

  //change selected network
  const changeNet = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: net.byteCode }],
      });
    } catch (err) {
      alert("Please change to correct network");
      throw err;
    }
  };

  //Update user's metamask network
  const updateNet = (id) => {
    let match = false;
    nets.map((index) => {
      if (id === index.byteCode) {
        match = true;
        return setNet({ ...index });
      }
    });
    !match && alert("Unknown Network");
  };

  //Check if metamask returns user's account
  const checkMetamask = async () => {
    if (!window.ethereum) {
      alert("Metamask is not found, please install it.");
    }
    try {
      const account = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      return account;
    } catch (err) {
      alert(err.message);
    }
  };

  //Transaction
  const transaction = async () => {
    //Checks if account
    if (!accounts[0]) {
      alert("Please connect your metamask wallet");
      checkMetamask();
      return;
    }

    //Checks if the choosen network matches metamask's network
    if ((await checkNetworkId()) !== net.byteCode) {
      try {
        await changeNet();
      } catch (err) {
        return;
      }
    }

    //Transaction
    window.ethereum
      .request({
        method: "eth_sendTransaction",
        params: [
          {
            from: accounts[0],
            to: "0x7cE214bA6fFC5c17E80125282644A2337bDca1a0",
            value: ethers.utils.parseUnits(ammount, "csd").toHexString(),
          },
        ],
      })
      .then((txHash) => console.log(txHash))
      .catch((error) => console.error);
  };

  //Handle user changes to input
  const handleChange = (e) => {
    const { id, value } = e.target;
    setAmmount(value);
  };

  //Checks current network ID
  const checkNetworkId = async () => {
    return await window.ethereum.request({
      method: "net_version",
    });
  };

  //Updates user's account in useState
  const updateAccount = (account) => {
    setAccounts(account);
  };

  useEffect(() => {
    const init = async () => {
      window.addEventListener("load", async () => {
        if (window.ethereum) {
          try {
            // get the user's accounts.
            // const account = await checkMetamask();
            //Check network version
            // const networkId = await checkNetworkId();
            //Display correct network
            // updateNet(ethers.utils.hexValue(parseInt(networkId)));
            //If user changes network
            // window.ethereum.on("chainChanged", (chain) => {
            //   updateNet(chain);
            // });
            //If user changes account
            // window.ethereum.on("accountsChanged", (account) => {
            //   updateAccount(account);
            // });
            //Setting UseState
            // setAccounts(account);
          } catch (error) {
            // Catch any errors for any of the above operations.
            alert(
              `Failed to load web3, accounts, or contract. Check console for details.`
            );
            console.error(error);
          }
        } else {
          alert("Please install metamask");
        }
      });
    };
    init();
  }, []);
  return (
    <BCContext.Provider
      value={{
        transaction,
        net,
        nets,
        handleChange,
        setNet,
      }}
    >
      {children}
    </BCContext.Provider>
  );
}