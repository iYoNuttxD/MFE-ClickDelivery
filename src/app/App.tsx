import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './providers/AuthProvider';
import { I18nProvider } from './providers/I18nProvider';
import { ErrorBoundary } from '@/shared/ui/components/ErrorBoundary';
import { TestRoleSwitcher } from '@/shared/ui/components/TestRoleSwitcher';
import { router } from './router';

function App() {
  return (
    <ErrorBoundary>
      <I18nProvider>
        <AuthProvider>
          <RouterProvider router={router} />
          <TestRoleSwitcher />
        </AuthProvider>
      </I18nProvider>
    </ErrorBoundary>
  );
}

export default App;
