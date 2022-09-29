
const BridgeEth = artifacts.require('./contract/BridgeEth.sol');
const BridgeBsc = artifacts.require('./contract/BridgeBsc.sol');
//const Token = artifacts.require("./contract/BEP20Token.sol"); 

module.exports = async function (deployer, network, addresses) {
  if(network === 'ethTestnet') {
    const libAddress = '0x12299165697f75c61506d14878E614fed96A85F2';
   // Token.link('Token',libAddress);
   // const tokenEth = deployer.deploy(Token);
 //  const tokenEth = Token.deployed;
  //  await deployer.deploy(BridgeEth, tokenEth.address);
  await deployer.deploy(BridgeEth, libAddress);
    //const bridgeEth = await BridgeEth.deployed();
    //await tokenEth.updateAdmin(bridgeEth.address);
  }
  if(network === 'bscTestnet') {
    const libAddress = '0xAA78E5E4fc6d22c501E567bDF7c29D8A8C9bd173';
    Token.link('Token',libAddress);
   // const tokenBsc = deployer.deploy(Token);
    const tokenBsc = Token.deployed;
    await deployer.deploy(BridgeBsc, libAddress);
    //const bridgeBsc = await BridgeBsc.deployed();
   // await tokenBsc.updateAdmin(bridgeBsc.address);
  } 
  
};
