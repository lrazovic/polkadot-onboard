import { memo, useEffect, useState } from 'react';
import Image from 'next/image';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { BaseWallet, Account } from '@polkadot-onboard/core';
import { AccountBox } from './AccountBox';
import styles from '../styles/Home.module.css';

const Wallet = ({ wallet }: { wallet: BaseWallet }) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [api, setApi] = useState<ApiPromise | null>(null);
  const [isBusy, setIsBusy] = useState<boolean>(false);

  useEffect(() => {
    const setupApi = async () => {
      const provider = new WsProvider('wss://beta.rolimec.org');
      const api = await ApiPromise.create({
        provider,
        noInitWarn: true,
        // NOTE: If you install the polkadot-js extensions from main, the `types` object is not needed.
        // NOTE: In this case the error is:
        //
        // Error: Struct: failed on assetId: Option<MultiLocation>:: decodeU8aStruct: failed at 0x010300a10f043205e514… on interior (index 2/2):
        //  {"_enum":{"Here":"Null","X1":"[JunctionV4;1]","X2":"[JunctionV4;2]","X3":"[JunctionV4;3]","X4":"[JunctionV4;4]","X5":"[JunctionV4;5]","X6":"[JunctionV4;6]","X7":"[JunctionV4;7]","X8":"[JunctionV4;8]"}}::
        // decodeU8aVec: failed at 0x0300a10f043205e514… (index 1/1):
        // {"_enum":{"Parachain":"Compact<u32>","AccountId32":"{\"network\":\"Option<NetworkIdV4>\",\"id\":\"[u8;32]\"}","AccountIndex64":"{\"network\":\"Option<NetworkIdV4>\",\"index\":\"Compact<u64>\"}","AccountKey20":"{\"network\":\"Option<NetworkIdV4>\",\"key\":\"[u8;20]\"}","PalletInstance":"u8","GeneralIndex":"Compact<u128>","GeneralKey":"{\"length\":\"u8\",\"data\":\"[u8;32]\"}","OnlyChild":"Null","Plurality":"{\"id\":\"BodyIdV3\",\"part\":\"BodyPartV3\"}","GlobalConsensus":"NetworkIdV4"}}::
        // decodeU8aStruct: failed at 0xa10f043205e514… on key (index 2/2): [u8;20]:: Expected input with 20 bytes (160 bits), found 7 bytes

        // NOTE: On the latest "prod" version (0.52.2: https://chromewebstore.google.com/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd) of the polkadot-js extensions, the `types` object is needed.
        // NOTE: But we have to set the `TAssetConversion` to `MultiLocation`, if we set it to `Option<MultiLocation>` (as it should be) we get an error.
        // types: {
        //   TAssetConversion: 'MultiLocation', // The Signed Extensions in the runtime accept an `Option<MultiLocation>`.
        // },
        // NOTE: The error in this case could be:
        // 1) If we DON'T update the Metadata in the polkadot-js extension.
        // Error: createType(ExtrinsicPayload):: createType(ExtrinsicPayloadV4):: Struct: failed on assetId: u32:: u32: Input too large. Found input with 73 bits, expected 32
        // 2) If we update to the latest metadata:
        // RpcError: 1002: Verification Error: Runtime error: Execution failed: Execution aborted due to trap: wasm trap: wasm `unreachable` instruction executed
        // ...
        // ... polimec_runtime.wasm!TaggedTransactionQueue_validate_transaction: RuntimeApi, Execution failed: ...
      });

      setApi(api);
    };

    setupApi();
  }, []);

  const walletClickHandler = async (event: React.MouseEvent) => {
    console.log(`wallet clicked!`);
    if (!isBusy && api) {
      try {
        setIsBusy(true);
        await wallet.connect();
        let accounts = await wallet.getAccounts();
        setAccounts(accounts);
      } catch (error) {
        // handle error
      } finally {
        setIsBusy(false);
      }
    }
  };

  return (
    <div className={`${styles.card} ${styles.shadow}`} style={{ marginBottom: '20px' }} onClick={walletClickHandler}>
      <div className={`${styles.walletheader}`}>
        <div style={{ margin: 5, display: 'flex', alignItems: 'center' }}>
          {wallet?.metadata?.iconUrl && <Image width={45} height={45} src={wallet.metadata.iconUrl} alt='wallet icon' />}
        </div>
        <div>{`${wallet.metadata.title} ${wallet.metadata.version || ''}`}</div>
      </div>
      <div className={`${styles.wallet}`}>
        {accounts.length > 0 &&
          accounts.map(({ address, name = '' }) => (
            <div key={address}>
              <AccountBox api={api} account={{ address, name }} signer={wallet.signer} />
            </div>
          ))}
      </div>
    </div>
  );
};

export default memo(Wallet);
