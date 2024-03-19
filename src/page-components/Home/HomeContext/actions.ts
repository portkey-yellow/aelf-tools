import { basicActions } from 'contexts/utils';
import { CurrentWhitelistItem } from 'hooks/whitelist';
import { CrossChainItem } from 'types/api';
import BigNumber from 'bignumber.js';
import { TokenInfo } from 'types';
import { IAElfNode } from 'hooks/web3';

export enum HomeActionsEnum {
  setSelectModal = 'SET_SELECT_TOKEN_MODAL',
  setAddModal = 'SET_ACCOUNT_MODAL',
  setNetWorkDrawer = 'SET_NETWORK_DRAWER',
  setSelectToken = 'SET_SELECT_TOKEN',
  setFrom = 'SET_FROM',
  setTo = 'SET_TO',
  setToChecked = 'SET_TO_CHECKED',
  setToAddress = 'SET_TO_ADDRESS',
  setReceiveList = 'SET_RECEIVE_LIST',
  setReceiveId = 'SET_RECEIVE_ID',
  setActionLoading = 'SET_ACTION_LOADING',
  destroy = 'DESTROY',
  default = 'DEFAULT',
  destroyModal = 'DESTROY_MODAL',
  destroyState = 'DESTROY_STATE',
  setLimitAmountModal = 'SET_LIMIT_AMOUNT_MODAL',
  setLimitAmountDescModal = 'SET_LIMIT_AMOUNT_DESC_MODAL',
  addCustomAElfNodeList = 'addCustomAElfNodeList',
  addCustomContract = 'addCustomContract',
}

export type ContractItem = { address: string; name: string };

export type HomeState = {
  selectModal?: boolean;
  addModal?: boolean;
  selectToken?: CurrentWhitelistItem;
  fromInput?: string;
  toInput?: string;
  toChecked?: boolean;
  toAddress?: string;
  receiveList?: CrossChainItem[];
  receiveId?: string;
  receiveItem?: CrossChainItem;
  fromBalance?: { balance: BigNumber; show: BigNumber; token: TokenInfo };
  actionLoading?: boolean;
  crossMin?: number;
  crossFee?: string;
  limitAmountModal?: boolean;
  limitAmountDescModal?: boolean;
  aelfNodeList?: (IAElfNode & { rpcName?: string })[];
  customAElfNodeList?: IAElfNode[];
  selectedAElfNode?: IAElfNode;
  isPortkey?: boolean;
  customContractMap?: { [key: string]: ContractItem[] };
};

export const DestroyModal = {
  selectModal: undefined,
  addModal: undefined,
};
export const DestroyState = {
  selectModal: undefined,
  addModal: undefined,
  fromInput: '',
  toInput: '',
  receiveList: undefined,
  receiveId: undefined,
  receiveItem: undefined,
  actionLoading: undefined,
};

export const HomeActions = {
  setSelectModal: (selectModal: boolean) => {
    const obj: any = { selectModal };
    if (selectModal) {
      obj.destroyModal = true;
    }
    return basicActions(HomeActionsEnum['setSelectModal'], obj);
  },
  setAddModal: (addModal: boolean) => {
    const obj: any = { addModal };
    if (addModal) {
      obj.destroyModal = true;
    }
    return basicActions(HomeActionsEnum['setAddModal'], obj);
  },
  setSelectToken: (selectToken?: CurrentWhitelistItem) =>
    basicActions(HomeActionsEnum['setSelectToken'], { selectToken }),
  homeModalDestroy: () => basicActions(HomeActionsEnum['destroyModal']),
  homeStateDestroy: () => basicActions(HomeActionsEnum['destroyState']),
  setFrom: (input: string) => basicActions(HomeActionsEnum['setFrom'], { fromInput: input }),
  setTo: (input: string) => basicActions(HomeActionsEnum['setTo'], { toInput: input }),
  setToChecked: (checked: boolean) => basicActions(HomeActionsEnum['setToChecked'], { toChecked: checked }),
  setToAddress: (address: string) => basicActions(HomeActionsEnum['setToAddress'], { toAddress: address }),
  setActionLoading: (actionLoading?: boolean) => basicActions(HomeActionsEnum['setActionLoading'], { actionLoading }),
  setReceiveList: (receiveList: CrossChainItem[]) => basicActions(HomeActionsEnum['setReceiveList'], { receiveList }),
  setReceiveId: (receiveId?: string) => basicActions(HomeActionsEnum['setReceiveId'], { receiveId }),
  setHomeState: (state: HomeState) => basicActions(HomeActionsEnum['default'], state),
  homeDestroy: () => basicActions(HomeActionsEnum['destroy']),
  setLimitAmountModal: (limitAmountModal: boolean) =>
    basicActions(HomeActionsEnum['setLimitAmountModal'], { limitAmountModal }),
  setLimitAmountDescModal: (limitAmountDescModal: boolean) =>
    basicActions(HomeActionsEnum['setLimitAmountDescModal'], { limitAmountDescModal }),
  setSelectAElfNode: (selectedAElfNode: IAElfNode) =>
    basicActions(HomeActionsEnum['setLimitAmountDescModal'], { selectedAElfNode }),

  addCustomAElfNode: (addCustomAElfNode: IAElfNode) =>
    basicActions(HomeActionsEnum['addCustomAElfNodeList'], { addCustomAElfNode }),

  addCustomContract: (contractItem: ContractItem, rpcUrl: string) =>
    basicActions(HomeActionsEnum['addCustomContract'], { contractItem, rpcUrl }),
};

export const {
  setActionLoading,
  setReceiveId,
  setReceiveList,
  setTo,
  setToChecked,
  setToAddress,
  setFrom,
  setSelectModal,
  setSelectToken,
  homeModalDestroy,
  setAddModal,
  homeDestroy,
  setHomeState,
  setLimitAmountModal,
  setLimitAmountDescModal,
  setSelectAElfNode,
  addCustomAElfNode,
  addCustomContract,
} = HomeActions;
