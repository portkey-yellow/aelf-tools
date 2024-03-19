import Head from 'next/head';
import React from 'react';
export type DefaultHeadProps = { title?: string; description?: string };

export default function PageHead(props: DefaultHeadProps) {
  return (
    <>
      <DefaultHead {...props} />
    </>
  );
}

export function DefaultHead({ title = 'ContractView', description }: DefaultHeadProps) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta
        name="viewport"
        content="width=device-width,height=device-height,inital-scale=1.0,maximum-scale=1.0,user-scalable=no;"
      />
      <meta name="description" content={description || title} />
      {/* <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" /> */}
    </Head>
  );
}
