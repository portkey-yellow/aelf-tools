import CommonButton from 'components/CommonButton';
import { portkey } from '@portkey/accounts';
import styles from './styles.module.less';
import cardStyles from './Card/styles.module.less';
import { Input, message } from 'antd';
import { useState } from 'react';
import { isELFAddress, sleep } from 'utils';
import clsx from 'clsx';

const checkMnemonic = (mnemonic: string) => {
  const tmpProvider = new portkey.AccountProvider();
  (tmpProvider as any)._mnemonic = mnemonic;
  const baseWallet = tmpProvider.create().wallet;
  return isELFAddress(baseWallet.address);
};

export default function Home() {
  const [mnemonic, setMnemonic] = useState<string>();
  const [loading, setLoading] = useState<boolean>();
  const [accountList, setAccountList] = useState<{ address: string }[]>();
  return (
    <div className={clsx(cardStyles.card, cardStyles['from-card'], styles.body)}>
      <h4>mnemonic</h4>
      <Input
        onChange={(e) => {
          setMnemonic(e.target.value);
        }}
      />
      <CommonButton
        onClick={async () => {
          if (loading) return;
          if (!mnemonic) return message.error('Please enter mnemonic phrase');
          if (!checkMnemonic(mnemonic)) return message.error('Wrong mnemonic!');
          const accountProvider = new portkey.AccountProvider();
          (accountProvider as any)._mnemonic = mnemonic;
          const accountList = [];
          const hide = message.loading('Generating wallet address..', 0);
          setLoading(true);
          await sleep(500);
          for (let i = 0; i < 205; i++) {
            const wallet = accountProvider.create().wallet;
            accountList.push({
              address: wallet.address,
              BIP44Path: wallet.BIP44Path,
              privateKey: wallet.privateKey,
            });
          }
          setAccountList(accountList);
          setLoading(false);
          hide();
          message.success('Generated successfully');
        }}>
        Generating wallet
      </CommonButton>
      {!!accountList && (
        <>
          <h4>Generated successfully</h4>
          <CommonButton
            onClick={() => {
              const a = document.createElement('a');
              a.download = 'wallet.json';
              a.style.display = 'none';
              const dat = JSON.stringify(accountList, null, 4);
              const blob = new Blob([dat], { type: 'Application/json' });
              a.href = URL.createObjectURL(blob);
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
            }}>
            Download address json file
          </CommonButton>
        </>
      )}
    </div>
  );
}
