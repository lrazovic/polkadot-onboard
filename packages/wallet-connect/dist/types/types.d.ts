import { SignClientTypes } from '@walletconnect/types';
export type WcAccount = `${string}:${string}:${string}`;
export type PolkadotNamespaceChainId = `polkadot:${string}`;
export interface WalletOptionsType {
    id: string;
    name: string;
    links: {
        native: string;
        universal?: string;
    };
}
export interface WalletConnectConfiguration extends SignClientTypes.Options {
    projectId: string;
    chainIds?: PolkadotNamespaceChainId[];
    optionalChainIds?: PolkadotNamespaceChainId[];
    onSessionDelete?: () => void;
    options?: {
        mobileWallets?: WalletOptionsType[];
        desktopWallets?: WalletOptionsType[];
        walletImages?: Record<string, string>;
        enableAuthMode?: boolean;
        enableExplorer?: boolean;
        explorerRecommendedWalletIds?: string[] | 'NONE';
        explorerExcludedWalletIds?: string[] | 'ALL';
        termsOfServiceUrl?: string;
        privacyPolicyUrl?: string;
        themeMode?: 'dark' | 'light';
        themeVariables?: Record<string, string>;
    };
}
//# sourceMappingURL=types.d.ts.map