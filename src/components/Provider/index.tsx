import { ConfigProvider } from 'antd';
import { prefixCls } from 'constants/misc';
import ModalProvider from 'contexts/useModal';
import StoreProvider from 'contexts/useStore';
import Web3Provider from 'components/Web3Provider';
import WalletProvider from 'contexts/useWallet';
import AElfContractProvider from 'contexts/useAElfContract';
import ChainProvider from 'contexts/useChain';
import WhitelistProvider from 'contexts/useWhitelist';
import Modals from 'modals';
import type { ReactNode } from 'react';
import { initLanguage, useLanguage } from 'i18n';
import { ANTD_LOCAL } from 'i18n/config';
ConfigProvider.config({ prefixCls });
initLanguage(localStorage);
export default function Provider({ children }: { children: ReactNode }) {
  const { language } = useLanguage();
  return (
    <ConfigProvider autoInsertSpaceInButton={false} prefixCls={prefixCls} locale={ANTD_LOCAL[language]}>
      <ChainProvider>
        <Web3Provider>
          <WhitelistProvider>
            <StoreProvider>
              <WalletProvider>
                <AElfContractProvider>
                  <ModalProvider>
                    <Modals />
                    {children}
                  </ModalProvider>
                </AElfContractProvider>
              </WalletProvider>
            </StoreProvider>
          </WhitelistProvider>
        </Web3Provider>
      </ChainProvider>
    </ConfigProvider>
  );
}
