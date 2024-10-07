import { WalletType } from '@polkadot-onboard/core';
import { WalletConnectModal } from '@walletconnect/modal';
import { SignClient } from '@walletconnect/sign-client';
import { WalletConnectSigner } from './signer.js';
export const POLKADOT_CHAIN_ID = 'polkadot:91b171bb158e2d3848fa23a9f1c25182';
export const WC_VERSION = '2.0';
const toWalletAccount = (wcAccount) => ({ address: wcAccount.split(':')[2] });
class WalletConnectWallet {
    type = WalletType.WALLET_CONNECT;
    appName;
    metadata;
    config;
    client;
    signer;
    session;
    walletConnectModal;
    constructor(config, appName) {
        if (!config.chainIds || config.chainIds.length === 0)
            config.chainIds = [POLKADOT_CHAIN_ID];
        this.config = config;
        this.appName = appName;
        this.metadata = {
            id: 'wallet-connect',
            title: config.metadata?.name || 'Wallet Connect',
            description: config.metadata?.description || '',
            urls: { main: config.metadata?.url || '' },
            iconUrl: config.metadata?.icons[0] || '',
            version: WC_VERSION,
        };
        this.walletConnectModal = new WalletConnectModal({
            projectId: config.projectId,
            chains: config.chainIds,
            ...config.options,
        });
    }
    reset() {
        this.client = undefined;
        this.session = undefined;
        this.signer = undefined;
    }
    async getAccounts() {
        let accounts = [];
        if (this.session) {
            const wcAccounts = Object.values(this.session.namespaces)
                .map((namespace) => namespace.accounts)
                .flat();
            accounts = wcAccounts.map((wcAccount) => toWalletAccount(wcAccount));
        }
        return accounts;
    }
    async subscribeAccounts(cb) {
        const handler = async () => {
            cb(await this.getAccounts());
        };
        await handler();
        this.client?.on('session_delete', handler);
        this.client?.on('session_expire', handler);
        this.client?.on('session_update', handler);
        return () => {
            this.client?.off('session_update', handler);
            this.client?.off('session_expire', handler);
            this.client?.off('session_update', handler);
        };
    }
    async connect() {
        this.reset();
        this.client = await SignClient.init(this.config);
        this.client.on('session_delete', () => {
            this.reset();
            if (this.config.onSessionDelete) {
                this.config.onSessionDelete();
            }
        });
        const namespaces = {
            requiredNamespaces: {
                polkadot: {
                    chains: this.config.chainIds,
                    methods: ['polkadot_signTransaction', 'polkadot_signMessage'],
                    events: [],
                },
            },
            optionalNamespaces: {
                polkadot: {
                    chains: this.config.optionalChainIds,
                    methods: ['polkadot_signTransaction', 'polkadot_signMessage'],
                    events: [],
                },
            },
        };
        const lastKeyIndex = this.client.session.getAll().length - 1;
        const lastSession = this.client.session.getAll()[lastKeyIndex];
        if (lastSession) {
            return new Promise((resolve) => {
                this.session = lastSession;
                this.signer = new WalletConnectSigner(this.client, lastSession);
                resolve();
            });
        }
        const { uri, approval } = await this.client.connect(namespaces);
        return new Promise((resolve, reject) => {
            if (uri) {
                this.walletConnectModal.openModal({ uri });
            }
            const unsubscribeModal = this.walletConnectModal.subscribeModal((state) => {
                if (state.open === false) {
                    unsubscribeModal();
                    resolve();
                }
            });
            approval()
                .then((session) => {
                this.session = session;
                this.signer = new WalletConnectSigner(this.client, session);
                resolve();
            })
                .catch((error) => {
                reject(error);
            })
                .finally(() => this.walletConnectModal.closeModal());
        });
    }
    async disconnect() {
        if (this.session?.topic) {
            this.client?.disconnect({
                topic: this.session?.topic,
                reason: {
                    code: -1,
                    message: 'Disconnected by client!',
                },
            });
        }
        this.reset();
    }
    isConnected() {
        return !!(this.client && this.signer && this.session);
    }
}
export class WalletConnectProvider {
    config;
    appName;
    constructor(config, appName) {
        this.config = config;
        this.appName = appName;
    }
    getWallets() {
        return new Promise((resolve) => resolve([new WalletConnectWallet(this.config, this.appName)]));
    }
}
//# sourceMappingURL=wallet-connect.js.map