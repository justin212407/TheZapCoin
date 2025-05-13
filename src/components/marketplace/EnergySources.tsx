import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Sun, Wind, Droplets, ShieldCheck, Zap } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useEnergy } from '@/lib/solana/energy';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EnergySourcesProps {
  isLoading: boolean;
}

const EnergySources: React.FC<EnergySourcesProps> = ({ isLoading: externalLoading }) => {
  const { connected } = useWallet();
  const { toast } = useToast();
  
  // Energy hooks
  const { 
    initializeEnergySource, 
    submitEnergyReading, 
    getEnergySources,
    isLoading: energyLoading,
    error: energyError
  } = useEnergy();
  
  // State for energy sources
  const [energySources, setEnergySources] = useState<any[]>([]);
  const [energyType, setEnergyType] = useState<string>('Solar');
  const [capacity, setCapacity] = useState<number>(5000);
  const [energyAmount, setEnergyAmount] = useState<number>(100);
  const [selectedSource, setSelectedSource] = useState<string>('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  
  // Load energy sources when component mounts
  useEffect(() => {
    if (connected) {
      loadEnergySources();
    }
  }, [connected]);
  
  const loadEnergySources = async () => {
    const sources = await getEnergySources();
    setEnergySources(sources);
  };
  
  // Energy functions
  const handleCreateEnergySource = async () => {
    if (!connected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to create an energy source",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const result = await initializeEnergySource(energyType, capacity);
      if (result) {
        toast({
          title: "Energy source created",
          description: `Successfully registered your ${energyType} energy source`,
        });
        loadEnergySources();
        setIsCreateDialogOpen(false);
      }
    } catch (error) {
      toast({
        title: "Error creating energy source",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive"
      });
    }
  };
  
  const handleSubmitReading = async () => {
    if (!connected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to submit an energy reading",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const result = await submitEnergyReading(energyAmount);
      if (result) {
        toast({
          title: "Energy reading submitted",
          description: `Successfully submitted ${energyAmount} kWh, earned ${result.tokensEarned} eZap tokens`,
        });
        loadEnergySources();
        setIsSubmitDialogOpen(false);
      }
    } catch (error) {
      toast({
        title: "Error submitting energy reading",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive"
      });
    }
  };

  const getEnergyIcon = (type: string) => {
    switch (type) {
      case 'Solar':
        return <Sun className="text-amber-400" size={20} />;
      case 'Wind':
        return <Wind className="text-blue-400" size={20} />;
      case 'Hydro':
        return <Droplets className="text-cyan-400" size={20} />;
      default:
        return <Zap className="text-solana-purple" size={20} />;
    }
  };

  const renderEmptyState = () => (
    <motion.div 
      className="flex flex-col items-center justify-center bg-zap-dark-lighter/50 rounded-lg p-10 border border-white/5 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="mb-4 p-4 rounded-full bg-zap-dark-lighter">
        <Sun size={32} className="text-solana-purple" />
      </div>
      <h3 className="text-xl font-medium mb-2">No energy sources registered</h3>
      <p className="text-white/60 max-w-md">
        Register your renewable energy source to start earning eZap tokens.
      </p>
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogTrigger asChild>
          <Button className="mt-6 bg-solana-purple hover:bg-solana-purple/80">
            Register Energy Source
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-zap-dark-lighter border border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Register Energy Source</DialogTitle>
            <DialogDescription className="text-white/60">
              Register your renewable energy source to start earning eZap tokens.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="energy-type" className="text-right">
                Energy Type
              </Label>
              <Select value={energyType} onValueChange={setEnergyType}>
                <SelectTrigger id="energy-type" className="col-span-3 bg-zap-dark border-white/10">
                  <SelectValue placeholder="Select energy type" />
                </SelectTrigger>
                <SelectContent className="bg-zap-dark-lighter border-white/10">
                  <SelectItem value="Solar">Solar</SelectItem>
                  <SelectItem value="Wind">Wind</SelectItem>
                  <SelectItem value="Hydro">Hydro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="capacity" className="text-right">
                Capacity (kWh)
              </Label>
              <Input
                id="capacity"
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                className="col-span-3 bg-zap-dark border-white/10"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              onClick={handleCreateEnergySource}
              className="bg-solana-green hover:bg-solana-green/80 text-black"
            >
              Register Source
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );

  const isLoading = externalLoading || energyLoading;

  return (
    <Card className="overflow-hidden border border-white/10 bg-card-gradient">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">Energy Sources</CardTitle>
        {connected && (
          <div className="flex gap-2">
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-solana-green/50 text-solana-green hover:bg-solana-green/20">
                  Register Source
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-zap-dark-lighter border border-white/10 text-white">
                <DialogHeader>
                  <DialogTitle>Register Energy Source</DialogTitle>
                  <DialogDescription className="text-white/60">
                    Register your renewable energy source to start earning eZap tokens.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="energy-type" className="text-right">
                      Energy Type
                    </Label>
                    <Select value={energyType} onValueChange={setEnergyType}>
                      <SelectTrigger id="energy-type" className="col-span-3 bg-zap-dark border-white/10">
                        <SelectValue placeholder="Select energy type" />
                      </SelectTrigger>
                      <SelectContent className="bg-zap-dark-lighter border-white/10">
                        <SelectItem value="Solar">Solar</SelectItem>
                        <SelectItem value="Wind">Wind</SelectItem>
                        <SelectItem value="Hydro">Hydro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="capacity" className="text-right">
                      Capacity (kWh)
                    </Label>
                    <Input
                      id="capacity"
                      type="number"
                      value={capacity}
                      onChange={(e) => setCapacity(Number(e.target.value))}
                      className="col-span-3 bg-zap-dark border-white/10"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    onClick={handleCreateEnergySource}
                    className="bg-solana-green hover:bg-solana-green/80 text-black"
                  >
                    Register Source
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            {energySources.length > 0 && (
              <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-solana-purple hover:bg-solana-purple/80">
                    Submit Reading
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-zap-dark-lighter border border-white/10 text-white">
                  <DialogHeader>
                    <DialogTitle>Submit Energy Reading</DialogTitle>
                    <DialogDescription className="text-white/60">
                      Submit your energy production to earn eZap tokens.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="energy-amount" className="text-right">
                        Energy (kWh)
                      </Label>
                      <Input
                        id="energy-amount"
                        type="number"
                        value={energyAmount}
                        onChange={(e) => setEnergyAmount(Number(e.target.value))}
                        className="col-span-3 bg-zap-dark border-white/10"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button 
                      onClick={handleSubmitReading}
                      className="bg-solana-green hover:bg-solana-green/80 text-black"
                    >
                      Submit Reading
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        )}
      </CardHeader>
      <CardContent>
        {energyError && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-4 flex items-center gap-2">
            <AlertCircle className="text-red-500" size={20} />
            <p className="text-white">{energyError}</p>
          </div>
        )}
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            {[1, 2].map((_, index) => (
              <Skeleton key={index} className="h-[200px] w-full bg-zap-dark-lighter" />
            ))}
          </div>
        ) : energySources.length === 0 ? (
          renderEmptyState()
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            {energySources.map((source) => (
              <motion.div 
                key={source.id} 
                className="bg-zap-dark-lighter/70 rounded-lg p-5 border border-white/10 hover:border-solana-purple/30 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    {getEnergyIcon(source.energyType)}
                    <div>
                      <h3 className="font-medium text-lg">{source.energyType} Energy</h3>
                      <p className="text-sm text-white/60">ID: {source.id.slice(0, 8)}...</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-solana-green text-sm">
                    {source.verified && (
                      <>
                        <ShieldCheck size={14} />
                        <span>Verified</span>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-white/60">Capacity:</span>
                    <span className="font-medium">{source.capacity} kWh</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Total Energy Produced:</span>
                    <span className="font-medium">{source.totalEnergyProduced} kWh</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Estimated eZap Earned:</span>
                    <span className="font-medium text-solana-green">{source.totalEnergyProduced / 2} eZap</span>
                  </div>
                </div>
                
                <Dialog open={isSubmitDialogOpen && selectedSource === source.id} onOpenChange={(open) => {
                  setIsSubmitDialogOpen(open);
                  if (open) setSelectedSource(source.id);
                }}>
                  <DialogTrigger asChild>
                    <Button 
                      className="w-full bg-solana-purple hover:bg-solana-purple/80"
                      onClick={() => {
                        setSelectedSource(source.id);
                      }}
                    >
                      Submit New Reading
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-zap-dark-lighter border border-white/10 text-white">
                    <DialogHeader>
                      <DialogTitle>Submit Energy Reading</DialogTitle>
                      <DialogDescription className="text-white/60">
                        Submit your energy production to earn eZap tokens.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="energy-amount" className="text-right">
                          Energy (kWh)
                        </Label>
                        <Input
                          id="energy-amount"
                          type="number"
                          value={energyAmount}
                          onChange={(e) => setEnergyAmount(Number(e.target.value))}
                          className="col-span-3 bg-zap-dark border-white/10"
                        />
                      </div>
                      <div className="bg-zap-dark/50 p-3 rounded-lg">
                        <div className="flex justify-between mb-2">
                          <span className="text-white/60">Conversion rate:</span>
                          <span>2 kWh = 1 eZap</span>
                        </div>
                        <div className="flex justify-between font-medium">
                          <span>Estimated earnings:</span>
                          <span className="text-solana-green">{energyAmount / 2} eZap</span>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button 
                        onClick={handleSubmitReading}
                        className="bg-solana-green hover:bg-solana-green/80 text-black"
                      >
                        Submit Reading
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

export default EnergySources;
