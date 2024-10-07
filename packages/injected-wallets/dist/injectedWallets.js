import { WalletType } from '@polkadot-onboard/core';
const toWalletAccount = (account) => {
    return account;
};
function isWeb3Injected(injectedWindow) {
    return Object.values(injectedWindow.injectedWeb3 || {}).filter(({ connect, enable }) => !!(connect || enable)).length !== 0;
}
class InjectedWallet {
    type = WalletType.INJECTED;
    extension;
    appName;
    injected;
    metadata;
    signer;
    constructor(extension, appName) {
        this.extension = extension;
        this.metadata = { ...extension.metadata };
        this.appName = appName;
    }
    async getAccounts() {
        let injectedAccounts = await this.injected?.accounts.get();
        let walletAccounts = injectedAccounts?.map((account) => toWalletAccount(account));
        return walletAccounts || [];
    }
    async subscribeAccounts(cb) {
        const subscription = await this.injected?.accounts.subscribe((accounts) => {
            cb(accounts.map(toWalletAccount));
        });
        return () => {
            subscription?.();
        };
    }
    async connect() {
        try {
            let injected;
            if (this.extension?.connect) {
                injected = await this.extension.connect(this.appName);
            }
            else if (this.extension?.enable) {
                injected = await this.extension.enable(this.appName);
            }
            else {
                throw new Error('No connect(..) or enable(...) hook found');
            }
            this.injected = injected;
            this.signer = injected.signer;
        }
        catch ({ message }) {
            console.error(`Error initializing ${this.metadata.title}: ${message}`);
        }
    }
    async disconnect() { }
    isConnected() {
        return false;
    }
}
export class InjectedWalletProvider {
    config;
    supportedOnly;
    appName;
    constructor(config, appName, supportedOnly = false) {
        this.config = config;
        this.supportedOnly = supportedOnly;
        this.appName = appName;
    }
    async getExtensions() {
        const injectedWindow = window;
        const knownExtensions = [];
        const otherExtensions = [];
        if (!isWeb3Injected(injectedWindow)) {
            await Promise.any([300, 600, 1000].map((ms) => new Promise((resolve, reject) => setTimeout(() => {
                if (isWeb3Injected(injectedWindow)) {
                    resolve('injection complete');
                }
                else {
                    reject();
                }
            }, ms)))).catch(() => { });
        }
        if (injectedWindow.injectedWeb3) {
            Object.keys(injectedWindow.injectedWeb3).forEach((extensionId) => {
                if (!this.config.disallowed?.includes(extensionId)) {
                    const foundExtension = this.config.supported?.find(({ id }) => id === extensionId);
                    if (foundExtension) {
                        knownExtensions.push({ ...injectedWindow.injectedWeb3[extensionId], metadata: foundExtension });
                    }
                    else {
                        otherExtensions.push({ ...injectedWindow.injectedWeb3[extensionId], metadata: { id: extensionId, title: extensionId } });
                    }
                }
            });
        }
        else {
            console.info('no extension was detected!');
        }
        return { known: knownExtensions, other: otherExtensions };
    }
    async getWallets() {
        let injectedWallets = [];
        const { known, other } = await this.getExtensions();
        let extensions = [...known];
        if (!this.supportedOnly) {
            extensions = [...extensions, ...other];
        }
        injectedWallets = extensions.map((ext) => new InjectedWallet(ext, this.appName));
        return injectedWallets;
    }
}
//# sourceMappingURL=injectedWallets.js.map