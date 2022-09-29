const BridgeBsc = artifacts.require('./BridgeBsc.sol');

const privKey = '3996049a3275c629f46099e28f658b88e74577c9622260b5301e26b47a263bdd';

module.exports = async done => {
  let nonce = 1; //Need to increment this for each new transfer
  const accounts = await web3.eth.getAccounts();
  const bridgeBsc = await BridgeBsc.deployed();
  let amount;
  const message = web3.utils.soliditySha3(
    {t: 'address', v: accounts[0]},
    {t: 'address', v: accounts[0]},
    {t: 'uint256', v: amount},
    {t: 'uint256', v: nonce},
  ).toString('hex');
  const { signature } = web3.eth.accounts.sign(
    message, 
    privKey
  ); 
  await bridgeBsc.burn(accounts[0], amount, nonce, signature);
  done();
}