export enum SupportedChainId {
  MAINNET = 1,
  GORELI = 5,
  KOVAN = 42,
  BSC_MAINNET = 56,
  BSC_TESTNET = 97,
  HECO_MAINNET = 128,
  HECO_TESTNET = 256,
  OEC_MAINNET = 66,
  OEC_TESTNET = 65,
  POLYGON_MAINNET = 137,
  POLYGON_TESTNET = 80001,
  SEPOLIA = 11155111,
}

export enum SupportedELFChainId {
  AELF = 'AELF',
  tDVV = 'tDVV',
  tDVW = 'tDVW',
}

export const CHAIN_ID_MAP = {
  [SupportedChainId.MAINNET]: 'Ethereum',
  [SupportedChainId.BSC_MAINNET]: 'BSC',
  [SupportedELFChainId.AELF]: 'MainChain_AELF',
  [SupportedELFChainId.tDVV]: 'SideChain_tDVV',
  [SupportedELFChainId.tDVW]: 'SideChain_tDVW',
  [SupportedChainId.KOVAN]: 'Kovan',
  [SupportedChainId.GORELI]: 'Goerli',
  [SupportedChainId.BSC_TESTNET]: 'BSCTest',
  [SupportedChainId.SEPOLIA]: 'Sepolia',
};

/**
 * Array of all the supported chain IDs
 */
export const ALL_SUPPORTED_CHAIN_IDS: SupportedChainId[] = Object.values(SupportedChainId).filter(
  (id) => typeof id === 'number',
) as SupportedChainId[];
