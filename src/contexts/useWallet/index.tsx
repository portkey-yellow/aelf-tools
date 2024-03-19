import { ACTIVE_CHAIN, DEFAULT_MODAL_INITIAL_STATE } from 'constants/index';
import storages from 'constants/storages';
import { BasicActions } from 'contexts/utils';
import useStorageReducer, { StorageOptions } from 'hooks/useStorageReducer';
import { useAElf, usePortkey, useWeb3 } from 'hooks/web3';
import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { isELFChain } from 'utils/aelfUtils';
import { WalletActions, ModalState, setToWallet, setFromWallet } from './actions';
import { getWalletByOptions, isChange } from './utils';
import { useChain } from 'contexts/useChain';
import { usePrevious } from 'react-use';
import { Web3Type } from 'types';
import { isPortkeyConnector } from 'utils/portkey';
import { SupportedELFChainId } from 'constants/chain';
import { setUserELFChainId } from 'contexts/useChain/actions';
import { Accounts } from '@portkey/provider-types';
import { useThrottleCallback } from 'hooks';

const INITIAL_STATE = DEFAULT_MODAL_INITIAL_STATE as ModalState;
const ModalContext = createContext<any>(INITIAL_STATE);

export function useWalletContext(): [ModalState, BasicActions<WalletActions>] {
  return useContext(ModalContext);
}

//reducer
function reducer(state: ModalState, { type, payload }: { type: WalletActions; payload: any }) {
  switch (type) {
    case WalletActions.destroy: {
      return {};
    }
    case WalletActions.changeWallet: {
      const { fromOptions, toOptions } = state;
      return Object.assign({}, state, { fromOptions: toOptions, toOptions: fromOptions, changing: true });
    }
    case WalletActions.changeEnd: {
      return Object.assign({}, state, { changing: false });
    }
    case WalletActions.setFromWallet: {
      const { toOptions, fromOptions } = state;
      const newState: ModalState = { ...payload };
      if (isChange(toOptions, payload.fromOptions)) newState.toOptions = fromOptions;
      return Object.assign({}, state, newState);
    }
    case WalletActions.setToWallet: {
      const { toOptions, fromOptions } = state;
      const newState: ModalState = { ...payload };
      if (isChange(fromOptions, payload.toOptions)) newState.fromOptions = toOptions;
      return Object.assign({}, state, newState);
    }
    default: {
      const { destroy } = payload;
      if (destroy) return Object.assign({}, payload);
      return Object.assign({}, state, payload);
    }
  }
}

const options: StorageOptions = {
  key: storages.useWallet + process.env.NEXT_PUBLIC_APP_ENV,
};
export default function Provider({ children }: { children: React.ReactNode }) {
  const [state, dispatch]: [ModalState, BasicActions<WalletActions>['dispatch']] = useStorageReducer(
    reducer,
    INITIAL_STATE,
    options,
  );
  const { fromOptions, toOptions } = state;
  const [{ selectELFWallet }, { dispatch: chainDispatch }] = useChain();

  const aelfWallet = useAElf();
  const web3Wallet = useWeb3();
  const portkeyWallet = usePortkey();
  const [fromWallet, toWallet]: [Web3Type, Web3Type] = useMemo(
    () => [
      getWalletByOptions(aelfWallet, web3Wallet, portkeyWallet, fromOptions, selectELFWallet),
      getWalletByOptions(aelfWallet, web3Wallet, portkeyWallet, toOptions, selectELFWallet),
    ],
    [aelfWallet, web3Wallet, portkeyWallet, fromOptions, selectELFWallet, toOptions],
  );
  const portkeyActive = useMemo(() => portkeyWallet.isActive, [portkeyWallet.isActive]);
  const prePortkeyActive = usePrevious(portkeyActive);

  const changeWallet = useThrottleCallback(() => {
    let selectWallet;
    if (isPortkeyConnector(fromWallet.connector as string) && fromWallet.isActive && !fromWallet.account) {
      selectWallet = 'from';
    } else if (isPortkeyConnector(toWallet.connector as string) && toWallet.isActive && !toWallet.account) {
      selectWallet = 'to';
    }
    if (selectWallet) {
      const isForm = selectWallet === 'from';
      const activeChainId = Object.keys(
        ((isForm ? fromWallet : toWallet) as { accounts: Accounts }).accounts,
      )[0] as SupportedELFChainId;
      if (!ACTIVE_CHAIN[activeChainId]) return;
      dispatch((isForm ? setFromWallet : setToWallet)({ chainId: activeChainId, chainType: 'ELF' }));
      chainDispatch(setUserELFChainId(activeChainId));
    }
  }, [dispatch, chainDispatch, fromWallet, toWallet]);

  useEffect(() => {
    if (portkeyActive !== prePortkeyActive && fromOptions?.chainType === toOptions?.chainType) {
      dispatch(setToWallet({ chainType: 'ERC' }));
    } else {
      changeWallet();
    }
  }, [dispatch, fromOptions?.chainType, portkeyActive, prePortkeyActive, toOptions?.chainType, changeWallet]);

  const actions = useMemo(() => ({ dispatch }), [dispatch]);
  const isHomogeneous = useMemo(
    () => isELFChain(fromWallet?.chainId) && isELFChain(toWallet?.chainId),
    [fromWallet?.chainId, toWallet?.chainId],
  );
  return (
    <ModalContext.Provider
      value={useMemo(
        () => [{ ...state, fromWallet, toWallet, isHomogeneous }, actions],
        [state, fromWallet, toWallet, isHomogeneous, actions],
      )}>
      {children}
    </ModalContext.Provider>
  );
}
