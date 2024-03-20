import { Form, FormItemProps, Input } from 'antd';

export function InputFormItem({ label, name, ...props }: FormItemProps) {
  return (
    <Form.Item label={label} name={name} {...props}>
      <Input />
    </Form.Item>
  );
}
