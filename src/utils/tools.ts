import { portkey } from '@portkey/accounts';
import { getContractBasic } from '@portkey/contracts';
import { message } from 'antd';
import { sleep } from 'utils';

export const initContract = async (account: any, rpcUrl: string, contractList: string[]) => {
  return Promise.all(
    contractList.map((contract) =>
      getContractBasic({
        rpcUrl,
        account,
        contractAddress: contract,
      }),
    ),
  );
};

const Wallets: { [key: string]: any[] } = {};

export const getAccounts = async (mnemonic: string, childCount = 5) => {
  console.log(childCount, '====childCount');

  if (!Wallets[mnemonic] || Wallets[mnemonic].length === childCount) {
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

export function chunkArray(array: Array<any>, chunkSize = 5) {
  const result = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
}
