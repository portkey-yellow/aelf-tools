import { Button, Card, Col, Row } from 'antd';
import { useCallback, useMemo } from 'react';
import { injected } from '../../walletConnectors';
import { getExploreLink, shortenString } from '../../utils';
import Copy from '../../components/Copy';
import CommonLink from '../../components/CommonLink';
import { useModal } from 'contexts/useModal';
import { basicModalView } from 'contexts/useModal/actions';
import { isELFChain } from 'utils/aelfUtils';
import WalletIcon from 'components/WalletIcon';
import { SUPPORTED_WALLETS } from 'constants/wallets';
import { getConnection } from 'walletConnectors/utils';
import { useChainDispatch } from 'contexts/useChain';
import { setSelectERCWallet } from 'contexts/useChain/actions';
import { clearWCStorageByDisconnect } from 'utils/localStorage';
import { formatAddress } from 'utils/chain';
import CommonMessage from 'components/CommonMessage';

function AccountCard() {
  const [{ accountWallet, accountChainId, accountAElfNode }, { dispatch }] = useModal();
  const chainDispatch = useChainDispatch();

  const { connector, account, chainId, deactivate, aelfInstance, walletType } = accountWallet || {};
  const filter = useCallback(
    (k: string) => {
      const isMetaMask = !!window.ethereum?.isMetaMask;
      return (
        SUPPORTED_WALLETS[k].connector === connector && (connector !== injected || isMetaMask === (k === 'METAMASK'))
      );
    },
    [connector],
  );
  const connection = useMemo(() => {
    if (!connector || typeof connector === 'string') return;
    return getConnection(connector);
  }, [connector]);
  const formatConnectorName = useMemo(() => {
    const name = Object.keys(SUPPORTED_WALLETS)
      .filter((k) => filter(k))
      .map((k) => SUPPORTED_WALLETS[k].name)[0];
    return `Connected with ${name}`;
  }, [filter]);
  const onDisconnect = useCallback(async () => {
    if (typeof connector !== 'string') {
      try {
        await connection?.connector?.deactivate?.();
        await connection?.connector?.resetState?.();
      } catch (error) {
        console.log('error: ', error);
      } finally {
        chainDispatch(setSelectERCWallet(undefined));
        clearWCStorageByDisconnect();
      }
    } else {
      deactivate?.();
    }
    dispatch(
      basicModalView.setWalletModal(true, {
        walletWalletType: walletType,
        walletChainType: walletType === 'ERC' ? 'ERC' : 'ELF',
        walletChainId: chainId,
      }),
    );
  }, [connector, dispatch, walletType, chainId, connection?.connector, chainDispatch, deactivate]);

  const changeWallet = useCallback(async () => {
    try {
      return dispatch(
        basicModalView.setWalletModal(true, {
          walletWalletType: walletType,
          walletChainType: walletType === 'ERC' ? 'ERC' : 'ELF',
          walletChainId: chainId,
        }),
      );
    } catch (error: any) {
      console.debug(`connection error: ${error}`);
      CommonMessage.error(`connection error: ${error.message}`);
    }
  }, [chainId, dispatch, walletType]);
  const isELF = isELFChain(chainId);

  return (
    <>
      <p>{formatConnectorName}</p>
      <Card className="account-modal-card">
        <div className="account-modal-card-box">
          {account && <WalletIcon className="account-modal-card-box-icon" connector={connector} />}
          <div>
            <Row>
              <Col span={24}>
                <Row gutter={[8, 0]}>
                  {account ? (
                    <Col className="flex-row-center account-modal-account">
                      {shortenString(isELF ? formatAddress(accountChainId, account) : account, 8, 9)}
                    </Col>
                  ) : null}
                  {account ? (
                    <Col>
                      <Copy
                        className="account-modal-copy cursor-pointer"
                        toCopy={isELF ? formatAddress(accountChainId, account) : account}></Copy>
                    </Col>
                  ) : null}
                </Row>
              </Col>
              <Col>
                {accountChainId && account ? (
                  <CommonLink
                    showIcon={false}
                    className="account-modal-card-box-link"
                    href={getExploreLink(account, 'address', accountChainId, accountAElfNode?.exploreUrl)}>
                    {isELF ? `View on ${accountAElfNode?.exploreUrl}` : 'View on Etherscan'}
                  </CommonLink>
                ) : null}
              </Col>
            </Row>
          </div>
        </div>
      </Card>
      {aelfInstance?.connect ? null : (
        <Col span={24}>
          <Row justify="space-between" className="account-modal-button">
            <Button type="primary" onClick={onDisconnect}>
              Disconnect
            </Button>
            <Button type="primary" onClick={changeWallet}>
              Change
            </Button>
          </Row>
        </Col>
      )}
    </>
  );
}

export default AccountCard;
