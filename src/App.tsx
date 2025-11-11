import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TraditionalForm } from './components/TraditionalForm';
import { ModernForm } from './components/ModernForm';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  // Using user ID 1 for the demo (see mock-server/server.js for available users)
  const userId = '1';

  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <h1>React Forms Comparison Demo</h1>
        <p>
          This demo compares traditional useState approach vs modern React Hook
          Form + React Query approach
        </p>

        <hr />

        <div style={{ display: 'flex', gap: '40px', marginTop: '30px' }}>
          <div style={{ flex: 1, maxWidth: '500px' }}>
            <TraditionalForm userId={userId} />
          </div>

          <div style={{ flex: 1, maxWidth: '500px' }}>
            <ModernForm userId={userId} />
          </div>
        </div>

        <hr style={{ marginTop: '40px' }} />

        <div style={{ marginTop: '20px', maxWidth: '1000px' }}>
          <h3>Key Differences</h3>
          <ul>
            <li>
              <strong>State Management:</strong> Traditional approach requires
              13 separate useState hooks. Modern approach: 0 useState hooks.
            </li>
            <li>
              <strong>Data Fetching:</strong> Traditional approach needs manual
              useEffect + try/catch. Modern approach: React Query handles it
              automatically.
            </li>
            <li>
              <strong>Form Handling:</strong> Traditional approach needs
              individual onChange handlers for each field. Modern approach:
              React Hook Form's register() handles it.
            </li>
            <li>
              <strong>Dirty Tracking:</strong> Traditional approach needs manual
              useEffect to compare values. Modern approach: built-in isDirty.
            </li>
            <li>
              <strong>Reset Functionality:</strong> Traditional approach needs
              manual state updates. Modern approach: single reset() call.
            </li>
            <li>
              <strong>Code Volume:</strong> Traditional approach: ~250 lines.
              Modern approach: ~120 lines (52% reduction).
            </li>
          </ul>
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;
