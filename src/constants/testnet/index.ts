import * as MAINNET from '../platform/main';
import * as KOVAN from '../platform/kovan';
import * as GORELI from '../platform/goreli';
import * as AELF_Test from '../platform/AELF_Test';
import * as tDVV_Test from '../platform/tDVV_Test';
import * as tDVW_Test from '../platform/tDVW_Test';
import * as BSC_TESTNET from '../platform/BSC_Test';
import * as SEPOLIA from '../platform/sepolia';
import DefaultWhitelistMap from './tokenWhitelist.json';
import { SupportedChainId, SupportedELFChainId } from '../chain';
import { NetworkType } from 'types';
import { IconInfo } from 'types/misc';

export type ChainConstantsType =
  | typeof MAINNET
  | typeof KOVAN
  | typeof AELF_Test
  | typeof tDVV_Test
  | typeof tDVW_Test
  | typeof GORELI
  | typeof SEPOLIA
  | typeof BSC_TESTNET;

export type ERC_CHAIN_TYPE = keyof typeof SupportedERCChain;
export type ELF_CHAIN_TYPE = keyof typeof SupportedELFChain;

export const DEFAULT_ELF_CHAIN = SupportedELFChainId.AELF;
export const DEFAULT_ERC_CHAIN = SupportedChainId.SEPOLIA;

export const DEFAULT_MODAL_INITIAL_STATE = {
  fromOptions: { chainType: 'ERC', chainId: DEFAULT_ERC_CHAIN },
  toOptions: { chainType: 'ELF', chainId: DEFAULT_ELF_CHAIN },
};
export const SupportedERCChain: { [k: string | number]: ChainConstantsType } = {
  [SupportedChainId.MAINNET]: MAINNET,
  [SupportedChainId.KOVAN]: KOVAN,
  [SupportedChainId.GORELI]: GORELI,
  [SupportedChainId.BSC_TESTNET]: BSC_TESTNET,
  [SupportedChainId.SEPOLIA]: SEPOLIA,
};
export const DEFAULT_ERC_CHAIN_INFO = SupportedERCChain[DEFAULT_ERC_CHAIN].CHAIN_INFO;

export const SupportedELFChain: { [k: string | number]: ChainConstantsType } = {
  [SupportedELFChainId.AELF]: AELF_Test,
  [SupportedELFChainId.tDVW]: tDVW_Test,
  [SupportedELFChainId.tDVV]: tDVV_Test,
};

export const ACTIVE_CHAIN: any = {
  [SupportedELFChainId.AELF]: true,
  [SupportedELFChainId.tDVW]: true,
  [SupportedChainId.BSC_TESTNET]: true,
  [SupportedChainId.SEPOLIA]: true,
};
export const NATIVE_TOKEN_LIST = ['WETH', 'WBNB'];

export const CHAIN_NAME: { [chainId in SupportedChainId | SupportedELFChainId]: string } = {
  [SupportedChainId.MAINNET]: 'Ethereum',
  [SupportedChainId.KOVAN]: 'Kovan',
  [SupportedChainId.GORELI]: 'Goerli',
  [SupportedChainId.BSC_MAINNET]: 'BSC',
  [SupportedChainId.BSC_TESTNET]: 'Binance Smart Chain Testnet',
  [SupportedChainId.HECO_MAINNET]: 'HECO',
  [SupportedChainId.HECO_TESTNET]: 'HECO Testnet',
  [SupportedChainId.OEC_MAINNET]: 'OEC',
  [SupportedChainId.OEC_TESTNET]: 'OEC Testnet',
  [SupportedChainId.POLYGON_MAINNET]: 'Polygon',
  [SupportedChainId.POLYGON_TESTNET]: 'Polygon Testnet',
  [SupportedELFChainId.AELF]: 'MainChain AELF Testnet',
  [SupportedELFChainId.tDVV]: 'SideChain tDVV Testnet',
  [SupportedELFChainId.tDVW]: 'SideChain tDVW Testnet',
  [SupportedChainId.SEPOLIA]: 'Sepolia Testnet',
};

export const CHAIN_ICON: { [chainId in SupportedChainId | SupportedELFChainId]: IconInfo } = {
  [SupportedChainId.MAINNET]: {
    type: 'Ethereum',
  },
  [SupportedChainId.KOVAN]: {
    type: 'Ethereum',
  },
  [SupportedChainId.GORELI]: {
    type: 'Ethereum',
  },
  [SupportedChainId.BSC_MAINNET]: {
    type: 'Binance',
  },
  [SupportedChainId.BSC_TESTNET]: {
    type: 'Binance',
  },
  [SupportedChainId.HECO_MAINNET]: {
    type: 'Binance',
  },
  [SupportedChainId.HECO_TESTNET]: {
    type: 'Binance',
  },
  [SupportedChainId.OEC_MAINNET]: {
    type: 'Binance',
  },
  [SupportedChainId.OEC_TESTNET]: {
    type: 'Binance',
  },
  [SupportedChainId.POLYGON_MAINNET]: {
    type: 'Binance',
  },
  [SupportedChainId.POLYGON_TESTNET]: {
    type: 'Binance',
  },
  [SupportedELFChainId.AELF]: {
    type: 'aelfTestnet',
  },
  [SupportedELFChainId.tDVV]: {
    type: 'aelfTestnet',
  },
  [SupportedELFChainId.tDVW]: {
    type: 'aelfTestnet',
  },
  [SupportedChainId.SEPOLIA]: {
    // type: 'SEPOLIA',
    type: 'Ethereum',
  },
};

export const NetworkList = [
  { title: CHAIN_NAME[SupportedChainId.SEPOLIA], icon: CHAIN_ICON[SupportedChainId.SEPOLIA], info: SEPOLIA.CHAIN_INFO },
  // { title: CHAIN_NAME[SupportedChainId.GORELI], icon: CHAIN_ICON[SupportedChainId.GORELI], info: GORELI.CHAIN_INFO },
  // { title: CHAIN_NAME[SupportedChainId.KOVAN], icon: CHAIN_ICON[SupportedChainId.KOVAN], info: KOVAN.CHAIN_INFO },
  {
    title: CHAIN_NAME[SupportedELFChainId.AELF],
    icon: CHAIN_ICON[SupportedELFChainId.AELF],
    info: AELF_Test.CHAIN_INFO,
  },
  // { title: CHAIN_NAME[SupportedELFChainId.tDVV], icon: CHAIN_ICON[SupportedELFChainId.tDVV], info: tDVV.CHAIN_INFO },
  {
    title: CHAIN_NAME[SupportedELFChainId.tDVW],
    icon: CHAIN_ICON[SupportedELFChainId.tDVW],
    info: tDVW_Test.CHAIN_INFO,
  },
  {
    title: CHAIN_NAME[SupportedChainId.BSC_TESTNET],
    icon: CHAIN_ICON[SupportedChainId.BSC_TESTNET],
    info: BSC_TESTNET.CHAIN_INFO,
  },
] as unknown as NetworkType[];

export const AELF_NODES = {
  AELF: AELF_Test.CHAIN_INFO,
  tDVW: tDVW_Test.CHAIN_INFO,
};

export { DefaultWhitelistMap };

export const FormatTokenList = [
  {
    fromChainId: [SupportedChainId.BSC_TESTNET],
    toChainId: [SupportedELFChainId.AELF, SupportedELFChainId.tDVV, SupportedELFChainId.tDVW],
    fromSymbol: 'WBNB',
    toSymbol: 'BNB',
  },
  {
    fromChainId: [SupportedChainId.SEPOLIA],
    toChainId: [SupportedELFChainId.AELF, SupportedELFChainId.tDVV, SupportedELFChainId.tDVW],
    fromSymbol: 'WETH',
    toSymbol: 'ETH',
  },
];

export const CrossChainTimeList = [
  {
    fromChainId: [SupportedELFChainId.AELF, SupportedELFChainId.tDVV, SupportedELFChainId.tDVW],
    toChainId: [SupportedELFChainId.AELF, SupportedELFChainId.tDVV, SupportedELFChainId.tDVW],
    time: '4',
  },
  {
    fromChainId: SupportedChainId.BSC_TESTNET,
    toChainId: [SupportedELFChainId.AELF, SupportedELFChainId.tDVV, SupportedELFChainId.tDVW],
    time: '10',
  },
  {
    fromChainId: [SupportedELFChainId.AELF, SupportedELFChainId.tDVV, SupportedELFChainId.tDVW],
    toChainId: SupportedChainId.BSC_TESTNET,
    time: '10',
  },
  {
    fromChainId: SupportedChainId.SEPOLIA,
    toChainId: [SupportedELFChainId.AELF, SupportedELFChainId.tDVV, SupportedELFChainId.tDVW],
    time: '40',
  },
  {
    fromChainId: [SupportedELFChainId.AELF, SupportedELFChainId.tDVV, SupportedELFChainId.tDVW],
    toChainId: SupportedChainId.SEPOLIA,
    time: '40',
  },
];

export const PORTKEY_NETWORK_TYPE = 'TESTNET';
