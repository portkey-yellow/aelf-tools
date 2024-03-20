import { aes } from '@portkey/utils';
import { Col, Input, Row, message } from 'antd';
import CommonButton from 'components/CommonButton';
import { ZERO } from 'constants/misc';
import { CHILD_COUNT, MNEMONIC_KEY } from 'constants/tools';
import { useState } from 'react';
import { checkMnemonic } from 'utils/aelfUtils';
import { getAccounts } from 'utils/tools';

export function GeneratingWallet({ setAccounts }: { setAccounts: any }) {
  const [mnemonic, setMnemonic] = useState<string>();
  const [loading, setLoading] = useState<boolean>();
  const [pin, setPin] = useState<string>();

  return (
    <>
      <h4>Pin</h4>
      <Input
        onChange={(e) => {
          setPin(e.target.value);
        }}
      />
      <Row>
        <Col span={12}>
          <CommonButton
            onClick={() => {
              try {
                const aesMNEMONIC = localStorage.getItem(MNEMONIC_KEY);
                if (!aesMNEMONIC) return message.error('No mnemonic phrase detected');
                if (!pin) return message.error('Please enter pin');
                const mnemonic = aes.decrypt(aesMNEMONIC, pin);
                if (!(mnemonic && checkMnemonic(mnemonic))) return message.error('Wrong pin code');
                setMnemonic(mnemonic);
                message.success('load success');
              } catch (error) {
                message.error('load fail');
              }
            }}>
            load Mnemonic
          </CommonButton>
        </Col>
        <Col span={12}>
          <CommonButton
            onClick={() => {
              try {
                if (!mnemonic || !checkMnemonic(mnemonic)) return message.error('Wrong mnemonic!');
                if (!pin) return message.error('Please enter pin');
                const aesMNEMONIC = aes.encrypt(mnemonic, pin);
                if (!aesMNEMONIC) return message.error('encrypt fail');
                localStorage.setItem(MNEMONIC_KEY, aesMNEMONIC);
                message.success('save success');
              } catch (error) {
                message.error('save fail');
              }
            }}>
            save Mnemonic
          </CommonButton>
        </Col>
      </Row>
      <h4>Mnemonic</h4>

      <Input
        value={mnemonic}
        onChange={(e) => {
          setMnemonic(e.target.value);
        }}
      />
      <CommonButton
        onClick={async () => {
          try {
            if (loading) return;
            if (!mnemonic) return message.error('Please enter mnemonic phrase');
            if (!checkMnemonic(mnemonic)) return message.error('Wrong mnemonic!');
            setLoading(true);
            const accounts = await getAccounts(mnemonic, ZERO.plus(CHILD_COUNT).toNumber());
            setAccounts(accounts);
            message.success('Generated successfully');
          } catch (error) {
            console.log(error);
          } finally {
            setLoading(false);
          }
        }}>
        Generating wallet
      </CommonButton>
    </>
  );
}
