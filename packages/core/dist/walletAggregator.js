export class WalletAggregator {
    walletProviders;
    constructor(providers) {
        this.walletProviders = providers;
    }
    async getWallets() {
        const wallets = [];
        for (const provider of this.walletProviders) {
            const providedWallets = await provider.getWallets();
            wallets.push(...providedWallets);
        }
        return wallets;
    }
}
//# sourceMappingURL=walletAggregator.js.map