import elliptic from 'elliptic';

import Transaction from './transaction.js';
import Blockchain from './blockchain.js';

const ec = new elliptic.ec('secp256k1');

// TEST PRIVATE KEYS
const PrivateKeys = {
  ALEX: '356492880f9d4d5f3578458812406ebfa504aa9b2cfaacc3d4690ccb1d3b5a88',
  SAM: '556166174315fd3b56cffa3991a3be5febc34ea5ae73328afb347988fdb3d7ea',
  DOROTHY: '8350179e0f2b7ebc74b0c30e120596678767b0ec38ca0fed35f7057b74a4fb87',
  BOB: '79b0cf79357e5f5cbd3a241ab34b7a8078a78ef918c351216f33dee36a305a15'
};

const alexKey = ec.keyFromPrivate(PrivateKeys.ALEX);
const samKey = ec.keyFromPrivate(PrivateKeys.SAM);
const dorothyKey = ec.keyFromPrivate(PrivateKeys.DOROTHY);
const bobKey = ec.keyFromPrivate(PrivateKeys.BOB);

const xCoin = new Blockchain();

const t1 = new Transaction(
  alexKey.getPublic('hex'),
  samKey.getPublic('hex'),
  10
);
t1.sign(alexKey);
xCoin.enqueueTransaction(t1);

const t2 = new Transaction(
  alexKey.getPublic('hex'),
  dorothyKey.getPublic('hex'),
  10
);
t2.sign(alexKey);
xCoin.enqueueTransaction(t2);

const t3 = new Transaction(
  samKey.getPublic('hex'),
  dorothyKey.getPublic('hex'),
  5
);
t3.sign(samKey);
xCoin.enqueueTransaction(t3);

xCoin.minePendingTransactions(alexKey.getPublic('hex'));
xCoin.verify();

const t4 = new Transaction(
  samKey.getPublic('hex'),
  bobKey.getPublic('hex'),
  3
);
t4.sign(samKey);
xCoin.enqueueTransaction(t4);
xCoin.minePendingTransactions(alexKey.getPublic('hex'));

console.log(xCoin.getBalance(alexKey.getPublic('hex')));
console.log(xCoin.getBalance(samKey.getPublic('hex')));
console.log(xCoin.getBalance(dorothyKey.getPublic('hex')));
console.log(xCoin.getBalance(bobKey.getPublic('hex')));

xCoin.save();

// xCoin.chain[1].transactions[0].amount = 1;
// xCoin.chain[1].hash = xCoin.chain[1].calculateHash();
// xCoin.verify();
