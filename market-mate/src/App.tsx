import Wip from '@core/components/wip';
import {lazy, Suspense, useEffect} from 'react';
import {IntlProvider, MissingTranslationError} from 'react-intl';
import {BrowserRouter, Link, Route, Routes} from 'react-router';
import CustomProvider from 'rsuite/CustomProvider';

const DesignSystem = lazy(() => import('./pages/design-system.tsx'));

function onIntlError(error: unknown) {
  if (error instanceof MissingTranslationError) {
    return;
  }
  console.error(error);
}

function Home() {
  useEffect(() => {
    document.documentElement.classList.add('landing-page');
    return () => document.documentElement.classList.remove('landing-page');
  }, []);

  return (
    <main className="market-mate-home">
      <Wip />
      <p className="market-mate-intro">
        <Link to="/~design-system">Design system</Link>
      </p>
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <IntlProvider locale="en" defaultLocale="en" messages={{}} onError={onIntlError}>
        <CustomProvider disableInlineStyles>
          <Suspense fallback={null}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/~design-system/:tab?" element={<DesignSystem />} />
            </Routes>
          </Suspense>
        </CustomProvider>
      </IntlProvider>
    </BrowserRouter>
  );
}

export default App;
