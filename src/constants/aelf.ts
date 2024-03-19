import { AELF_NODES } from './testnet';
import { AELF_NODES as MAIN_AELF_NODES } from './mainnet';
import { IContract } from 'hooks/web3';

export const AElfNodes = AELF_NODES;
export const AElfNodeList = [...Object.values(AElfNodes), ...Object.values(MAIN_AELF_NODES)];

export const COMMON_PRIVATE = '28805dd286a972f0ff268ba42646d5d952d770141bfec55c98e10619c268ecea';
export const CONTRACT_MAP: { [key: string]: IContract[] } = {};

AElfNodeList.forEach((node) => {
  CONTRACT_MAP[node.rpcUrl] = node.contractList;
});
