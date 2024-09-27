import { SeedWallet } from "../../wallets/SeedWallet";
import networkConfig from "../../config/network.config";
import * as Bitcoin from 'bitcoinjs-lib';
import axios from "axios";
import { getUTXO, selectUTXO } from "../../manageUTXO/utxo";
import { pushBTCpmt } from "../../manageUTXO/mempool";

const networkType: string = networkConfig.networkType;
const TESTNET_FEERATE = 20;
const INITIAL_FEE = 400;

export async function sendOrdinalsController(
    destination: string,
    inscriptionId: string,
) {
    let initialFee = 0;
    let redeemFee = INITIAL_FEE;
    let psbt = new Bitcoin.Psbt({
        network: networkType == "testnet" ? Bitcoin.networks.testnet : Bitcoin.networks.bitcoin
    });

    const seed: string = process.env.MNEMONIC as string;
    const wallet = new SeedWallet({ networkType: networkType, seed: seed });

    const inscriptionData = await getInscriptionData(
        wallet.address,
        inscriptionId
    );

    // psbt.addInput({
    //     hash: inscriptionData.txid,
    //     index: inscriptionData.vout,
    //     // tapInternalKey: Buffer.from(wallet.publicKey, "hex").subarray(1, 33),
    //     witnessUtxo: {
    //         script: wallet.output,
    //         value: inscriptionData.satoshi,
    //     },
    // });

    // psbt.addOutput({
    //     address: destination,
    //     value: inscriptionData.satoshi,
    // });
    
    const btcUtxos = await getUTXO(wallet.address, "testnet");
    do {
        
        initialFee = redeemFee;
        const selectedUtxo = await selectUTXO(btcUtxos, 0, initialFee);
        ////////////////////////////////////////////////////////////////////////////////////////////////
        let value = 0;

        for (let i = 0; i < selectedUtxo.length; i++) {
            psbt.addInput({
                hash: selectedUtxo[i].txid,
                index: selectedUtxo[i].vout,
                witnessUtxo: {
                    value: selectedUtxo[i].value,
                    script: wallet.output,
                },
            })
            value += selectedUtxo[i].value;
        }

        psbt.addOutput({
            address: wallet.address,
            value: value - initialFee,
        })

        psbt = wallet.signPsbt(psbt, wallet.ecPair);
        redeemFee = psbt.extractTransaction().virtualSize() * TESTNET_FEERATE;
        ////////////////////////////////////////////////////////////////////////////////////////////////
    } while (redeemFee != initialFee);

    const txHex = psbt.extractTransaction().toHex();
    const txId = await pushBTCpmt(txHex, networkType);
}

export const getInscriptionData = async (
    address: string,
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

        return filterInscription.utxo;
    } catch (error: any) {
        console.log(error.data);
        throw new Error("Can not fetch Inscriptions!!");
    }
};