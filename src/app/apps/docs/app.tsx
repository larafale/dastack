'use client';
import { DocsApp, DocsAppProvider } from '@/components/app/docs';

const App = () => {
  return (
    <DocsAppProvider>
      <DocsApp />
    </DocsAppProvider>
  );
};

export default App;
