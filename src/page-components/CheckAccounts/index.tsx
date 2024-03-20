import { IBlockchainWallet } from '@portkey/types';
import { Checkbox, Divider } from 'antd';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import { useMemo } from 'react';
import { shortenString } from 'utils';

export function CheckAccounts({
  accounts,
  checkedList,
  setCheckedList,
}: {
  accounts?: IBlockchainWallet[];
  checkedList?: CheckboxValueType[];
  setCheckedList: any;
}) {
  const checkAll = useMemo(
    () => accounts && checkedList && accounts?.length === checkedList?.length,
    [accounts, checkedList],
  );
  return (
    <>
      {accounts?.length && (
        <>
          <Divider />
          <h4> Select Account</h4>
          <Checkbox
            indeterminate={accounts && checkedList && checkedList.length > 0 && checkedList.length < accounts.length}
            onChange={(e) => {
              const list = (accounts || [])?.map((i) => i.address);
              setCheckedList(e.target.checked ? list : []);
            }}
            checked={checkAll}>
            Check all
          </Checkbox>
          <br />
          <Checkbox.Group
            options={accounts?.map((i) => ({
              label: shortenString(i.address, 4, 4),
              value: i.address,
              ...i,
            }))}
            value={checkedList}
            onChange={setCheckedList}
          />
        </>
      )}
    </>
  );
}
