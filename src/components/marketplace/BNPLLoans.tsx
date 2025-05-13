import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, CreditCard, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useBNPL } from '@/lib/solana/bnpl';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";

interface BNPLLoansProps {
  isLoading: boolean;
}

const BNPLLoans: React.FC<BNPLLoansProps> = ({ isLoading: externalLoading }) => {
  const { connected } = useWallet();
  const { toast } = useToast();
  
  // BNPL hooks
  const {
    createLoan,
    repayLoan,
    getLoans,
    isLoading: bnplLoading,
    error: bnplError
  } = useBNPL();
  
  // State for loans
  const [loans, setLoans] = useState<any[]>([]);
  const [loanAmount, setLoanAmount] = useState<number>(1000);
  const [termDays, setTermDays] = useState<number>(30);
  const [repayAmount, setRepayAmount] = useState<number>(100);
  const [selectedLoan, setSelectedLoan] = useState<string>('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isRepayDialogOpen, setIsRepayDialogOpen] = useState(false);
  
  // Load loans when component mounts
  useEffect(() => {
    if (connected) {
      loadLoans();
    }
  }, [connected]);
  
  const loadLoans = async () => {
    const userLoans = await getLoans();
    setLoans(userLoans);
  };
  
  // BNPL functions
  const handleCreateLoan = async () => {
    if (!connected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to create a loan",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const result = await createLoan(loanAmount, termDays);
      if (result) {
        toast({
          title: "Loan created",
          description: `Successfully created loan for ${loanAmount} tokens`,
        });
        loadLoans();
        setIsCreateDialogOpen(false);
      }
    } catch (error) {
      toast({
        title: "Error creating loan",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive"
      });
    }
  };
  
  const handleRepayLoan = async () => {
    if (!connected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to repay a loan",
        variant: "destructive"
      });
      return;
    }
    
    if (!selectedLoan) {
      toast({
        title: "No loan selected",
        description: "Please select a loan to repay",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const result = await repayLoan(selectedLoan, repayAmount);
      if (result) {
        toast({
          title: "Loan repaid",
          description: `Successfully repaid ${repayAmount} tokens`,
        });
        loadLoans();
        setIsRepayDialogOpen(false);
      }
    } catch (error) {
      toast({
        title: "Error repaying loan",
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
        <CreditCard size={32} className="text-solana-purple" />
      </div>
      <h3 className="text-xl font-medium mb-2">No active loans</h3>
      <p className="text-white/60 max-w-md">
        Get what you need today and pay later with energy credits.
      </p>
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogTrigger asChild>
          <Button className="mt-6 bg-solana-purple hover:bg-solana-purple/80">
            Get a Loan
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-zap-dark-lighter border border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Create New Loan</DialogTitle>
            <DialogDescription className="text-white/60">
              Get a loan now and pay later with energy credits.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="loan-amount" className="text-right">
                Amount
              </Label>
              <Input
                id="loan-amount"
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="col-span-3 bg-zap-dark border-white/10"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="term-days" className="text-right">
                Term (days)
              </Label>
              <Input
                id="term-days"
                type="number"
                value={termDays}
                onChange={(e) => setTermDays(Number(e.target.value))}
                className="col-span-3 bg-zap-dark border-white/10"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              onClick={handleCreateLoan}
              className="bg-solana-green hover:bg-solana-green/80 text-black"
            >
              Create Loan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active':
        return <Clock className="text-amber-400" size={16} />;
      case 'Repaid':
        return <CheckCircle className="text-green-400" size={16} />;
      case 'Defaulted':
        return <XCircle className="text-red-400" size={16} />;
      default:
        return null;
    }
  };

  const isLoading = externalLoading || bnplLoading;

  return (
    <Card className="overflow-hidden border border-white/10 bg-card-gradient">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">BNPL Loans</CardTitle>
        {connected && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-solana-green/50 text-solana-green hover:bg-solana-green/20">
                New Loan
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-zap-dark-lighter border border-white/10 text-white">
              <DialogHeader>
                <DialogTitle>Create New Loan</DialogTitle>
                <DialogDescription className="text-white/60">
                  Get a loan now and pay later with energy credits.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="loan-amount" className="text-right">
                    Amount
                  </Label>
                  <Input
                    id="loan-amount"
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="col-span-3 bg-zap-dark border-white/10"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="term-days" className="text-right">
                    Term (days)
                  </Label>
                  <Input
                    id="term-days"
                    type="number"
                    value={termDays}
                    onChange={(e) => setTermDays(Number(e.target.value))}
                    className="col-span-3 bg-zap-dark border-white/10"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button 
                  onClick={handleCreateLoan}
                  className="bg-solana-green hover:bg-solana-green/80 text-black"
                >
                  Create Loan
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      <CardContent>
        {bnplError && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-4 flex items-center gap-2">
            <AlertCircle className="text-red-500" size={20} />
            <p className="text-white">{bnplError}</p>
          </div>
        )}
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            {[1, 2].map((_, index) => (
              <Skeleton key={index} className="h-[200px] w-full bg-zap-dark-lighter" />
            ))}
          </div>
        ) : loans.length === 0 ? (
          renderEmptyState()
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            {loans.map((loan) => (
              <motion.div 
                key={loan.id} 
                className="bg-zap-dark-lighter/70 rounded-lg p-5 border border-white/10 hover:border-solana-purple/30 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-medium text-lg">Loan #{loan.id.slice(0, 6)}</h3>
                    <p className="text-sm text-white/60">Created {new Date(loan.creationTime).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    {getStatusIcon(loan.status)}
                    <span className={
                      loan.status === 'Active' ? 'text-amber-400' : 
                      loan.status === 'Repaid' ? 'text-green-400' : 
                      'text-red-400'
                    }>
                      {loan.status}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-white/60">Amount:</span>
                    <span className="font-medium">{loan.amount} eZap</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Term:</span>
                    <span className="font-medium">{loan.termDays} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Repaid:</span>
                    <span className="font-medium">{loan.repaidAmount} eZap</span>
                  </div>
                  
                  <div className="pt-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Repayment Progress</span>
                      <span>{Math.round((loan.repaidAmount / loan.amount) * 100)}%</span>
                    </div>
                    <Progress value={(loan.repaidAmount / loan.amount) * 100} className="h-2 bg-zap-dark" indicatorClassName="bg-solana-green" />
                  </div>
                </div>
                
                {loan.status === 'Active' && (
                  <Dialog open={isRepayDialogOpen && selectedLoan === loan.id} onOpenChange={(open) => {
                    setIsRepayDialogOpen(open);
                    if (open) setSelectedLoan(loan.id);
                  }}>
                    <DialogTrigger asChild>
                      <Button 
                        className="w-full bg-solana-purple hover:bg-solana-purple/80"
                        onClick={() => {
                          setSelectedLoan(loan.id);
                          setRepayAmount(Math.min(loan.amount - loan.repaidAmount, 100)); // Default to 100 or remaining amount
                        }}
                      >
                        Repay Loan
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-zap-dark-lighter border border-white/10 text-white">
                      <DialogHeader>
                        <DialogTitle>Repay Loan</DialogTitle>
                        <DialogDescription className="text-white/60">
                          Repay your loan with energy credits.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="repay-amount" className="text-right">
                            Amount
                          </Label>
                          <Input
                            id="repay-amount"
                            type="number"
                            value={repayAmount}
                            onChange={(e) => setRepayAmount(Number(e.target.value))}
                            max={loan.amount - loan.repaidAmount}
                            className="col-span-3 bg-zap-dark border-white/10"
                          />
                        </div>
                        <div className="bg-zap-dark/50 p-3 rounded-lg">
                          <div className="flex justify-between mb-2">
                            <span className="text-white/60">Remaining balance:</span>
                            <span>{loan.amount - loan.repaidAmount} eZap</span>
                          </div>
                          <div className="flex justify-between font-medium">
                            <span>New balance after repayment:</span>
                            <span className="text-solana-green">{loan.amount - loan.repaidAmount - repayAmount} eZap</span>
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button 
                          onClick={handleRepayLoan}
                          className="bg-solana-green hover:bg-solana-green/80 text-black"
                        >
                          Confirm Repayment
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BNPLLoans;
