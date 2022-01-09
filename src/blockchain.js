import { writeFileSync, readFileSync } from 'fs';

import Transaction from './transaction.js';
import Block from './block.js';

export default class Blockchain {
  constructor() {
    this.miningDifficulty = 4; 
    this.miningReward = 100;
    this.storagePath = 'blockchain.json';
    this.chain = [this.createGenesisBlock()];
    this.pendingTransactions = [];
  }

  createGenesisBlock() {
    const genesisBlock = new Block([]);
    genesisBlock.prevHash = '0';
    genesisBlock.mineBlock(this.miningDifficulty);
    return genesisBlock;
  }

  getLastBlock() {
    return this.chain[this.chain.length - 1];
  }

  minePendingTransactions(miningRewardAddress) {
    const { hash: prevHash } = this.getLastBlock();

    let block = new Block([
      ...this.pendingTransactions,
      new Transaction(null, miningRewardAddress, this.miningReward)
    ]);    
    block.prevHash = prevHash;
    block.mineBlock(this.miningDifficulty);
    this.chain.push(block);

    this.pendingTransactions = [];

    console.debug(`Block ${block.hash} added to the blockchain`);
  }

  enqueueTransaction(transaction) {
    transaction.verify();
    this.pendingTransactions.push(transaction); 
  }

  getBalance(address) {
    return this.chain
      .flatMap(block => block.transactions)
      .reduce((balance, { from, to, amount }) => {
        if (address === from) {
          return balance - amount;
        }

        if (address === to) {
          return balance + amount;
        }

        return balance;
      }, 0);
  }

  verify() {
    this.chain.forEach((block, blockIndex, chain) => {
      if (block.hash !== block.calculateHash()) {
        throw new Error('Invalid hash for block: ' + block.toString());
      }

      if (blockIndex === 0) {
        return;
      }

      const prevBlock = chain[blockIndex - 1];
      if (block.prevHash !== prevBlock.hash) {
        throw new Error(`Prev hash ${prevBlock.hash} doesn't match the hash of the current block ${block.toString()}`);
      }

      block.verify();
    });
  }

  toString() {
    return JSON.stringify(this.chain, null, 2);
  }

  save() {
    writeFileSync(this.storagePath, this.toString());
  }
}
