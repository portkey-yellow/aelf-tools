import { AElfAddress } from '@aelf-react/types';
import { Accounts, ChainIds, IPortkeyProvider, NetworkType } from '@portkey/provider-types';
import { IAElfNode } from 'hooks/web3';
import type { ReactNode, Dispatch } from 'react';
import { ChainId } from 'types';

export enum Actions {
  ACTIVATE = 'ACTIVATE',
  DEACTIVATE = 'DEACTIVATE',
  CHANGE = 'CHANGE',
}

export type PortkeyNode = {
  chainId: string;
};

/**
 * @param children - A React subtree that needs access to the context.
 * @param appName - App name.
 * @param nodes - node object. @example `nodes = {AELF: {rpcUrl:'xxx', chainId:"AELF"}, tDVV: {rpcUrl:'xxx', chainId:"tDVV"}}`.
 * @see https://github.com/mason-hz/aelf-react/blob/dev/example/src/index.tsx#:~:text=%3CPortkeyReactProvider,/PortkeyReactProvider%3E
 */
export interface PortkeyReactProviderProps {
  children: ReactNode;
  appName: string;
  nodes?: {
    [key: string]: PortkeyNode;
  };
}

export interface PortkeyContextState {
  name?: string;
  chainId?: string;
  chainIds?: ChainIds;
  account?: AElfAddress;
  accounts?: Accounts;
  provider?: IPortkeyProvider;
  nodes?: PortkeyReactProviderProps['nodes'];
  // is connected
  isActive: boolean;
  aelfNodeList?: IAElfNode[];
  networkType?: NetworkType;
}

export interface PortkeyContextType extends PortkeyContextState {
  /**
   * The activate connection can optionally pass in a new node
   * @param nodes - @see PortkeyReactProviderProps.nodes
   */
  activate: (nodes?: PortkeyReactProviderProps['nodes']) => Promise<true>;
  // deactivate connection
  deactivate: () => Promise<true>;
  // try eagerly connection
  connectEagerly: (nodes?: PortkeyReactProviderProps['nodes']) => Promise<true>;
  checkWalletConnect: (chainId: ChainId) => Promise<boolean>;
}

export type ReducerAction = {
  type: Actions;
  payload?: any;
};

export interface PortkeyContextDefine {
  state: PortkeyContextState;
  dispatch: Dispatch<ReducerAction>;
}
