import { memo, useCallback, useState } from 'react';
import { Button, Col, Divider, Form, FormItemProps, Progress, message } from 'antd';
import clsx from 'clsx';
import cardStyles from '../Home/Card/styles.module.less';
import homeStyles from '../Home/styles.module.less';
import CommonButton from 'components/CommonButton';
import dynamic from 'next/dynamic';
import { ZERO } from 'constants/misc';
import Link from 'next/link';
import { EWELL_CONTRACT, RPC, TOKEN_CONTRACT } from 'constants/tools';
import { chunkArray, initContract } from 'utils/tools';
import { InputFormItem } from 'page-components/FormItem';
import { IContract, IBlockchainWallet } from '@portkey/types';
import { GeneratingWallet } from 'page-components/GeneratingWallet';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import { CheckAccounts } from 'page-components/CheckAccounts';
const ReactJson = dynamic(() => import('react-json-view'), { ssr: false });

const InitialValues = {
  rpcUrl: RPC,
  ewellContract: EWELL_CONTRACT,
  tokenContract: TOKEN_CONTRACT,
  projectId: 'e3a86abf674ec1e4b975df1bfd4771952f7912392318039a5cc91f497d26c76f',
};

const ItemList: FormItemProps[] = [
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
    label: 'Token Contract',
    name: 'tokenContract',
    rules: [{ required: true, message: 'Please Token Contract!' }],
  },
  {
    label: 'projectId',
    name: 'projectId',
    rules: [{ required: true, message: 'Please projectId!' }],
  },
];

async function onClaim({
  ewellContract,
  projectId,
  account,
}: {
  account: any;
  ewellContract: IContract;
  projectId: string;
}) {
  const req = await ewellContract.callSendMethod('Claim', '', {
    projectId,
    user: account.address,
  });
  if (req?.error) throw req.error;
}

function Invest() {
  const [loading, setLoading] = useState<boolean>();
  const [errorList, setErrorList] = useState<any[]>();
  const [resultCount, setResultCount] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [accounts, setAccounts] = useState<IBlockchainWallet[]>();
  const [checkedList, setCheckedList] = useState<CheckboxValueType[]>();

  const [form] = Form.useForm();

  const onFinish = useCallback(
    async (values: any) => {
      try {
        if (loading) return;
        setResultCount(0);
        setErrorList([]);
        const { ewellContract: ewell, rpcUrl, projectId } = values;
        if (!accounts?.length) return message.error('Please GeneratingWallet!');
        const _accounts = accounts.filter((i) => checkedList?.includes(i.address));
        setLoading(true);
        const errorList: { error: unknown; address: any }[] = [];
        setTotalCount(_accounts.length);
        const hide = message.loading('Claim...', 0);

        const chunkAccounts = chunkArray(_accounts, 6);

        for (let i = 0; i < chunkAccounts.length; i++) {
          const elementList = chunkAccounts[i];
          try {
            await Promise.all(
              elementList.map(async (element) => {
                const [ewellContract] = await initContract(element, rpcUrl, [ewell]);
                try {
                  await onClaim({ account: element, ewellContract, projectId });
                  console.log('1234');
                } catch (error) {
                  errorList.push({ error, address: element.address });
                } finally {
                  setResultCount((v) => v + 1);
                }
              }),
            );
          } catch (error) {
            console.log(error, '===error');
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
    [accounts, checkedList, loading],
  );

  return (
    <div className={clsx(cardStyles.card, cardStyles['from-card'], homeStyles.body)}>
      <Link href="/">Back to Home</Link>
      <Divider />
      <GeneratingWallet
        setAccounts={(acc: IBlockchainWallet[]) => {
          setAccounts(acc);
          const list = (acc || [])?.map((i) => i.address);
          setCheckedList(list);
        }}
      />
      <CheckAccounts accounts={accounts} checkedList={checkedList} setCheckedList={setCheckedList} />
      <Divider />
      <Form form={form as any} autoComplete="off" initialValues={InitialValues} onFinish={onFinish}>
        {ItemList.map((i, index) => (
          <InputFormItem key={index} {...i} />
        ))}
        <Form.Item>
          <Button disabled={loading} style={{ width: '100%' }} type="primary" htmlType="submit">
            Claim
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
