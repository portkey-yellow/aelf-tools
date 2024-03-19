import { BasicActions } from 'contexts/utils';
import React, { createContext, useContext, useMemo } from 'react';
import { DestroyModal, DestroyState, HomeActionsEnum, HomeState } from './actions';
import { DefaultWhitelistMap } from 'constants/index';
import { AElfNodeList } from 'constants/aelf';
import useStorageReducer from 'hooks/useStorageReducer';
import storages from 'constants/storages';
import { useWallet } from 'contexts/useWallet/hooks';
import { useChain } from 'contexts/useChain';

const defaultSelectToken = {
  symbol: 'ELF',
  ...DefaultWhitelistMap.ELF,
};
const INITIAL_STATE = {
  selectToken: defaultSelectToken,
  toChecked: false,
  toAddress: '',
  aelfNodeList: AElfNodeList,
  selectedAElfNode: AElfNodeList[0],
};
const HomeContext = createContext<any>(INITIAL_STATE);
export function useHomeContext(): [HomeState, BasicActions<HomeActionsEnum>] {
  return useContext(HomeContext);
}

//reducer
function reducer(state: HomeState, { type, payload }: { type: HomeActionsEnum; payload: any }) {
  switch (type) {
    case HomeActionsEnum.destroy: {
      return {};
    }
    case HomeActionsEnum.destroyState: {
      return Object.assign({}, state, DestroyState);
    }
    case HomeActionsEnum.destroyModal: {
      return Object.assign({}, state, DestroyModal);
    }
    case HomeActionsEnum.addCustomAElfNodeList: {
      const { addCustomAElfNode } = payload;
      const { customAElfNodeList } = state;
      return Object.assign({}, state, { customAElfNodeList: [...(customAElfNodeList || []), addCustomAElfNode] });
    }
    case HomeActionsEnum.addCustomContract: {
      const { contractItem, rpcUrl } = payload;
      const { customContractMap } = state;
      console.log(customContractMap, contractItem, rpcUrl);
      const tmpCM: any = { ...customContractMap };
      if (!tmpCM[rpcUrl]) tmpCM[rpcUrl] = [];
      tmpCM[rpcUrl].push(contractItem);
      return Object.assign({}, state, { customContractMap: { ...tmpCM } });
    }
    default: {
      const { destroyModal } = payload;
      if (destroyModal) return Object.assign({}, state, DestroyModal, payload);
      return Object.assign({}, state, payload);
    }
  }
}
const options = { key: storages.homeContext };

export default function Provider({ children }: { children: React.ReactNode }) {
  const { fromWallet } = useWallet();
  const [{ selectELFWallet }] = useChain();
  const [state, dispatch]: [HomeState, BasicActions<HomeActionsEnum>['dispatch']] = useStorageReducer(
    reducer,
    INITIAL_STATE,
    options,
  );

  const actions = useMemo(() => ({ dispatch }), [dispatch]);
  const isPortkey = useMemo(
    () => !!(selectELFWallet === 'PORTKEY' && fromWallet?.accounts && fromWallet.isActive),
    [fromWallet?.accounts, fromWallet?.isActive, selectELFWallet],
  );

  const aelfNodeList = useMemo(
    () => (isPortkey ? fromWallet?.aelfNodeList : [...(state.aelfNodeList || []), ...(state.customAElfNodeList || [])]),
    [fromWallet?.aelfNodeList, isPortkey, state.aelfNodeList, state.customAElfNodeList],
  );

  const selectedAElfNode = useMemo(() => {
    if (state.selectedAElfNode && aelfNodeList?.some((i) => i.rpcUrl === state.selectedAElfNode?.rpcUrl))
      return state.selectedAElfNode;

    return aelfNodeList?.[0];
  }, [aelfNodeList, state.selectedAElfNode]);

  return (
    <HomeContext.Provider
      value={useMemo(
        () => [{ ...state, aelfNodeList, selectedAElfNode, isPortkey }, actions],
        [actions, aelfNodeList, selectedAElfNode, state, isPortkey],
      )}>
      {children}
    </HomeContext.Provider>
  );
}
