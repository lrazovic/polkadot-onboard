import type { BaseWallet, BaseWalletProvider } from './types.js';
export declare class WalletAggregator {
    walletProviders: BaseWalletProvider[];
    constructor(providers: BaseWalletProvider[]);
    getWallets(): Promise<BaseWallet[]>;
}
//# sourceMappingURL=walletAggregator.d.ts.map