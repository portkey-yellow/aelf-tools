import { Button, Row } from 'antd';
import clsx from 'clsx';
import WalletIcon from 'components/WalletIcon';
import { setAccountModal, setWalletModal } from 'contexts/useModal/actions';
import { useModalDispatch } from 'contexts/useModal/hooks';
import { memo, useMemo } from 'react';
import { Trans } from 'react-i18next';
import { ChainType, Web3Type } from 'types';
import { shortenString } from 'utils';
import { isELFChain } from 'utils/aelfUtils';
import styles from './styles.module.less';
import { isPortkey } from 'utils/portkey';
import { formatAddress } from 'utils/chain';
import { IAElfNode } from 'hooks/web3';
import { SupportedELFChainId } from 'constants/chain';
import { useChain } from 'contexts/useChain';

function WalletRow({
  wallet,
  chainType,
  aelfNode,
}: {
  wallet?: Web3Type;
  isForm?: boolean;
  chainType?: ChainType;
  aelfNode?: IAElfNode;
}) {
  const { account, connector } = wallet || {};
  const [{ selectELFWallet }] = useChain();

  const chainId = aelfNode?.chainId as SupportedELFChainId;
  const modalDispatch = useModalDispatch();

  const renderRightBtn = useMemo(() => {
    if (account && isPortkey() && isELFChain(chainId)) {
      return null;
    }

    return (
      <>
        {account ? (
          <Row
            onClick={() =>
              modalDispatch(
                setAccountModal(true, {
                  accountWalletType: selectELFWallet,
                  accountChainId: aelfNode?.chainId as any,
                  accountAElfNode: aelfNode,
                }),
              )
            }
            className={clsx('cursor-pointer', 'flex-row-center', styles['wallet-account-row'])}>
            <WalletIcon connector={connector} className={styles['wallet-icon']} />
            <div className={styles['wallet-address']}>
              {shortenString(isELFChain(chainId) ? formatAddress(chainId, account) : account, 8, 9)}
            </div>
          </Row>
        ) : (
          <Button
            className={styles['wallet-row-btn']}
            type="primary"
            onClick={() =>
              modalDispatch(
                setWalletModal(true, {
                  walletWalletType: selectELFWallet,
                  walletChainType: chainType,
                  walletChainId: chainId,
                }),
              )
            }>
            <Trans>Connect</Trans>
          </Button>
        )}
      </>
    );
  }, [account, aelfNode, chainId, chainType, connector, modalDispatch, selectELFWallet]);

  return <Row className={styles['wallet-row']}>{renderRightBtn}</Row>;
}

export default memo(WalletRow);
