import { basicActions } from 'contexts/utils';
import { IAElfNode } from 'hooks/web3';
import type { ChainId, ChainType, WalletType, Web3Type } from 'types';

export enum ModalActions {
  setWalletModal = 'SET_WALLET_MODAL',
  setAccountModal = 'SET_ACCOUNT_MODAL',
  setNetWorkDrawer = 'SET_NETWORK_DRAWER',
  destroy = 'DESTROY',
  setPortketNotConnectModal = 'SET_PORTKEY_NOT_CONNECT_MODAL',
}

export type ModalState = {
  walletModal?: boolean;
  netWorkDrawer?: boolean;
  accountModal?: boolean;
  accountChainId?: ChainId;
  accountAElfNode?: IAElfNode;
  walletChainId?: ChainId;
  accountWallet?: Web3Type;
  walletWallet?: Web3Type;
  accountWalletType?: WalletType;
  walletWalletType?: WalletType;
  walletChainType?: ChainType;
  portketNotConnectModal?: {
    visible?: boolean;
    chainId?: ChainId;
  };
};

export const basicModalView = {
  setWalletModal: (
    walletModal: boolean,
    options?: { walletWalletType?: WalletType; walletChainType?: ChainType; walletChainId?: ChainId },
  ) => {
    let obj: any = { walletModal };
    if (walletModal) {
      obj = { ...obj, ...options };
      obj.destroy = true;
    }
    return basicActions(ModalActions['setWalletModal'], obj);
  },

  setAccountModal: (
    accountModal: boolean,
    options?: { accountWalletType?: WalletType; accountChainId?: ChainId; accountAElfNode?: IAElfNode },
  ) => {
    let obj: any = { accountModal };
    if (accountModal) {
      obj = { ...obj, ...options };
      obj.destroy = true;
    }
    return basicActions(ModalActions['setAccountModal'], obj);
  },
  setNetWorkDrawer: (netWorkDrawer: boolean) => basicActions(ModalActions['setNetWorkDrawer'], { netWorkDrawer }),
  modalDestroy: () => basicActions(ModalActions['destroy']),
  setPortketNotConnectModal: (portketNotConnectModal: { visible?: boolean; chainId?: ChainId }) =>
    basicActions(ModalActions['setPortketNotConnectModal'], { portketNotConnectModal }),
};

export const { setWalletModal, setAccountModal, setNetWorkDrawer, modalDestroy, setPortketNotConnectModal } =
  basicModalView;
