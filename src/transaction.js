import sha256 from 'crypto-js/sha256.js';
import elliptic from 'elliptic';

const ec = new elliptic.ec('secp256k1');

export default class Transaction {
  constructor(from, to, amount) {
    if ((!from && from !== null) || !to) {
      throw new Error('Transaction must include both from and to addresses');
    }

    if (typeof amount !== 'number' || amount <= 0) {
      throw new Error('Transaction amount must be number > 0');
    }

    this.from = from;
    this.to = to;
    this.amount = amount;
    this.timestamp = Date.now();
  }

  calculateHash() {
    return sha256(this.from + this.to + this.amount + this.timestamp).toString();
  }

  sign(key) {
    if (key.getPublic('hex') !== this.from) {
      throw new Error('Transaction signing failed - public key mismatch');
    }

    const hash = this.calculateHash();
    const signature = key.sign(hash, 'base64');
    this.signature = signature.toDER('hex');
  }

  verify() {
    if (this.from === null) {
      return true;
    }

    const key = ec.keyFromPublic(this.from, 'hex');

    if (!key.verify(this.calculateHash(), this.signature)) {
      throw new Error('Transaction signature is invalid');
    }
  }
}
