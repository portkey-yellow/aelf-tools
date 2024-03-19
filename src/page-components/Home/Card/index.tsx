import { AutoComplete, Button, Col, Form, Input, Row, Select, message } from 'antd';
import clsx from 'clsx';
import { useWallet } from 'contexts/useWallet/hooks';
import { useHomeContext } from '../HomeContext';
import { ContractItem, setSelectAElfNode } from '../HomeContext/actions';
import styles from './styles.module.less';
import animation from './animation.module.less';
import WalletRow from './WalletRow';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { isELFAddress, sleep } from 'utils';
import { IAElfNode, useAEflConnect } from 'hooks/web3';
import { useChain } from 'contexts/useChain';
import { IPortkeyContract, getContractBasic, getContractMethods } from '@portkey/contracts';
import { aelf } from '@portkey/utils';
import CommonMessage from 'components/CommonMessage';
import { useLatestRef } from 'hooks';
import { getWallet } from 'utils/aelfUtils';
import { usePrevious } from 'react-use';
import { ChainId } from '@portkey/provider-types';
import { CONTRACT_MAP } from 'constants/aelf';
import CommonButton from 'components/CommonButton';
import { useAddContract, useAddRPCModal } from './modals';
import { MethodsItem } from './components';
interface IContractMethods {
  name: string;
  fields: { [key: string]: string };
  contract?: IPortkeyContract;
  viewContract?: IPortkeyContract;
}

export function FromCard() {
  const [{ aelfNodeList, selectedAElfNode, isPortkey, customContractMap }, { dispatch }] = useHomeContext();

  const aelfConnect = useAEflConnect();
  const [{ selectELFWallet }] = useChain();
  const { fromWallet, changing } = useWallet();
  const [filterMethod, setFilterMethod] = useState<string>();

  const [form] = Form.useForm();
  const [contractMethods, setContractMethods] = useState<{ [key: string]: IContractMethods }>();
  const [contract, setContract] = useState<IPortkeyContract>();
  const [viewContract, setViewContract] = useState<IPortkeyContract>();
  const latestFromWallet = useLatestRef(fromWallet);
  const { addRPCModal, openAddRPCModal } = useAddRPCModal();
  const { addContractModal, openAddContractModal } = useAddContract();
  const [autoCompleteKey, setAutoCompleteKey] = useState<number>(999);

  const preFromWallet = usePrevious(fromWallet);
  // connect NIGHTELF
  useEffect(() => {
    if (selectedAElfNode && selectELFWallet === 'NIGHTELF' && !preFromWallet?.isActive && fromWallet?.isActive) {
      aelfConnect(true, { [selectedAElfNode.chainId]: selectedAElfNode } as any);
    }
  }, [aelfConnect, fromWallet?.isActive, preFromWallet?.isActive, selectELFWallet, selectedAElfNode]);
  const init = useCallback(() => {
    setContractMethods({});
    setContract(undefined);
    form.setFieldsValue({ contractInput: { value: '' } });
    setAutoCompleteKey((v) => v + 1);
  }, [form]);
  const initContract = useCallback(
    async ({ n, c }: { n?: IAElfNode; c?: string } = {}) => {
      const node = n || selectedAElfNode;
      try {
        const formValue = form.getFieldsValue();
        const { contractInput } = formValue;
        const contractA = c || contractInput;
        if (!contractA) return;
        if (selectELFWallet === 'NIGHTELF' && node?.chainId) {
          const instance = (latestFromWallet.current?.aelfInstances as any)?.[node.chainId] as any;
          const contract = await getContractBasic({
            aelfInstance: instance,
            account: { address: fromWallet?.account || '' },
            contractAddress: contractA,
          });
          setContract(contract);
        } else if (isPortkey && node?.chainId) {
          const chainProvider = await fromWallet?.portkeyProvider?.getChain(node?.chainId as ChainId);
          console.log(chainProvider, '====chainProvider');
          if (!chainProvider) throw new Error('chainProvider is null');
          const contract = await getContractBasic({
            chainProvider,
            contractAddress: contractA,
          });
          setContract(contract as IPortkeyContract);
        }
      } catch (error) {
        console.log(error, '====error');
      }
    },
    [form, fromWallet, isPortkey, latestFromWallet, selectELFWallet, selectedAElfNode],
  );
  const latestInitContract = useLatestRef(initContract);

  const wallet = useMemo(() => {
    if (fromWallet?.walletType === 'PORTKEY' && selectedAElfNode && fromWallet.accounts && fromWallet.isActive) {
      return { ...fromWallet, account: fromWallet.accounts[selectedAElfNode.chainId as ChainId]?.[0] };
    }
    return fromWallet;
  }, [fromWallet, selectedAElfNode]);
  const prevAccount = usePrevious(wallet?.account);
  useEffect(() => {
    (async () => {
      if (prevAccount !== wallet?.account) {
        if (!wallet?.account) {
          setContract(undefined);
        } else {
          await sleep(1000);
          latestInitContract.current();
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet?.account, prevAccount]);

  const contractMethodList = useMemo(() => {
    let list = Object.entries(contractMethods || {});
    if (filterMethod)
      list = list.filter(([key]) => key?.toLocaleLowerCase().includes(filterMethod.toLocaleLowerCase()));
    return list;
  }, [contractMethods, filterMethod]);
  const contractList = useMemo(() => {
    if (!selectedAElfNode?.rpcUrl) return undefined;
    let list: ContractItem[] = [];
    if (CONTRACT_MAP[selectedAElfNode?.rpcUrl]) list = list.concat(CONTRACT_MAP[selectedAElfNode?.rpcUrl]);
    if (customContractMap?.[selectedAElfNode.rpcUrl]) list = list.concat(customContractMap[selectedAElfNode.rpcUrl]);
    return list
      .map((i) => ({
        value: i.address,
        label: i.name,
      }))
      .filter((value, index, self) => self.some((i) => i.value === value.value));
  }, [customContractMap, selectedAElfNode?.rpcUrl]);

  const initContractView = useCallback(
    async (value: string) => {
      const contractAddress = value;
      if (isELFAddress(contractAddress) && selectedAElfNode) {
        const hide = message.loading('Get contract in progress..', 0);
        try {
          const aelfInstance = await aelf.getAelfInstance(selectedAElfNode.rpcUrl);
          const [m, viewContract] = await Promise.all([
            getContractMethods(aelfInstance, contractAddress),
            getContractBasic({
              aelfInstance,
              account: getWallet(),
              contractAddress,
            }),
          ]);
          setViewContract(viewContract);
          setContractMethods(m);
          latestInitContract.current({ c: contractAddress });
          message.success('Load Success!!!');
        } catch (error) {
          CommonMessage.error('getContract error');
        } finally {
          hide();
        }
      } else {
        setContractMethods({});
        setContract(undefined);
      }
    },
    [latestInitContract, selectedAElfNode],
  );
  const memoAelfNodeList = useMemo(() => {
    const map: any = {};
    return aelfNodeList
      ?.map((item) => {
        if (!map[item.rpcUrl]) {
          map[item.rpcUrl] = true;
          const name = item.rpcName ? `[${item.rpcName}] ` : '';
          return {
            value: item.rpcUrl,
            label: name + item.rpcUrl,
            ...item,
          };
        }
      })
      .filter((item) => !!item);
  }, [aelfNodeList]);
  return (
    <div
      className={clsx(styles.card, styles['from-card'], {
        [animation.admin1]: changing,
      })}>
      {addRPCModal}
      {addContractModal}
      <p>
        {isPortkey && (
          <span style={{ color: 'yellowgreen' }}>
            In the case of portkey link, the portkey node shall prevail. If link custom RPC please disconnect Portkey
          </span>
        )}
      </p>
      <div>Wallet:</div>
      <WalletRow isForm aelfNode={selectedAElfNode} wallet={wallet} chainType={'ELF'} />
      <div>RPC:</div>
      <Row>
        <Col flex={1}>
          <Select
            style={{ width: '100%' }}
            placeholder="Select AELF node"
            value={selectedAElfNode?.rpcUrl}
            onChange={async (value, option: any) => {
              if (fromWallet) {
                if (selectELFWallet === 'NIGHTELF' && fromWallet.isActive) {
                  await aelfConnect(true, { [option.chainId]: option } as any);
                }
                init();
                dispatch(setSelectAElfNode(option));
              }
            }}
            options={memoAelfNodeList as any}
          />
        </Col>
        <Button disabled={isPortkey} onClick={openAddRPCModal}>
          Add RPC
        </Button>
      </Row>
      <div>Contract:</div>
      <Row>
        <Col flex={1}>
          <Form form={form}>
            <Form.Item name="contractInput">
              <AutoComplete
                allowClear
                key={autoCompleteKey}
                options={contractList}
                placeholder="Search and Select Contract"
                filterOption={(input, option) =>
                  (option?.label ?? '').toLocaleLowerCase().includes(input.toLocaleLowerCase())
                }
                onChange={(value) => initContractView(value)}
              />
            </Form.Item>
          </Form>
        </Col>
        <CommonButton onClick={openAddContractModal}>Add Contract</CommonButton>
      </Row>
      <div>Filter Methods:</div>
      <Input placeholder="Filter Contract Methods" onChange={(e) => setFilterMethod(e.target.value)} />

      {contractMethodList && contractMethodList.length
        ? contractMethodList.map(([key, value]) => {
            return (
              <MethodsItem viewContract={viewContract} contract={contract} key={key} name={key} fields={value.fields} />
            );
          })
        : null}
    </div>
  );
}
