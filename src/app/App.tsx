import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './providers/AuthProvider';
import { I18nProvider } from './providers/I18nProvider';
import { ErrorBoundary } from '@/shared/ui/components/ErrorBoundary';
import { TestRoleSwitcher } from '@/shared/ui/components/TestRoleSwitcher';
import { ToastProvider } from '@/shared/ui/components/Toast';
import { router } from './router';

function App() {
  return (
    <ErrorBoundary>
      <I18nProvider>
        <AuthProvider>
          <ToastProvider>
            <RouterProvider router={router} />
            <TestRoleSwitcher />
          </ToastProvider>
        </AuthProvider>
      </I18nProvider>
    </ErrorBoundary>
  );
}

export default App;
