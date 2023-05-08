import React, { Component, useEffect } from "react";
import ReactDOM from "react-dom";
import logo from './logo.svg';
import './App.css';
import { NativeAssetId, Provider, Wallet } from 'fuels';
import { BackendAbi__factory } from './types';

function App() {
  // Connect to testnet beta-3
  const provider = new Provider('https://beta-3.fuel.network/graphql');
  const predicate = BackendAbi__factory.createInstance(provider);
  console.log(predicate.address.toB256());

  // Setup test wallet
  // TODO *Add in private key of wallet that is funded*
  const wallet = Wallet.fromPrivateKey("0x..", provider);

  useEffect(() => {
    const connectPredicate = async () => {
      // Fund the predicate
      const response1 = await wallet.transfer(predicate.address, 100000, NativeAssetId, {
        gasLimit: 61,
        gasPrice: 1,
      });
      await response1.wait();

      // Try to spend the funds in the predicate
      const walletBalanceBefore = await wallet.getBalance();
      console.log("walletBalanceBefore", walletBalanceBefore);

      const tx = await predicate
        .transfer(wallet.address, 3, NativeAssetId, {
          gasLimit: 61,
          gasPrice: 1,
        });
      await tx.waitForResult();
      /*
      Gives error
  
      Error: Invalid transaction: 
      The transaction contains a predicate which failed to validate: 
      TransactionId(0x46a0f055a6559d1560525d22fa0e39337704739274d7fa6cbe162e06c1971c51): {"response":{"data":null,
      "errors":[{"message":"Invalid transaction: The transaction contains a predicate which failed to validate: 
      TransactionId(0x46a0f055a6559d1560525d22fa0e39337704739274d7fa6cbe162e06c1971c51)",
      "locations":[{"line":2,"column":3}],"path":["dryRun"]}],"status":200,
      "headers":{"map":{"content-type":"application/json"}}},
      "request":{"query":"mutation dryRun($encodedTransaction: HexString!, $utxoValidation: Boolean) {\n  dryRun(tx: $encodedTransaction, utxoValidation: $utxoValidation) {\n    ...receiptFragment\n  }\n}\n\nfragment receiptFragment on Receipt {\n  data\n  rawPayload\n}","variables":{"encodedTransaction":"0x00000000000000000000000000000001000000000000003d00000000000000000000000000000004000000000000000000000000000000010000000000000002000000000000000100000000000000000000000000000000000000000000000000000000000000002400000000000000000000000000000055985e21840f002395ecdf420b1ccf94f8d729597020c3cad838728568e74a2e0000000000000000356d49ebdbdffb1c16d761d7b8c51865aa2ab5a7a9b716b0b75e426a3082ac2e00000000000186a000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001c00000000000000009000000447000000000000000000001c5dfcc00110fff30024040000000000000000000000000000efdd5488ca92730d3144648c0f3ee8e7cbca089681d07eb2586d55d80ce182a7000000000000000300000000000000000000000000000000000000000000000000000000000000000000000000000003356d49ebdbdffb1c16d761d7b8c51865aa2ab5a7a9b716b0b75e426a3082ac2e000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","utxoValidation":false}}}
   
    
      */

      const walletBalanceAfter = await wallet.getBalance();
      console.log("walletBalanceAfter", walletBalanceAfter);
    }

    connectPredicate()
      .catch(console.error);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
