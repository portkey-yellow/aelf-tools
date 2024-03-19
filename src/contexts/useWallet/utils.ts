import { AelfInstancesKey, WalletType, Web3Type } from 'types';
import { Options } from './actions';
import { ChainId } from '@portkey/provider-types';
import { getELFAddress } from 'utils/aelfUtils';
import { isSelectPortkey } from 'utils/portkey';

export function formatPortkeyWallet(portkeyWallet: Web3Type, chainId: ChainId) {
  const chainAccounts = portkeyWallet.isActive ? portkeyWallet?.accounts?.[chainId as ChainId] : undefined;
  return {
    ...portkeyWallet,
    chainId,
    account: getELFAddress(chainAccounts?.[0]),
  };
}

export function getWalletByOptions(
  aelfWallet: Web3Type,
  web3Wallet: Web3Type,
  portkeyWallet: Web3Type,
  options?: Options,
  selectELFWallet?: WalletType,
) {
  const { chainId } = options || {};
  let wallet: any;
  if (isSelectPortkey(selectELFWallet)) {
    wallet = formatPortkeyWallet(portkeyWallet, chainId as ChainId);
  } else {
    wallet = { ...aelfWallet };
    if (chainId) {
      wallet.aelfInstance = aelfWallet.aelfInstances?.[chainId as AelfInstancesKey];
      wallet.chainId = chainId;
    }
  }
  return wallet;
}

export function isChange(stateOptions?: Options, payloadOptions?: Options) {
  const { chainType: stateType, chainId: stateChainId } = stateOptions || {};
  const { chainType, chainId, isPortkey } = payloadOptions || {};

  return (
    (isPortkey && stateType === 'ELF' && chainType === 'ELF') ||
    ((stateType === 'ERC' || chainType === 'ERC') && stateType === chainType) ||
    (stateType === 'ELF' && chainType === 'ELF' && stateChainId === chainId)
  );
}
