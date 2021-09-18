const SmartContract = artifacts.require("SmartContract");

module.exports = function (deployer) {
  deployer.deploy(SmartContract, "Cute Mountains", "CM", "https://ipfs.io/ipfs/QmRQqK5FT8YKdaeeAmuLq2Z9daUWfkQtcypCLgpkFhe1mu/");
};
