import { Button, Col, Collapse, Form, Input, Row, message } from 'antd';
import { useState } from 'react';
import { IPortkeyContract } from '@portkey/contracts';
import dynamic from 'next/dynamic';
import { handleParamsOption } from './utils';
const ReactJson = dynamic(() => import('react-json-view'), { ssr: false });

interface IContractMethods {
  name: string;
  fields: { [key: string]: string };
  contract?: IPortkeyContract;
  viewContract?: IPortkeyContract;
}

export function MethodsItem({ name, fields, contract, viewContract }: IContractMethods) {
  const [form] = Form.useForm();
  const [data, setData] = useState();
  return (
    <Collapse key={name}>
      <Collapse.Panel header={name} key={name}>
        <Form form={form} name={name}>
          {fields
            ? Object.entries(fields).map(([k]) => {
                return (
                  <Form.Item key={k} name={k} label={k}>
                    <Input />
                  </Form.Item>
                );
              })
            : null}
          <Form.Item>
            <Row>
              <Col span={4}>
                <Button
                  type="primary"
                  htmlType="submit"
                  onClick={async () => {
                    const c = viewContract;
                    const hide = message.loading('callViewMethod in progress..', 0);
                    try {
                      const value = form.getFieldsValue();
                      const req = await c?.callViewMethod(name, handleParamsOption(value));
                      if (req?.data && !req?.data?.error) {
                        message.success('callViewMethod Success!!!');
                      }
                      setData(req?.data || req);
                    } catch (err: any) {
                      setData(err);
                      message.error(err.message);
                    } finally {
                      hide();
                    }
                  }}>
                  View
                </Button>
              </Col>
              <Col span={4}>
                <Button
                  htmlType="submit"
                  type="primary"
                  key="123"
                  disabled={!contract}
                  onClick={async () => {
                    const hide = message.loading('callSendMethod in progress..', 0);
                    try {
                      const value = form.getFieldsValue();
                      const req = await contract?.callSendMethod(name, '', handleParamsOption(value), {
                        onMethod: 'receipt',
                      });
                      if (req?.data && !req?.data?.error) {
                        message.success('callSendMethod Success!!!');
                      }
                      if (req?.error?.message) {
                        req.error = { message: req?.error?.message };
                      }
                      setData(req?.data || req);
                    } catch (err: any) {
                      setData(err);
                      message.error(err.message || err.error?.message);
                    } finally {
                      hide();
                    }
                  }}>
                  Send
                </Button>
              </Col>
            </Row>
          </Form.Item>
        </Form>
        {data ? (
          <div style={{ overflow: 'scroll' }}>
            {typeof data === 'object' ? <ReactJson src={data} /> : <div>{data}</div>}
          </div>
        ) : null}
      </Collapse.Panel>
    </Collapse>
  );
}
