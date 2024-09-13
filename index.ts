import { getUTXO } from "./manageUTXO/utxo";

(async () => {
    const result = await getUTXO("tb1pknuxraa3mwhq2t3arz52n3lnnrs39kzpt6u2v8errf5qqwvfg25qvkxeyu", "testnet");
    console.log(result);
})()