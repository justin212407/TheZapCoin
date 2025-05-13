import React, { useEffect, useState } from 'react';

const Test = () => {
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string>('Loading...');

  useEffect(() => {
    try {
      // Check if document and window are defined
      if (typeof document !== 'undefined' && typeof window !== 'undefined') {
        setInfo('Document and window are defined');

        // Check if root element exists
        const rootElement = document.getElementById('root');
        if (rootElement) {
          setInfo(prev => prev + '\nRoot element exists');
        } else {
          setInfo(prev => prev + '\nRoot element does not exist');
        }

        // Check browser information
        setInfo(prev => prev + `\nUser Agent: ${navigator.userAgent}`);
      } else {
        setInfo('Document or window is not defined');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }, []);

  return (
    <div className="p-8 bg-zap-dark text-white min-h-screen">
      <h1 className="text-3xl font-bold">Debug Page</h1>

      {error ? (
        <div className="mt-4 p-4 bg-red-500 rounded">
          <h2 className="font-bold">Error:</h2>
          <pre className="mt-2 whitespace-pre-wrap">{error}</pre>
        </div>
      ) : (
        <div className="mt-4">
          <h2 className="font-bold">Environment Info:</h2>
          <pre className="mt-2 p-4 bg-gray-800 rounded whitespace-pre-wrap">{info}</pre>
        </div>
      )}

      <div className="mt-8">
        <h2 className="font-bold">Test Elements:</h2>
        <div className="mt-2 grid grid-cols-2 gap-4">
          <div className="p-4 bg-solana-purple rounded">Solana Purple</div>
          <div className="p-4 bg-solana-green rounded">Solana Green</div>
          <div className="p-4 bg-zap-dark-lighter rounded">Zap Dark Lighter</div>
          <div className="p-4 bg-zap-gray rounded">Zap Gray</div>
        </div>
      </div>
    </div>
  );
};

export default Test;
