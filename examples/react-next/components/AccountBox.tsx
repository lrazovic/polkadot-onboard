import type { ApiPromise } from '@polkadot/api';
import type { Signer } from '@polkadot/types/types';
import styles from 'styles/Home.module.css';

const shorten = (str: string) => {
  let size = 10;
  let result = str;
  if (str && str.length > 2 * size) {
    let start = str.slice(0, size);
    let end = str.slice(-size);
    result = `${start}...${end}`;
  }
  return result;
};

interface AccountBoxParams {
  account: { address: string; name: string };
  signer?: Signer;
  api: ApiPromise | null;
}

export const AccountBox = ({ api, account, signer }: AccountBoxParams) => {
  const signTransactionHandler = async (event: any) => {
    event.preventDefault();
    event.stopPropagation();
    if (api && account?.address && signer) {
      const inputAsset = (assetId: number) =>
        api.createType('MultiLocationV3', {
          parents: 1,
          interior: {
            X3: [{ Parachain: 1000 }, { PalletInstance: 50 }, { GeneralIndex: assetId }],
          },
        });

      const tx = await api.tx.system.remark('I am signing this transaction!').signAsync(account.address, { signer, assetId: inputAsset(1337) });
      // NOTE: The extrinsic will be encoded as:
      // {
      //     ...
      //     "assetId": "0x01010300a10f043205e514", <--- This should be the SCALE encoded MultiLocation
      //     ...
      //     "signedExtensions": [
      //         "CheckNonZeroSender",
      //         "CheckSpecVersion",
      //         "CheckTxVersion",
      //         "CheckGenesis",
      //         "CheckMortality",
      //         "CheckNonce",
      //         "CheckWeight",
      //         "ChargeAssetTxPayment", <--- This is the signed extension that charges the asset
      //         "CheckMetadataHash"
      //     ],
      //     "tip": "0x00000000000000000000000000000000",
      //     ...
      // }

      // NOTE: 0x01010300a10f043205e514 cannot be SCALE-decoded as a MultiLocation.
      // Tested here: https://www.shawntabrizi.com/substrate-js-utilities/codec/ using as a type:
      // [
      //   {
      //     "AssetIdLocation": "MultiLocationV3"
      //   }
      // ]
      console.log(tx.toHuman());
      await tx.send();
    }
  };
  const signMessageHandler = async (event: any) => {
    event.preventDefault();
    event.stopPropagation();
    const signRaw = signer?.signRaw;

    if (!!signRaw && account?.address) {
      const { signature } = await signRaw({
        address: account.address,
        data: 'I am signing this message',
        type: 'bytes',
      });
      console.log(`Signature: ${signature}`);
    }
  };

  return (
    <div className={`${styles.card} ${styles.account}`}>
      <div className={`${styles.name}`}>{shorten(account?.name)}</div>
      <div className={`${styles.address}`}>{shorten(account?.address)}</div>
      <div className={`${styles.flex} ${styles.column}`}>
        <button className={`${styles.btn} ${styles.small}`} onClick={(e) => signTransactionHandler(e)}>
          Submit Transaction
        </button>
        <button className={`${styles.btn} ${styles.small}`} onClick={(e) => signMessageHandler(e)}>
          Sign Message
        </button>
      </div>
    </div>
  );
};
