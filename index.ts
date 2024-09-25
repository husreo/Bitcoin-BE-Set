import { tranferBTC } from './bundler/btc/simple_transfer'
import * as ecc from "tiny-secp256k1";
import * as Bitcoin from 'bitcoinjs-lib';

Bitcoin.initEccLib(ecc);

import { getInscriptionData } from './bundler/ordinals/ordinals_transfer';
(async() => {
    // const utxo = await getInscriptionData("e875480e44ec88c1ea9cd5946e1c504619410ee4e17a99eef9a3f7344f35efcci0");
    // console.log(utxo.utxo.inscriptions);
})()
