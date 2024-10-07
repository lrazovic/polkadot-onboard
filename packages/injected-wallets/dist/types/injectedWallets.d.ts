import type { BaseWallet, BaseWalletProvider } from '@polkadot-onboard/core';
import type { ExtensionConfiguration, WalletExtension } from './types.js';
export declare class InjectedWalletProvider implements BaseWalletProvider {
    config: ExtensionConfiguration;
    supportedOnly: boolean;
    appName: string;
    constructor(config: ExtensionConfiguration, appName: string, supportedOnly?: boolean);
    getExtensions(): Promise<{
        known: WalletExtension[];
        other: WalletExtension[];
    }>;
    getWallets(): Promise<BaseWallet[]>;
}
//# sourceMappingURL=injectedWallets.d.ts.map