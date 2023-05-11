import React, { Component, useEffect } from "react";
import ReactDOM from "react-dom";
import logo from './logo.svg';
import './App.css';
import { Address, CoinStatus, JsonFlatAbi, NativeAssetId, Predicate, Provider, ScriptTransactionRequest, Wallet, WalletUnlocked, bn } from 'fuels';
import { BackendAbi__factory } from './types';

function App() {
  // Connect to testnet beta-3
  const provider = new Provider('https://beta-3.fuel.network/graphql');
  const PREDICATE_BYTECODE =
  '0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8';
const PREDICATE_ADDRESS = '0x27c54187841c60ac0ebafcf1f2778d30f9973865f9a4bcd959e137aa852c4375';
const PREDICATE_ABI = {
  types: [
    {
      typeId: 0,
      type: 'bool',
      components: null,
      typeParameters: null,
    },
    {
      typeId: 1,
      type: 'b256',
    },
  ],
  functions: [
    {
      inputs: [
        {
          name: 'data',
          type: 1,
          typeArguments: null,
        },
      ],
      name: 'main',
      output: {
        name: '',
        type: 0,
        typeArguments: null,
      },
    },
  ],
  loggedTypes: [],
  configurables: [],
};
  const b256 = '0x0101010101010101010101010101010101010101010101010101010101010101';
  const predicate = new Predicate(PREDICATE_BYTECODE, PREDICATE_ABI, provider);

  useEffect(() => {
    const connectPredicate = async () => {
      // Reference test code: https://github.com/FuelLabs/fuels-ts/blob/eda13d72c32f72652a34f926c4b9cf42ac36556c/packages/predicate/src/predicate.test.ts#L96
      predicate.setData<[string]>(b256);

      const request = new ScriptTransactionRequest();
    
      request.addResource({
        // id: '0x01' gives error "Invalid b256 (argument="b256", value="0x01", code=INVALID_ARGUMENT..""
        // this input gives error "Invalid struct UtxoId. Field "outputIndex" not present. (argument="UtxoId", value"
        id: '0x0000000000000000000000000000000000000000000000000000000000000001',
        assetId: '0x0000000000000000000000000000000000000000000000000000000000000000',
        amount: bn(1),
        owner: Address.fromB256(PREDICATE_ADDRESS),
        status: CoinStatus.Unspent,
        maturity: 0,
        blockCreated: bn(0),
      });
    
      predicate.sendTransaction(request);
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
