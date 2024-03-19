import clsx from 'clsx';
import IconFont from 'components/IconFont';
import { SUPPORTED_WALLETS } from 'constants/wallets';
import React, { useCallback, useMemo } from 'react';
import { Web3Type } from 'types';
import { injected } from 'walletConnectors';
import styles from './styles.module.less';
export default function WalletIcon({ connector, className }: { connector: Web3Type['connector']; className?: string }) {
  const filter = useCallback(
    (k: string) => {
      const isMetaMask = !!window.ethereum?.isMetaMask;
      return (
        SUPPORTED_WALLETS[k].connector === connector && (connector !== injected || isMetaMask === (k === 'METAMASK'))
      );
    },
    [connector],
  );
  const iconType = useMemo(() => {
    return Object.keys(SUPPORTED_WALLETS)
      .filter((k) => filter(k))
      .map((k) => SUPPORTED_WALLETS[k].iconType)[0];
  }, [filter]);
  return <IconFont className={clsx(styles.icon, className)} type={iconType} />;
}
