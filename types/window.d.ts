// Type definitions for Freighter wallet
interface FreighterApi {
  connect: () => Promise<{ publicKey: string }>;
  disconnect: () => Promise<void>;
  isConnected: () => Promise<boolean>;
  getPublicKey: () => Promise<string>;
}

declare global {
  interface Window {
    freighterApi?: FreighterApi;
    freighter?: FreighterApi;
    __freighter__?: FreighterApi;
  }
}

export {};
