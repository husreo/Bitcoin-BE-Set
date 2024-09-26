import { tranferBTC } from './bundler/btc/simple_transfer'
import * as ecc from "tiny-secp256k1";
import * as Bitcoin from 'bitcoinjs-lib';

Bitcoin.initEccLib(ecc);

import { getInscriptionData, sendOrdinalsController } from './bundler/ordinals/ordinals_transfer';
(async() => {
    // const utxo = await getInscriptionData("e875480e44ec88c1ea9cd5946e1c504619410ee4e17a99eef9a3f7344f35efcci0");
    // console.log(utxo.utxo.inscriptions);
    await sendOrdinalsController("tb1pfkhgyczsjvckfv9x5lsc75h6pw6lppnulc0nkmkamhyg84fnrm2q2m6gxm", "ee7e18074c1273c80fbbb437018984bf8dcd1e931d58116ea31692bed43b8287i0");
})()
