import { SeedWallet } from "../../wallets/SeedWallet";
import networkConfig from "../../config/network.config";
import * as Bitcoin from 'bitcoinjs-lib';
import axios from "axios";

const networkType: string = networkConfig.networkType;

// export async function sendOrdinalsController(
//     destination: string,
//     inscriptionId: string,
//     paymentAddress: string
// ) {

//     const psbt = new Bitcoin.Psbt({
//         network: networkType == "testnet" ? Bitcoin.networks.testnet : Bitcoin.networks.bitcoin
//     });
//     const seed: string = process.env.MNEMONIC as string;
//     const wallet = new SeedWallet({ networkType: networkType, seed: seed });

//     const inscriptionData = await getInscriptionData(
//         wallet.address,
//         inscriptionId
//         // "e27c4838659659036fbdbbe869a49953d7fc65af607b160cff98736cea325b1ei0"
//     );

//     psbt.addInput({
//         hash: inscriptionData.txid,
//         index: inscriptionData.vout,
//         witnessScript: Buffer.from(multisigVault.witnessScript, "hex"),
//         witnessUtxo: {
//             script: Buffer.from(multisigVault.p2msOutput, "hex"),
//             value: inscriptionData.satoshi,
//         },
//     });

//     psbt.addOutput({
//         address: destination,
//         value: inscriptionData.satoshi,
//     });

//     const btcUtxos = await getBtcUtxoByAddress(address);

//     const feeRate = (await getFeeRate()) + 400;
//     console.log("feeRate ==> ", feeRate);
//     let FinalTotalBtcAmount = 0;
//     let finalFee = 0;
//     for (const btcutxo of btcUtxos) {
//         finalFee = await calculateTxFee(psbt, feeRate);
//         if (FinalTotalBtcAmount < finalFee && btcutxo.value > 10000) {
//             FinalTotalBtcAmount += btcutxo.value;
//             psbt.addInput({
//                 hash: btcutxo.txid,
//                 index: btcutxo.vout,
//                 witnessScript: Buffer.from(witnessScript, "hex"),
//                 witnessUtxo: {
//                     script: Buffer.from(p2msOutput, "hex"),
//                     value: btcutxo.value,
//                 },
//             });
//         }
//     }

//     console.log("Pay finalFee =====================>", finalFee);

//     if (FinalTotalBtcAmount < finalFee)
//         throw `Need more ${finalFee - FinalTotalBtcAmount} BTC for transaction`;

//     console.log("FinalTotalBtcAmount ====>", FinalTotalBtcAmount);

//     psbt.addOutput({
//         address: address,
//         value: FinalTotalBtcAmount - finalFee,
//     });

//     console.log("psbt.toHex() ==> ", psbt.toHex());

//     return psbt.toHex();
// }

export const getInscriptionData = async (
    // address: string,
    inscriptionId: string
) => {
    const seed: string = process.env.MNEMONIC as string;
    const wallet = new SeedWallet({ networkType: networkType, seed: seed });
    try {
        const url = `${process.env.OPENAPI_UNISAT_URL}/v1/indexer/address/${wallet.address}/inscription-data`;

        const config = {
            headers: {
                Authorization: `Bearer ${process.env.OPENAPI_UNISAT_TOKEN}`,
            },
        };
        const res = await axios.get(url, { ...config });
        const filterInscription = res.data.data.inscription.find(
            (inscription: any) => inscription.inscriptionId === inscriptionId
        );
        
        return filterInscription;
    } catch (error: any) {
        console.log(error.data);
        throw new Error("Can not fetch Inscriptions!!");
    }
};