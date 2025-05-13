// Import polyfills first
console.log('[MAIN] Starting to load polyfills...');
import './polyfills'
console.log('[MAIN] Polyfills imported');

// Import React and related libraries
console.log('[MAIN] Starting to import React and related libraries...');
import { createRoot } from 'react-dom/client'
import React from 'react'
console.log('[MAIN] React and related libraries imported successfully');

// Import application components
console.log('[MAIN] Starting to import application components...');
import App from './App.tsx'
import './index.css'
import { SolanaWalletProvider } from './components/wallet'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
console.log('[MAIN] Application components imported successfully');

// Simple fallback component in case of errors
const ErrorFallback = ({ error }: { error: Error }) => {
  return (
    <div style={{
      padding: '2rem',
      maxWidth: '800px',
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif',
      color: 'white',
      backgroundColor: '#0F1116',
      minHeight: '100vh'
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#FF5555' }}>
        Something went wrong
      </h1>
      <div style={{
        marginTop: '1rem',
        padding: '1rem',
        backgroundColor: '#1A1D24',
        borderRadius: '0.5rem',
        overflow: 'auto'
      }}>
        <p style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>Error:</p>
        <pre style={{ whiteSpace: 'pre-wrap' }}>{error.message}</pre>
        <p style={{ marginTop: '1rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>Stack:</p>
        <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.8rem' }}>{error.stack}</pre>
      </div>
      <button
        onClick={() => window.location.reload()}
        style={{
          marginTop: '1rem',
          padding: '0.5rem 1rem',
          backgroundColor: '#9945FF',
          border: 'none',
          borderRadius: '0.25rem',
          color: 'white',
          cursor: 'pointer'
        }}
      >
        Reload Page
      </button>
    </div>
  );
};

// Error boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

// Initialize the application with error handling
console.log('[MAIN] Starting to initialize the application...');

const rootElement = document.getElementById("root");
console.log('[MAIN] Root element found:', rootElement ? 'Yes' : 'No');

if (rootElement) {
  try {
    console.log('[MAIN] Creating root...');
    const root = createRoot(rootElement);
    console.log('[MAIN] Root created successfully');

    console.log('[MAIN] Starting to render the application...');
    root.render(
      <React.StrictMode>
        <ErrorBoundary>
          <SolanaWalletProvider network={WalletAdapterNetwork.Testnet}>
            <App />
          </SolanaWalletProvider>
        </ErrorBoundary>
      </React.StrictMode>
    );

    console.log("[MAIN] Application rendered successfully");
  } catch (error) {
    console.error("[MAIN] Error rendering the application:", error);

    // Log more details about the error
    if (error instanceof Error) {
      console.error("[MAIN] Error name:", error.name);
      console.error("[MAIN] Error message:", error.message);
      console.error("[MAIN] Error stack:", error.stack);
    } else {
      console.error("[MAIN] Unknown error type:", typeof error);
    }

    // Fallback rendering in case of critical error
    try {
      console.log("[MAIN] Attempting fallback rendering...");
      if (error instanceof Error) {
        createRoot(rootElement).render(<ErrorFallback error={error} />);
        console.log("[MAIN] Fallback rendering with error details successful");
      } else {
        createRoot(rootElement).render(
          <div style={{ padding: '2rem', color: 'white', backgroundColor: '#0F1116' }}>
            <h1>Critical Error</h1>
            <p>An unknown error occurred while initializing the application.</p>
            <pre>{JSON.stringify(error, null, 2)}</pre>
          </div>
        );
        console.log("[MAIN] Fallback rendering with generic error successful");
      }
    } catch (fallbackError) {
      console.error("[MAIN] Error during fallback rendering:", fallbackError);
    }
  }
} else {
  console.error("[MAIN] Root element not found");
}
