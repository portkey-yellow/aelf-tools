import { WalletInfo } from 'types';
import { coinbaseWallet, injected, walletConnect } from 'walletConnectors';
import { PortkeyNameVersion } from './portkey';

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
  METAMASK: {
    connector: injected,
    name: 'MetaMask',
    iconType: 'MetaMask',
    description: 'Easy-to-use browser extension.',
    href: null,
  },
  WALLET_CONNECT: {
    connector: walletConnect,
    name: 'WalletConnect',
    iconType: 'WalletConnect',
    description: 'Connect to Trust Wallet, Rainbow Wallet and more...',
    href: null,
  },
  COINBASE_WALLET: {
    connector: coinbaseWallet,
    name: 'Coinbase Wallet',
    iconType: 'coinbaseWallet',
    description: 'Use Coinbase Wallet app on mobile device',
    href: null,
  },
  NIGHT_ELF: {
    connector: 'NIGHT ELF',
    name: 'NIGHT ELF',
    iconType: 'nightElf',
    description: 'NIGHT ELF',
    href: null,
  },
  PORTKEY: {
    connector: 'PORTKEY',
    name: 'PORTKEY',
    iconType: 'portkey',
    description: 'PORTKEY',
    href: null,
    version: PortkeyNameVersion.v1,
  },
  // PORTKEY_V2: {
  //   connector: 'PORTKEY',
  //   name: 'PORTKEY_V2',
  //   iconType: 'portkey',
  //   description: 'PORTKEY',
  //   href: null,
  //   version: PortkeyNameVersion.v2,
  // },
};
