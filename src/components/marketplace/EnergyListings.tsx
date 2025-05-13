
import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Zap, ShieldCheck, AlertCircle } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useMarketplace } from '@/lib/solana/marketplace';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

interface EnergyListingsProps {
  isLoading: boolean;
}

const EnergyListings: React.FC<EnergyListingsProps> = ({ isLoading: externalLoading }) => {
  const [filter, setFilter] = useState("all");
  const { connected } = useWallet();
  const { toast } = useToast();

  // Marketplace hooks
  const {
    createListing,
    purchaseListing,
    getListings,
    isLoading: marketplaceLoading,
    error: marketplaceError
  } = useMarketplace();

  // State for marketplace
  const [listings, setListings] = useState<any[]>([]);
  const [listingAmount, setListingAmount] = useState<number>(100);
  const [pricePerToken, setPricePerToken] = useState<number>(0.01);
  const [purchaseAmount, setPurchaseAmount] = useState<number>(50);
  const [selectedListing, setSelectedListing] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPurchaseDialogOpen, setIsPurchaseDialogOpen] = useState(false);

  // Load listings when component mounts
  useEffect(() => {
    loadListings();
  }, [connected]);

  const loadListings = async () => {
    const marketListings = await getListings();
    setListings(marketListings);
  };

  // Marketplace functions
  const handleCreateListing = async () => {
    if (!connected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to create a listing",
        variant: "destructive"
      });
      return;
    }

    try {
      const result = await createListing(listingAmount, pricePerToken);
      if (result) {
        toast({
          title: "Listing created",
          description: `Successfully created listing for ${listingAmount} tokens`,
        });
        loadListings();
        setIsDialogOpen(false);
      }
    } catch (error) {
      toast({
        title: "Error creating listing",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive"
      });
    }
  };

  const handlePurchase = async () => {
    if (!connected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to purchase tokens",
        variant: "destructive"
      });
      return;
    }

    if (!selectedListing) {
      toast({
        title: "No listing selected",
        description: "Please select a listing to purchase",
        variant: "destructive"
      });
      return;
    }

    try {
      // Find the selected listing to get its price
      const listing = listings.find(l => l.id === selectedListing);
      if (!listing) {
        toast({
          title: "Listing not found",
          description: "The selected listing could not be found",
          variant: "destructive"
        });
        return;
      }

      // Calculate the expected total price
      const expectedTotal = purchaseAmount * listing.pricePerToken;

      console.log(`Purchasing ${purchaseAmount} tokens at ${listing.pricePerToken} SOL each`);
      console.log(`Expected total: ${expectedTotal} SOL`);

      const result = await purchaseListing(selectedListing, purchaseAmount);

      if (result && result.success) {
        toast({
          title: "Purchase successful",
          description: `Successfully purchased ${purchaseAmount} tokens for ${result.totalPrice.toFixed(4)} SOL`,
        });
        loadListings();
        setIsPurchaseDialogOpen(false);
      } else {
        throw new Error("Purchase failed");
      }
    } catch (error) {
      toast({
        title: "Error purchasing tokens",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive"
      });
    }
  };

  const renderEmptyState = () => (
    <motion.div
      className="flex flex-col items-center justify-center bg-zap-dark-lighter/50 rounded-lg p-10 border border-white/5 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="mb-4 p-4 rounded-full bg-zap-dark-lighter">
        <Zap size={32} className="text-solana-purple" />
      </div>
      <h3 className="text-xl font-medium mb-2">No energy listings yet</h3>
      <p className="text-white/60 max-w-md">
        Yours could be the first. Connect your solar panels and start earning today.
      </p>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="mt-6 bg-solana-purple hover:bg-solana-purple/80">
            Become a Seller
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-zap-dark-lighter border border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Create Energy Listing</DialogTitle>
            <DialogDescription className="text-white/60">
              List your energy credits for sale on the marketplace.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Amount
              </Label>
              <Input
                id="amount"
                type="number"
                value={listingAmount}
                onChange={(e) => setListingAmount(Number(e.target.value))}
                className="col-span-3 bg-zap-dark border-white/10"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Price per Token
              </Label>
              <Input
                id="price"
                type="number"
                value={pricePerToken}
                onChange={(e) => setPricePerToken(Number(e.target.value))}
                className="col-span-3 bg-zap-dark border-white/10"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleCreateListing}
              className="bg-solana-green hover:bg-solana-green/80 text-black"
            >
              Create Listing
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );

  const isLoading = externalLoading || marketplaceLoading;

  return (
    <Card className="overflow-hidden border border-white/10 bg-card-gradient">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">Energy Credit Listings</CardTitle>
        <div className="flex items-center gap-2">
          <Select defaultValue="all" onValueChange={setFilter}>
            <SelectTrigger className="w-[180px] bg-zap-dark-lighter border-white/10">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent className="bg-zap-dark-lighter border-white/10">
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="verified">Verified Only</SelectItem>
              <SelectItem value="pools">Pools</SelectItem>
            </SelectContent>
          </Select>
          {connected && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-solana-green/50 text-solana-green hover:bg-solana-green/20">
                  Sell Energy
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-zap-dark-lighter border border-white/10 text-white">
                <DialogHeader>
                  <DialogTitle>Create Energy Listing</DialogTitle>
                  <DialogDescription className="text-white/60">
                    List your energy credits for sale on the marketplace.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="amount" className="text-right">
                      Amount
                    </Label>
                    <Input
                      id="amount"
                      type="number"
                      value={listingAmount}
                      onChange={(e) => setListingAmount(Number(e.target.value))}
                      className="col-span-3 bg-zap-dark border-white/10"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="price" className="text-right">
                      Price per Token
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      value={pricePerToken}
                      onChange={(e) => setPricePerToken(Number(e.target.value))}
                      className="col-span-3 bg-zap-dark border-white/10"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={handleCreateListing}
                    className="bg-solana-green hover:bg-solana-green/80 text-black"
                  >
                    Create Listing
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {marketplaceError && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-4 flex items-center gap-2">
            <AlertCircle className="text-red-500" size={20} />
            <p className="text-white">{marketplaceError}</p>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
            {[1, 2, 3].map((_, index) => (
              <Skeleton key={index} className="h-[200px] w-full bg-zap-dark-lighter" />
            ))}
          </div>
        ) : listings.length === 0 ? (
          renderEmptyState()
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
            {listings.map((listing) => (
              <motion.div
                key={listing.id}
                className="bg-zap-dark-lighter/70 rounded-lg p-5 border border-white/10 hover:border-solana-purple/30 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-medium text-lg">Energy Credits</h3>
                    <p className="text-sm text-white/60">Seller: {listing.seller.slice(0, 6)}...{listing.seller.slice(-4)}</p>
                  </div>
                  <div className="flex items-center gap-1 text-solana-green text-sm">
                    <ShieldCheck size={14} />
                    <span>Verified</span>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-white/60">Amount:</span>
                    <span className="font-medium">{listing.amount} eZap</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Price per token:</span>
                    <span className="font-medium">{listing.pricePerToken} SOL</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Total price:</span>
                    <span className="font-medium text-solana-green">{listing.totalPrice} SOL</span>
                  </div>
                </div>

                <Dialog open={isPurchaseDialogOpen && selectedListing === listing.id} onOpenChange={(open) => {
                  setIsPurchaseDialogOpen(open);
                  if (open) setSelectedListing(listing.id);
                }}>
                  <DialogTrigger asChild>
                    <Button
                      className="w-full bg-solana-purple hover:bg-solana-purple/80"
                      onClick={() => {
                        setSelectedListing(listing.id);
                        setPurchaseAmount(Math.min(listing.amount, 50)); // Default to 50 or max available
                      }}
                    >
                      Purchase
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-zap-dark-lighter border border-white/10 text-white">
                    <DialogHeader>
                      <DialogTitle>Purchase Energy Credits</DialogTitle>
                      <DialogDescription className="text-white/60">
                        Purchase energy credits from this listing.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="purchase-amount" className="text-right">
                          Amount
                        </Label>
                        <Input
                          id="purchase-amount"
                          type="number"
                          value={purchaseAmount}
                          onChange={(e) => setPurchaseAmount(Number(e.target.value))}
                          max={listing.amount}
                          className="col-span-3 bg-zap-dark border-white/10"
                        />
                      </div>
                      <div className="bg-zap-dark/50 p-3 rounded-lg">
                        <div className="flex justify-between mb-2">
                          <span className="text-white/60">Price per token:</span>
                          <span>{listing.pricePerToken} SOL</span>
                        </div>
                        <div className="flex justify-between font-medium">
                          <span>Total cost:</span>
                          <span className="text-solana-green">{(listing.pricePerToken * purchaseAmount).toFixed(4)} SOL</span>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        onClick={handlePurchase}
                        className="bg-solana-green hover:bg-solana-green/80 text-black"
                      >
                        Confirm Purchase
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnergyListings;
