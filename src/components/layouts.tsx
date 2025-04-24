import { PropsWithChildren } from 'react';

import { Footer } from '@/app/footer';
import { Header } from '@/app/header';
import { PageContainer } from '@/components/page-components';


export const RawLayout = ({ children }: PropsWithChildren) => {
  return (<>{children}</>);
};

export const AppLayout = ({ children }: PropsWithChildren) => {
  return (<>
    <Header />
    <PageContainer>
      <main className="flex flex-col flex-1">{children}</main>
      <Footer />
    </PageContainer>
  </>
  );
};
