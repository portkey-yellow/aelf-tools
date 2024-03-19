import type { AppProps } from 'next/app';
import '../styles/globals.less';
import '../styles/common.less';
import '../styles/antd.less';
import '../utils/sentry';
// import '../utils/vconsole';

import dynamic from 'next/dynamic';
import ScrollToTop from 'components/ScrollToTop';
const Provider = dynamic(import('components/Provider'), { ssr: false });
export default function APP({ Component, pageProps }: AppProps) {
  return (
    <>
      <ScrollToTop />
      <Provider>
        <div className="page-component">
          <div className="bg-body">
            <Component {...pageProps} />
          </div>
        </div>
      </Provider>
    </>
  );
}
