import { TypeRegistry } from '@polkadot/types';
import type { Signer, SignerResult } from '@polkadot/types/types';
import type { SignerPayloadJSON, SignerPayloadRaw } from '@polkadot/types/types';
import SignClient from '@walletconnect/sign-client';
import type { SessionTypes } from '@walletconnect/types';
export declare class WalletConnectSigner implements Signer {
    registry: TypeRegistry;
    client: SignClient;
    session: SessionTypes.Struct;
    id: number;
    constructor(client: SignClient, session: SessionTypes.Struct);
    signPayload: (payload: SignerPayloadJSON) => Promise<SignerResult>;
    signRaw: (raw: SignerPayloadRaw) => Promise<SignerResult>;
}
//# sourceMappingURL=signer.d.ts.map