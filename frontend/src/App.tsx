import React, { Component, useEffect } from "react";
import ReactDOM from "react-dom";
import logo from './logo.svg';
import './App.css';
import { NativeAssetId, Predicate, Provider, Wallet, WalletUnlocked, bn } from 'fuels';
import { BackendAbi__factory } from './types';
import { seedTestWallet } from '@fuel-ts/wallet/test-utils';

function App() {
  // Connect to testnet beta-3
  const provider = new Provider('https://beta-3.fuel.network/graphql');
  const predicate = BackendAbi__factory.createInstance(provider);
  console.log(predicate.address.toB256());


  useEffect(() => {
    // Trying to setup testwallet
    const wallet = Wallet.generate({ provider });
    const connectPredicate = async () => {
      // Throws: Error: not enough resources to fit the target: 
      await seedTestWallet(wallet, [
        {
          amount: bn(1_000_000),
          assetId: NativeAssetId,
        },
      ]);

      // Fund the predicate
      const response1 = await wallet.transfer(predicate.address, 100000, NativeAssetId, {
        gasLimit: 164,
        gasPrice: 1,
      });
      await response1.wait();

      // Try to spend the funds in the predicate
      const walletBalanceBefore = await wallet.getBalance();
      console.log("walletBalanceBefore", walletBalanceBefore);

      const tx = await predicate
        .setData({has_account: true, total_complete: 100})
        .transfer(wallet.address, 30, NativeAssetId, {
          gasLimit: 3000,
          gasPrice: 1,
        });
      await tx.waitForResult();

      // This balance should be greater than "walletBalanceBefore", if the predicate was successfully spent
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
