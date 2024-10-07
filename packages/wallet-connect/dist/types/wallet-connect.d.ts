import type { BaseWallet, BaseWalletProvider } from '@polkadot-onboard/core';
import type { WalletConnectConfiguration } from './types.js';
export declare const POLKADOT_CHAIN_ID = "polkadot:91b171bb158e2d3848fa23a9f1c25182";
export declare const WC_VERSION = "2.0";
export declare class WalletConnectProvider implements BaseWalletProvider {
    config: WalletConnectConfiguration;
    appName: string;
    constructor(config: WalletConnectConfiguration, appName: string);
    getWallets(): Promise<BaseWallet[]>;
}
//# sourceMappingURL=wallet-connect.d.ts.map