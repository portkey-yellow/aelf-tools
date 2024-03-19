import { Button, Form, Input, message } from 'antd';
import { useHomeContext } from '../HomeContext';
import { addCustomAElfNode, addCustomContract } from '../HomeContext/actions';
import { useMemo, useState } from 'react';
import { isELFAddress } from 'utils';
import { getContractMethods } from '@portkey/contracts';
import { aelf } from '@portkey/utils';
import CommonModal from 'components/CommonModal';
import { getWallet, isELFChain } from 'utils/aelfUtils';
import AElf from 'aelf-sdk';
import { useHomeActions } from '../HomeContext/hooks';
async function getChainInfo(rpc: string) {
  if (!rpc) throw new Error('rpc is empty');
  const instance = aelf.getAelfInstance(rpc);

  const chainStatus = await instance.chain.getChainStatus();
  const zeroC = await instance.chain.contractAt(chainStatus.GenesisContractAddress, getWallet());
  const tokenContractAddress = await zeroC.GetContractAddressByName.call(AElf.utils.sha256('AElf.ContractNames.Token'));
  if (!isELFAddress(tokenContractAddress)) throw new Error('tokenContractAddress is not ELF address');
  return { ...chainStatus, tokenContractAddress };
}

async function getContractInfo(rpc: string, contractAddress: string) {
  if (!rpc) throw new Error('rpc is empty');
  return getContractMethods(aelf.getAelfInstance(rpc), contractAddress);
}

export function useAddRPCModal() {
  const { dispatch } = useHomeActions();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  return {
    addRPCModal: useMemo(
      () => (
        <CommonModal width="auto" title="Add RPC" visible={isModalOpen} onCancel={() => setIsModalOpen(false)}>
          <Form
            onFinish={async (values) => {
              const hide = message.loading('getChainInfo in progress..', 0);
              try {
                const chainInfo = await getChainInfo(values.rpcUrl);
                if (!isELFChain(chainInfo.ChainId)) throw new Error('Not ELF chain');
                if (chainInfo) {
                  dispatch(
                    addCustomAElfNode({
                      ...chainInfo,
                      ...values,
                      chainId: chainInfo.ChainId,
                    }),
                  );

                  dispatch(
                    addCustomContract(
                      {
                        address: chainInfo.tokenContractAddress,
                        name: 'Token Contract',
                      },
                      values.rpcUrl,
                    ),
                  );

                  message.success('Add RPC success');
                  setIsModalOpen(false);
                }
              } catch (error) {
                message.error('RPC is invalid');
                console.log(error, '===error');
              } finally {
                hide();
              }
            }}>
            <Form.Item label="RPC" name="rpcUrl" rules={[{ required: true, message: 'Please input RPC!' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="exploreUrl" name="exploreUrl">
              <Input />
            </Form.Item>
            <Form.Item label="rpcName" name="rpcName">
              <Input />
            </Form.Item>
            <Form.Item>
              <Button style={{ width: '100%' }} type="primary" htmlType="submit">
                Add
              </Button>
            </Form.Item>
          </Form>
        </CommonModal>
      ),
      [dispatch, isModalOpen],
    ),
    openAddRPCModal: () => setIsModalOpen(true),
  };
}

export function useAddContract() {
  const [{ selectedAElfNode }, { dispatch }] = useHomeContext();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  return {
    addContractModal: useMemo(
      () => (
        <CommonModal width="auto" title="Add Contract" visible={isModalOpen} onCancel={() => setIsModalOpen(false)}>
          <Form
            onFinish={async (values) => {
              const hide = message.loading('getContractInfo in progress..', 0);
              try {
                if (!isELFAddress(values.contractAddress)) throw new Error('Invalid contract address');
                if (!selectedAElfNode?.rpcUrl) throw new Error('Please select a node first');
                await getContractInfo(selectedAElfNode.rpcUrl, values.contractAddress);

                dispatch(
                  addCustomContract(
                    {
                      address: values.contractAddress,
                      name: values.contractName,
                    },
                    selectedAElfNode.rpcUrl,
                  ),
                );
                message.success('Add Contract success');
                setIsModalOpen(false);
              } catch (error) {
                message.error('Contract is invalid');
                console.log(error, '===error');
              } finally {
                hide();
              }
            }}>
            <Form.Item
              label="Contract Address"
              name="contractAddress"
              rules={[{ required: true, message: 'Please input Contract Address!' }]}>
              <Input />
            </Form.Item>
            <Form.Item
              label="Contract Name"
              name="contractName"
              rules={[{ required: true, message: 'Please input Contract Name!' }]}>
              <Input />
            </Form.Item>
            <Form.Item>
              <Button style={{ width: '100%' }} type="primary" htmlType="submit">
                Add
              </Button>
            </Form.Item>
          </Form>
        </CommonModal>
      ),
      [dispatch, isModalOpen, selectedAElfNode?.rpcUrl],
    ),
    openAddContractModal: () => setIsModalOpen(true),
  };
}
