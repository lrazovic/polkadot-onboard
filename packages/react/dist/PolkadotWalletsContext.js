import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useState, useMemo, useEffect, useContext } from 'react';
const PolkadotWalletsContext = createContext({
    wallets: undefined,
});
export const useWallets = () => useContext(PolkadotWalletsContext);
export const PolkadotWalletsContextProvider = ({ children, walletAggregator, initialWaitMs = 5 /* the default is set to 5ms to give extensions enough lead time to inject their providers */, }) => {
    const [wallets, setWallets] = useState();
    useEffect(() => {
        const timeoutId = setTimeout(async () => {
            const wallets = await walletAggregator.getWallets();
            setWallets(wallets);
        }, initialWaitMs);
        return () => clearTimeout(timeoutId);
    }, [walletAggregator]);
    const contextData = useMemo(() => ({
        wallets,
    }), [wallets]);
    return _jsx(PolkadotWalletsContext.Provider, { value: contextData, children: children });
};
//# sourceMappingURL=PolkadotWalletsContext.js.map