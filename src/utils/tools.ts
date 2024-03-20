import { portkey } from '@portkey/accounts';
import { getContractBasic } from '@portkey/contracts';
import { message } from 'antd';
import { sleep } from 'utils';

export const initContract = async (account: any, ewell: string, token: string, rpcUrl: string) => {
  const [ewellContract, tokenContract] = await Promise.all([
    getContractBasic({
      rpcUrl,
      account,
      contractAddress: ewell,
    }),
    getContractBasic({
      rpcUrl,
      account,
      contractAddress: token,
    }),
  ]);
  return [ewellContract, tokenContract];
};

const Wallets: { [key: string]: any[] } = {};

export const getAccounts = async (mnemonic: string, childCount = 0) => {
  if (!Wallets[mnemonic]) {
    const accountProvider = new portkey.AccountProvider();
    (accountProvider as any)._mnemonic = mnemonic;
    const accountList = [];
    const hide = message.loading('Generating wallet address..', 0);
    await sleep(500);
    for (let i = 0; i < childCount; i++) {
      const wallet = accountProvider.create().wallet;
      accountList.push(wallet);
    }
    hide();
    Wallets[mnemonic] = accountList;
  }
  return Wallets[mnemonic];
};
