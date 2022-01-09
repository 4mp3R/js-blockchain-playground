import sha256 from 'crypto-js/sha256.js';

export default class Block {
  constructor(transactions) {
    this.timestamp = Date.now();
    this.transactions = transactions;
    this.nonce = 0;
  }

  calculateHash() {
    const hashInput = [
      this.prevHash,
      this.timestamp,
      JSON.stringify(this.transactions),
      this.nonce
    ].join('');

    return sha256(hashInput).toString();
  }

  isBlockSigned(miningDifficulty) {
    return this.hash?.startsWith('0'.repeat(miningDifficulty))
  }

  mineBlock(miningDifficulty) {
    while(!this.isBlockSigned(miningDifficulty)) {
      this.hash = this.calculateHash(++this.nonce);
    }
  }

  verify(miningDifficulty) {
    this.transactions.forEach(transactiton => transactiton.verify());

    if (!this.isBlockSigned(miningDifficulty)) {
      throw new Error('Block signature is invalid');
    }
  }

  toString() {
    return JSON.stringify(this, null, 2);
  }
}
