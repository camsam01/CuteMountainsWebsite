// constants
import Web3 from "web3";
import SmartContract from "../../contracts/ABI.json";
// log
import { fetchData } from "../data/dataActions";

const connectRequest = () => {
  return {
    type: "CONNECTION_REQUEST",
  };
};

const connectSuccess = (payload) => {
  return {
    type: "CONNECTION_SUCCESS",
    payload: payload,
  };
};

const connectFailed = (payload) => {
  return {
    type: "CONNECTION_FAILED",
    payload: payload,
  };
};

const updateAccountRequest = (payload) => {
  return {
    type: "UPDATE_ACCOUNT",
    payload: payload,
  };
};

export const connect = () => {
  return async (dispatch) => {
    dispatch(connectRequest());
    const { ethereum } = window;
    const metamaskIsInstalled = ethereum && ethereum.isMetaMask;
    if (metamaskIsInstalled) {
      let web3 = new Web3(ethereum);
      try {
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
        const networkId = await ethereum.request({
          method: "net_version",
        });
        const chainID = await ethereum.request({
          method: "eth_chainId",
        });
        //const NetworkData = await SmartContract.networks[networkId];
        if (networkId == 43114) {  // networkId was originally NetworkData   remember that 43114 is avax c chain id, and 137 is polygon 43113 is fuji testnet  chain: 43114, network:1
          if (chainID == 43114) {
          const SmartContractObj = new web3.eth.Contract(
            SmartContract,
            //NetworkData.address,
            "0xeec4198B5b7c11378154777ef27a5DD1Dd2FE98a"  //have taken the contract address from the smart contract
          );
          dispatch(
            connectSuccess({
              account: accounts[0],
              smartContract: SmartContractObj,
              web3: web3,
            })
          );
          // Add listeners start
          ethereum.on("accountsChanged", (accounts) => {
            dispatch(updateAccount(accounts[0]));
          });
          ethereum.on("chainChanged", () => {
            window.location.reload();
          });
          // Add listeners end
          }else {
            dispatch(connectFailed("Change your network to the Avalanche C-Chain. Incorrect chainID detected."));
          }
       } else {
          dispatch(connectFailed("Change your network to the Avalanche C-Chain. Incorrect networkID detected. Your NetworkID is " + networkID));
        }
      } catch (err) {
        dispatch(connectFailed("Something went wrong when reuqesting networkID, chainID or MetaMask address."));
      }
    } else {
      dispatch(connectFailed("You need to have MetaMask to interact with this website and buy a CuteMountain NFT. :)"));
    }
  };
};

export const updateAccount = (account) => {
  return async (dispatch) => {
    dispatch(updateAccountRequest({ account: account }));
    dispatch(fetchData(account));
  };
};
