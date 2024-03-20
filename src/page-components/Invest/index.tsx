import { memo, useCallback, useState } from 'react';
import { Button, Col, Form, FormItemProps, Input, Progress, Row, message } from 'antd';
import clsx from 'clsx';
import cardStyles from '../Home/Card/styles.module.less';
import homeStyles from '../Home/styles.module.less';
import { timesDecimals } from 'utils/calculate';
import { checkElfChainAllowanceAndApprove, checkMnemonic } from 'utils/aelfUtils';
import CommonButton from 'components/CommonButton';
import dynamic from 'next/dynamic';
import { ZERO } from 'constants/misc';
import { aes } from '@portkey/utils';
import Link from 'next/link';
import { CHILD_COUNT, EWELL_CONTRACT, MNEMONIC_KEY, RPC, TOKEN_CONTRACT } from 'constants/tools';
import { getAccounts, initContract } from 'utils/tools';
import { InputFormItem } from 'page-components/FormItem';
const ReactJson = dynamic(() => import('react-json-view'), { ssr: false });

const InitialValues = {
  rpcUrl: RPC,
  ewellContract: EWELL_CONTRACT,
  tokenContract: TOKEN_CONTRACT,
  childCount: CHILD_COUNT,
  projectId: 'e3a86abf674ec1e4b975df1bfd4771952f7912392318039a5cc91f497d26c76f',
  symbol: 'USDT',
  investAmount: timesDecimals(50, 6).toFixed(0),
};

const ItemList: FormItemProps[] = [
  {
    label: 'Mnemonic',
    name: 'mnemonic',
    rules: [{ required: true, message: 'Please Mnemonic!' }],
  },
  {
    label: 'RPC',
    name: 'rpcUrl',
    rules: [{ required: true, message: 'Please input RPC!' }],
  },
  {
    label: 'Ewell Contract',
    name: 'ewellContract',
    rules: [{ required: true, message: 'Please Ewell Contract!' }],
  },
  {
    label: 'Child Wallet Count',
    name: 'childCount',
    rules: [{ required: true, message: 'Please Child Count!' }],
  },
  {
    label: 'Token Contract',
    name: 'tokenContract',
    rules: [{ required: true, message: 'Please Token Contract!' }],
  },

  {
    label: 'projectId',
    name: 'projectId',
    rules: [{ required: true, message: 'Please projectId!' }],
  },

  {
    label: 'symbol',
    name: 'symbol',
    rules: [{ required: true, message: 'Please symbol!' }],
  },
  {
    label: 'investAmount',
    name: 'investAmount',
    rules: [{ required: true, message: 'Please investAmount!' }],
  },
];

function Invest() {
  const [pin, setPin] = useState<string>();
  const [loading, setLoading] = useState<boolean>();
  const [errorList, setErrorList] = useState<any[]>();
  const [resultCount, setResultCount] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [form] = Form.useForm();
  const onFinish = useCallback(
    async (values: any) => {
      try {
        if (loading) return;
        setResultCount(0);
        setErrorList([]);
        const {
          mnemonic,
          ewellContract: ewell,
          tokenContract: token,
          rpcUrl,
          childCount,
          projectId,
          symbol,
          investAmount,
        } = values;
        if (ZERO.plus(childCount).isNaN()) return message.error('Child Wallet Count Error!');
        if (!checkMnemonic(mnemonic)) return message.error('Wrong mnemonic!');
        const accounts = await getAccounts(mnemonic, ZERO.plus(childCount).toNumber());
        setLoading(true);
        const errorList = [];
        setTotalCount(accounts.length);
        const hide = message.loading('Invest...', 0);
        for (let i = 0; i < accounts.length; i++) {
          const element = accounts[i];
          const [ewellContract, tokenContract] = await initContract(element, ewell, token, rpcUrl);
          try {
            await checkElfChainAllowanceAndApprove({
              tokenContract,
              approveTargetAddress: ewell,
              account: element.address,
              contractUseAmount: investAmount,
              symbol,
            });
            const req = await ewellContract.callSendMethod('Invest', '', {
              projectId,
              symbol,
              investAmount,
            });
            if (req?.error) throw req.error;
          } catch (error) {
            errorList.push({ error, address: element.address });
          } finally {
            setResultCount((v) => v + 1);
          }
          setErrorList(JSON.parse(JSON.stringify(errorList)));
        }
        hide();
      } catch (error: any) {
        message.error(error?.message);
      } finally {
        setLoading(false);
      }
    },
    [loading],
  );
  return (
    <div className={clsx(cardStyles.card, cardStyles['from-card'], homeStyles.body)}>
      <Link href="/">Back to Home</Link>
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
                form.setFields([{ name: 'mnemonic', value: mnemonic }]);
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
                const mnemonic = form.getFieldValue('mnemonic');
                if (mnemonic && !checkMnemonic(mnemonic)) return message.error('Wrong mnemonic!');
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
      <Form form={form as any} autoComplete="off" initialValues={InitialValues} onFinish={onFinish}>
        {ItemList.map((i, index) => (
          <InputFormItem key={index} {...i} />
        ))}
        <Form.Item>
          <Button disabled={loading} style={{ width: '100%' }} type="primary" htmlType="submit">
            Invest
          </Button>
        </Form.Item>
      </Form>
      {loading && (
        <Col span={24} style={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
          <Progress type="circle" percent={ZERO.plus(resultCount).div(totalCount).times(100).dp(2).toNumber()} />
        </Col>
      )}
      {!!errorList?.length && (
        <>
          <CommonButton
            onClick={() => {
              const a = document.createElement('a');
              a.download = 'invest-error.json';
              a.style.display = 'none';
              const dat = JSON.stringify(errorList, null, 4);
              const blob = new Blob([dat], { type: 'Application/json' });
              a.href = URL.createObjectURL(blob);
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
            }}>
            Download error json file
          </CommonButton>
          <h3>Error</h3>
          {<ReactJson src={errorList} />}
        </>
      )}
    </div>
  );
}

export default memo(Invest);
