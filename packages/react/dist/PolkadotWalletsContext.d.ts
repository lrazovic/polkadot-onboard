import type { BaseWallet, WalletAggregator } from '@polkadot-onboard/core';
interface PolkadotWalletsContextProviderProps {
    children: any;
    walletAggregator: WalletAggregator;
    initialWaitMs?: number;
}
interface PolkadotWalletsContextProps {
    wallets: BaseWallet[] | undefined;
}
export declare const useWallets: () => PolkadotWalletsContextProps;
export declare const PolkadotWalletsContextProvider: ({ children, walletAggregator, initialWaitMs, }: PolkadotWalletsContextProviderProps) => import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=PolkadotWalletsContext.d.ts.map