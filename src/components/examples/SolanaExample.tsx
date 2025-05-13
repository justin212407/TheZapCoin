import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletButton } from '../wallet';
import { useEnergy } from '../../lib/solana/energy';
import { useBNPL } from '../../lib/solana/bnpl';
import { useMarketplace } from '../../lib/solana/marketplace';

const SolanaExample = () => {
  const { connected, publicKey } = useWallet();
  const [activeTab, setActiveTab] = useState<'energy' | 'bnpl' | 'marketplace'>('energy');
  
  // Energy hooks
  const { 
    initializeEnergySource, 
    submitEnergyReading, 
    getEnergySources,
    isLoading: energyLoading,
    error: energyError
  } = useEnergy();
  
  // BNPL hooks
  const {
    createLoan,
    repayLoan,
    getLoans,
    isLoading: bnplLoading,
    error: bnplError
  } = useBNPL();
  
  // Marketplace hooks
  const {
    createListing,
    purchaseListing,
    getListings,
    isLoading: marketplaceLoading,
    error: marketplaceError
  } = useMarketplace();
  
  // State for energy sources
  const [energySources, setEnergySources] = useState<any[]>([]);
  const [energyType, setEnergyType] = useState<string>('Solar');
  const [capacity, setCapacity] = useState<number>(5000);
  const [energyAmount, setEnergyAmount] = useState<number>(100);
  
  // State for loans
  const [loans, setLoans] = useState<any[]>([]);
  const [loanAmount, setLoanAmount] = useState<number>(1000);
  const [termDays, setTermDays] = useState<number>(30);
  const [repayAmount, setRepayAmount] = useState<number>(100);
  const [selectedLoan, setSelectedLoan] = useState<string>('');
  
  // State for marketplace
  const [listings, setListings] = useState<any[]>([]);
  const [listingAmount, setListingAmount] = useState<number>(100);
  const [pricePerToken, setPricePerToken] = useState<number>(0.01);
  const [purchaseAmount, setPurchaseAmount] = useState<number>(50);
  const [selectedListing, setSelectedListing] = useState<string>('');
  
  // Load data when connected
  useEffect(() => {
    if (connected) {
      loadData();
    }
  }, [connected, activeTab]);
  
  const loadData = async () => {
    if (activeTab === 'energy') {
      const sources = await getEnergySources();
      setEnergySources(sources);
    } else if (activeTab === 'bnpl') {
      const userLoans = await getLoans();
      setLoans(userLoans);
    } else if (activeTab === 'marketplace') {
      const marketListings = await getListings();
      setListings(marketListings);
    }
  };
  
  // Energy functions
  const handleCreateEnergySource = async () => {
    if (!connected) return;
    
    const result = await initializeEnergySource(energyType, capacity);
    if (result) {
      alert(`Energy source created: ${result.energySourceAddress}`);
      loadData();
    }
  };
  
  const handleSubmitReading = async () => {
    if (!connected) return;
    
    const result = await submitEnergyReading(energyAmount);
    if (result) {
      alert(`Energy reading submitted: ${energyAmount} kWh, earned ${result.tokensEarned} eZap tokens`);
      loadData();
    }
  };
  
  // BNPL functions
  const handleCreateLoan = async () => {
    if (!connected) return;
    
    const result = await createLoan(loanAmount, termDays);
    if (result) {
      alert(`Loan created: ${result.loanAddress}`);
      loadData();
    }
  };
  
  const handleRepayLoan = async () => {
    if (!connected || !selectedLoan) return;
    
    const result = await repayLoan(selectedLoan, repayAmount);
    if (result) {
      alert(`Loan repaid: ${repayAmount} tokens`);
      loadData();
    }
  };
  
  // Marketplace functions
  const handleCreateListing = async () => {
    if (!connected) return;
    
    const result = await createListing(listingAmount, pricePerToken);
    if (result) {
      alert(`Listing created: ${result.listingAddress}`);
      loadData();
    }
  };
  
  const handlePurchase = async () => {
    if (!connected || !selectedListing) return;
    
    const result = await purchaseListing(selectedListing, purchaseAmount);
    if (result) {
      alert(`Purchase successful: ${purchaseAmount} tokens for ${result.totalPrice} SOL`);
      loadData();
    }
  };
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Solana Integration Example</h1>
      
      <div className="mb-4">
        <WalletButton network="testnet" className="mb-2" />
        {connected && publicKey && (
          <p className="text-sm">Connected: {publicKey.toString()}</p>
        )}
      </div>
      
      {!connected ? (
        <div className="p-4 bg-yellow-100 rounded">
          <p>Please connect your wallet to use the Solana features.</p>
        </div>
      ) : (
        <>
          <div className="flex mb-4 border-b">
            <button 
              className={`px-4 py-2 ${activeTab === 'energy' ? 'border-b-2 border-blue-500' : ''}`}
              onClick={() => setActiveTab('energy')}
            >
              Energy
            </button>
            <button 
              className={`px-4 py-2 ${activeTab === 'bnpl' ? 'border-b-2 border-blue-500' : ''}`}
              onClick={() => setActiveTab('bnpl')}
            >
              BNPL
            </button>
            <button 
              className={`px-4 py-2 ${activeTab === 'marketplace' ? 'border-b-2 border-blue-500' : ''}`}
              onClick={() => setActiveTab('marketplace')}
            >
              Marketplace
            </button>
          </div>
          
          {activeTab === 'energy' && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Energy Sources</h2>
              
              {energyLoading ? (
                <p>Loading...</p>
              ) : energyError ? (
                <p className="text-red-500">{energyError}</p>
              ) : (
                <>
                  <div className="mb-4 p-4 border rounded">
                    <h3 className="font-medium mb-2">Register New Energy Source</h3>
                    <div className="flex flex-col gap-2">
                      <select 
                        value={energyType} 
                        onChange={(e) => setEnergyType(e.target.value)}
                        className="p-2 border rounded"
                      >
                        <option value="Solar">Solar</option>
                        <option value="Wind">Wind</option>
                        <option value="Hydro">Hydro</option>
                      </select>
                      <input 
                        type="number" 
                        value={capacity} 
                        onChange={(e) => setCapacity(Number(e.target.value))}
                        placeholder="Capacity (kWh)"
                        className="p-2 border rounded"
                      />
                      <button 
                        onClick={handleCreateEnergySource}
                        className="p-2 bg-blue-500 text-white rounded"
                      >
                        Register Energy Source
                      </button>
                    </div>
                  </div>
                  
                  <div className="mb-4 p-4 border rounded">
                    <h3 className="font-medium mb-2">Submit Energy Reading</h3>
                    <div className="flex flex-col gap-2">
                      <input 
                        type="number" 
                        value={energyAmount} 
                        onChange={(e) => setEnergyAmount(Number(e.target.value))}
                        placeholder="Energy Amount (kWh)"
                        className="p-2 border rounded"
                      />
                      <button 
                        onClick={handleSubmitReading}
                        className="p-2 bg-green-500 text-white rounded"
                      >
                        Submit Reading
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Your Energy Sources</h3>
                    {energySources.length === 0 ? (
                      <p>No energy sources found.</p>
                    ) : (
                      <div className="grid gap-4">
                        {energySources.map((source) => (
                          <div key={source.id} className="p-4 border rounded">
                            <p><strong>Type:</strong> {source.energyType}</p>
                            <p><strong>Capacity:</strong> {source.capacity} kWh</p>
                            <p><strong>Verified:</strong> {source.verified ? 'Yes' : 'No'}</p>
                            <p><strong>Total Energy Produced:</strong> {source.totalEnergyProduced} kWh</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
          
          {activeTab === 'bnpl' && (
            <div>
              <h2 className="text-xl font-semibold mb-2">BNPL Loans</h2>
              
              {bnplLoading ? (
                <p>Loading...</p>
              ) : bnplError ? (
                <p className="text-red-500">{bnplError}</p>
              ) : (
                <>
                  <div className="mb-4 p-4 border rounded">
                    <h3 className="font-medium mb-2">Create New Loan</h3>
                    <div className="flex flex-col gap-2">
                      <input 
                        type="number" 
                        value={loanAmount} 
                        onChange={(e) => setLoanAmount(Number(e.target.value))}
                        placeholder="Loan Amount"
                        className="p-2 border rounded"
                      />
                      <input 
                        type="number" 
                        value={termDays} 
                        onChange={(e) => setTermDays(Number(e.target.value))}
                        placeholder="Term (days)"
                        className="p-2 border rounded"
                      />
                      <button 
                        onClick={handleCreateLoan}
                        className="p-2 bg-blue-500 text-white rounded"
                      >
                        Create Loan
                      </button>
                    </div>
                  </div>
                  
                  <div className="mb-4 p-4 border rounded">
                    <h3 className="font-medium mb-2">Repay Loan</h3>
                    <div className="flex flex-col gap-2">
                      <select 
                        value={selectedLoan} 
                        onChange={(e) => setSelectedLoan(e.target.value)}
                        className="p-2 border rounded"
                      >
                        <option value="">Select a loan</option>
                        {loans.map((loan) => (
                          <option key={loan.id} value={loan.id}>
                            Loan {loan.id.slice(0, 8)}... - {loan.amount} tokens
                          </option>
                        ))}
                      </select>
                      <input 
                        type="number" 
                        value={repayAmount} 
                        onChange={(e) => setRepayAmount(Number(e.target.value))}
                        placeholder="Repay Amount"
                        className="p-2 border rounded"
                      />
                      <button 
                        onClick={handleRepayLoan}
                        disabled={!selectedLoan}
                        className="p-2 bg-green-500 text-white rounded disabled:bg-gray-300"
                      >
                        Repay Loan
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Your Loans</h3>
                    {loans.length === 0 ? (
                      <p>No loans found.</p>
                    ) : (
                      <div className="grid gap-4">
                        {loans.map((loan) => (
                          <div key={loan.id} className="p-4 border rounded">
                            <p><strong>Amount:</strong> {loan.amount} tokens</p>
                            <p><strong>Term:</strong> {loan.termDays} days</p>
                            <p><strong>Repaid:</strong> {loan.repaidAmount} tokens</p>
                            <p><strong>Status:</strong> {loan.status}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
          
          {activeTab === 'marketplace' && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Energy Marketplace</h2>
              
              {marketplaceLoading ? (
                <p>Loading...</p>
              ) : marketplaceError ? (
                <p className="text-red-500">{marketplaceError}</p>
              ) : (
                <>
                  <div className="mb-4 p-4 border rounded">
                    <h3 className="font-medium mb-2">Create New Listing</h3>
                    <div className="flex flex-col gap-2">
                      <input 
                        type="number" 
                        value={listingAmount} 
                        onChange={(e) => setListingAmount(Number(e.target.value))}
                        placeholder="Amount to Sell"
                        className="p-2 border rounded"
                      />
                      <input 
                        type="number" 
                        value={pricePerToken} 
                        onChange={(e) => setPricePerToken(Number(e.target.value))}
                        placeholder="Price per Token"
                        className="p-2 border rounded"
                      />
                      <button 
                        onClick={handleCreateListing}
                        className="p-2 bg-blue-500 text-white rounded"
                      >
                        Create Listing
                      </button>
                    </div>
                  </div>
                  
                  <div className="mb-4 p-4 border rounded">
                    <h3 className="font-medium mb-2">Purchase Tokens</h3>
                    <div className="flex flex-col gap-2">
                      <select 
                        value={selectedListing} 
                        onChange={(e) => setSelectedListing(e.target.value)}
                        className="p-2 border rounded"
                      >
                        <option value="">Select a listing</option>
                        {listings.map((listing) => (
                          <option key={listing.id} value={listing.id}>
                            {listing.amount} tokens at {listing.pricePerToken} SOL each
                          </option>
                        ))}
                      </select>
                      <input 
                        type="number" 
                        value={purchaseAmount} 
                        onChange={(e) => setPurchaseAmount(Number(e.target.value))}
                        placeholder="Amount to Purchase"
                        className="p-2 border rounded"
                      />
                      <button 
                        onClick={handlePurchase}
                        disabled={!selectedListing}
                        className="p-2 bg-green-500 text-white rounded disabled:bg-gray-300"
                      >
                        Purchase Tokens
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Available Listings</h3>
                    {listings.length === 0 ? (
                      <p>No listings found.</p>
                    ) : (
                      <div className="grid gap-4">
                        {listings.map((listing) => (
                          <div key={listing.id} className="p-4 border rounded">
                            <p><strong>Seller:</strong> {listing.seller.slice(0, 8)}...</p>
                            <p><strong>Amount:</strong> {listing.amount} tokens</p>
                            <p><strong>Price per Token:</strong> {listing.pricePerToken} SOL</p>
                            <p><strong>Total Price:</strong> {listing.totalPrice} SOL</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SolanaExample;
