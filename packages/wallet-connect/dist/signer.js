import { TypeRegistry } from '@polkadot/types';
import { POLKADOT_CHAIN_ID } from './wallet-connect.js';
export class WalletConnectSigner {
    registry;
    client;
    session;
    id = 0;
    constructor(client, session) {
        this.client = client;
        this.session = session;
        this.registry = new TypeRegistry();
    }
    signPayload = async (payload) => {
        const request = {
            topic: this.session.topic,
            chainId: `polkadot:${payload.genesisHash.replace('0x', '').substring(0, 32)}`,
            request: {
                id: 1,
                jsonrpc: '2.0',
                method: 'polkadot_signTransaction',
                params: { address: payload.address, transactionPayload: payload },
            },
        };
        const { signature } = await this.client.request(request);
        return { id: ++this.id, signature };
    };
    signRaw = async (raw) => {
        const request = {
            topic: this.session.topic,
            chainId: POLKADOT_CHAIN_ID,
            request: {
                id: 1,
                jsonrpc: '2.0',
                method: 'polkadot_signMessage',
                params: { address: raw.address, message: raw.data },
            },
        };
        const { signature } = await this.client.request(request);
        return { id: ++this.id, signature };
    };
}
//# sourceMappingURL=signer.js.map