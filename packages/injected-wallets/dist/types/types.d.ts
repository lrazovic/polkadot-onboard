import { InjectedWindowProvider } from '@polkadot/extension-inject/types';
export interface ExtensionMetadata {
    id: string;
    title: string;
    description?: string;
    urls?: {
        main?: string;
        browsers?: Record<string, string>;
    };
    iconUrl?: string;
    version?: string;
}
export interface ExtensionConfiguration {
    disallowed?: string[];
    supported?: ExtensionMetadata[];
}
export interface WalletExtension extends InjectedWindowProvider {
    metadata: ExtensionMetadata;
}
//# sourceMappingURL=types.d.ts.map