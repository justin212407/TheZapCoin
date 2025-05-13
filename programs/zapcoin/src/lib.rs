use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};
use anchor_lang::system_program;

declare_id!("2dv7D1h2w5QcvMEnB6qqFYSudmb31uyvTowBvLoBcUN9");

#[program]
pub mod zapcoin {
    use super::*;

    // Initialize a new energy source
    pub fn initialize_energy_source(
        ctx: Context<InitializeEnergySource>,
        energy_type: String,
        capacity: u64,
    ) -> Result<()> {
        let energy_source = &mut ctx.accounts.energy_source;
        energy_source.owner = ctx.accounts.owner.key();
        energy_source.energy_type = energy_type;
        energy_source.capacity = capacity;
        energy_source.verified = false;
        energy_source.total_energy_produced = 0;
        energy_source.bump = *ctx.bumps.get("energy_source").unwrap();

        msg!("Energy source initialized: {}", energy_type);
        Ok(())
    }

    // Verify an energy source (would be called by an oracle in production)
    pub fn verify_energy_source(ctx: Context<VerifyEnergySource>) -> Result<()> {
        let energy_source = &mut ctx.accounts.energy_source;
        energy_source.verified = true;

        msg!("Energy source verified");
        Ok(())
    }

    // Submit energy reading from a verified source and mint energy tokens
    pub fn submit_energy_reading(
        ctx: Context<SubmitEnergyReading>,
        energy_amount: u64,
    ) -> Result<()> {
        let energy_source = &mut ctx.accounts.energy_source;

        // Ensure the energy source is verified
        require!(energy_source.verified, ErrorCode::EnergySourceNotVerified);

        // Update total energy produced
        energy_source.total_energy_produced = energy_source.total_energy_produced.checked_add(energy_amount)
            .ok_or(ErrorCode::ArithmeticOverflow)?;

        // Mint energy tokens to the user's token account (1:1 ratio for simplicity)
        // In a real implementation, this would use a more complex formula based on energy market rates
        let tokens_to_mint = energy_amount;

        // Mint tokens to the user's account
        // Note: In a real implementation, this would require the program to have mint authority
        // For simplicity, we're assuming the program has mint authority
        token::mint_to(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                token::MintTo {
                    mint: ctx.accounts.energy_token_mint.to_account_info(),
                    to: ctx.accounts.user_token_account.to_account_info(),
                    authority: ctx.accounts.owner.to_account_info(),
                },
            ),
            tokens_to_mint,
        )?;

        msg!("Energy reading submitted: {} kWh, minted {} tokens", energy_amount, tokens_to_mint);
        Ok(())
    }

    // Create a new BNPL loan
    pub fn create_loan(
        ctx: Context<CreateLoan>,
        amount: u64,
        term_days: u16,
    ) -> Result<()> {
        let loan = &mut ctx.accounts.loan;
        loan.borrower = ctx.accounts.borrower.key();
        loan.amount = amount;
        loan.term_days = term_days;
        loan.creation_time = Clock::get()?.unix_timestamp;
        loan.repaid_amount = 0;
        loan.status = LoanStatus::Active;
        loan.bump = *ctx.bumps.get("loan").unwrap();

        msg!("Loan created: {} tokens, {} days term", amount, term_days);
        Ok(())
    }

    // Repay a loan with energy tokens
    pub fn repay_loan_with_energy(
        ctx: Context<RepayLoanWithEnergy>,
        amount: u64,
    ) -> Result<()> {
        let loan = &mut ctx.accounts.loan;

        // Ensure the loan is active
        require!(loan.status == LoanStatus::Active, ErrorCode::LoanNotActive);

        // Calculate the remaining amount to repay
        let remaining_amount = loan.amount.checked_sub(loan.repaid_amount)
            .ok_or(ErrorCode::ArithmeticOverflow)?;

        // Ensure the repayment amount is not more than what's remaining
        let repay_amount = if amount > remaining_amount {
            remaining_amount
        } else {
            amount
        };

        // Transfer tokens from borrower to loan account
        token::transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.borrower_token_account.to_account_info(),
                    to: ctx.accounts.loan_token_account.to_account_info(),
                    authority: ctx.accounts.borrower.to_account_info(),
                },
            ),
            repay_amount,
        )?;

        // Update loan repaid amount
        loan.repaid_amount = loan.repaid_amount.checked_add(repay_amount)
            .ok_or(ErrorCode::ArithmeticOverflow)?;

        // Check if loan is fully repaid
        if loan.repaid_amount >= loan.amount {
            loan.status = LoanStatus::Repaid;
            msg!("Loan fully repaid: {} tokens", loan.amount);
        } else {
            msg!("Loan partially repaid: {}/{} tokens", loan.repaid_amount, loan.amount);
        }

        Ok(())
    }

    // Create a marketplace listing
    pub fn create_listing(
        ctx: Context<CreateListing>,
        amount: u64,
        price_per_token: u64,
    ) -> Result<()> {
        let listing = &mut ctx.accounts.listing;
        listing.seller = ctx.accounts.seller.key();
        listing.amount = amount;
        listing.price_per_token = price_per_token;
        listing.active = true;
        listing.bump = *ctx.bumps.get("listing").unwrap();

        // Transfer tokens from seller to escrow
        token::transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.seller_token_account.to_account_info(),
                    to: ctx.accounts.escrow_token_account.to_account_info(),
                    authority: ctx.accounts.seller.to_account_info(),
                },
            ),
            amount,
        )?;

        msg!("Listing created: {} tokens at {} per token", amount, price_per_token);
        Ok(())
    }

    // Purchase tokens from a marketplace listing
    pub fn purchase_listing(
        ctx: Context<PurchaseListing>,
        amount: u64,
    ) -> Result<()> {
        let listing = &mut ctx.accounts.listing;

        // Ensure the listing has enough tokens
        require!(listing.amount >= amount, ErrorCode::InsufficientListingAmount);

        // Calculate the total price
        let total_price = amount.checked_mul(listing.price_per_token)
            .ok_or(ErrorCode::ArithmeticOverflow)?;

        // In a real implementation, we would transfer SOL from buyer to seller here
        // For simplicity, we're just transferring the tokens from escrow to buyer

        // Transfer tokens from escrow to buyer
        token::transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.escrow_token_account.to_account_info(),
                    to: ctx.accounts.buyer_token_account.to_account_info(),
                    authority: ctx.accounts.buyer.to_account_info(), // In reality, this would be a PDA with authority
                },
            ),
            amount,
        )?;

        // Update listing amount
        listing.amount = listing.amount.checked_sub(amount)
            .ok_or(ErrorCode::ArithmeticOverflow)?;

        // If all tokens are sold, mark the listing as inactive
        if listing.amount == 0 {
            listing.active = false;
        }

        msg!("Purchase successful: {} tokens for {} lamports", amount, total_price);
        Ok(())
    }
}

// Account Structures

#[derive(Accounts)]
pub struct InitializeEnergySource<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,

    #[account(
        init,
        payer = owner,
        space = 8 + EnergySource::SPACE,
        seeds = [b"energy_source", owner.key().as_ref()],
        bump
    )]
    pub energy_source: Account<'info, EnergySource>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct VerifyEnergySource<'info> {
    // In production, this would be restricted to an oracle or authority
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        mut,
        seeds = [b"energy_source", energy_source.owner.as_ref()],
        bump = energy_source.bump
    )]
    pub energy_source: Account<'info, EnergySource>,
}

#[derive(Accounts)]
pub struct SubmitEnergyReading<'info> {
    #[account(
        mut,
        constraint = owner.key() == energy_source.owner
    )]
    pub owner: Signer<'info>,

    #[account(
        mut,
        seeds = [b"energy_source", owner.key().as_ref()],
        bump = energy_source.bump
    )]
    pub energy_source: Account<'info, EnergySource>,

    #[account(mut)]
    pub energy_token_mint: Account<'info, Mint>,

    #[account(
        mut,
        constraint = user_token_account.owner == owner.key(),
        constraint = user_token_account.mint == energy_token_mint.key()
    )]
    pub user_token_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct CreateLoan<'info> {
    #[account(mut)]
    pub borrower: Signer<'info>,

    #[account(
        init,
        payer = borrower,
        space = 8 + Loan::SPACE,
        seeds = [b"loan", borrower.key().as_ref(), &Clock::get()?.unix_timestamp.to_le_bytes()],
        bump
    )]
    pub loan: Account<'info, Loan>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RepayLoanWithEnergy<'info> {
    #[account(
        mut,
        constraint = borrower.key() == loan.borrower
    )]
    pub borrower: Signer<'info>,

    #[account(
        mut,
        seeds = [b"loan", loan.borrower.as_ref(), &loan.creation_time.to_le_bytes()],
        bump = loan.bump
    )]
    pub loan: Account<'info, Loan>,

    #[account(mut)]
    pub energy_token_mint: Account<'info, Mint>,

    #[account(
        mut,
        constraint = borrower_token_account.owner == borrower.key(),
        constraint = borrower_token_account.mint == energy_token_mint.key()
    )]
    pub borrower_token_account: Account<'info, TokenAccount>,

    #[account(
        mut,
        constraint = loan_token_account.mint == energy_token_mint.key()
    )]
    pub loan_token_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}



#[derive(Accounts)]
pub struct CreateListing<'info> {
    #[account(mut)]
    pub seller: Signer<'info>,

    #[account(
        init,
        payer = seller,
        space = 8 + Listing::SPACE,
        seeds = [b"listing", seller.key().as_ref()],
        bump
    )]
    pub listing: Account<'info, Listing>,

    #[account(mut)]
    pub energy_token_mint: Account<'info, Mint>,

    #[account(
        mut,
        constraint = seller_token_account.owner == seller.key(),
        constraint = seller_token_account.mint == energy_token_mint.key()
    )]
    pub seller_token_account: Account<'info, TokenAccount>,

    #[account(
        mut,
        constraint = escrow_token_account.mint == energy_token_mint.key()
    )]
    pub escrow_token_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct PurchaseListing<'info> {
    #[account(mut)]
    pub buyer: Signer<'info>,

    #[account(
        mut,
        seeds = [b"listing", listing.seller.as_ref()],
        bump = listing.bump,
        constraint = listing.active @ ErrorCode::ListingNotActive
    )]
    pub listing: Account<'info, Listing>,

    #[account(mut)]
    pub energy_token_mint: Account<'info, Mint>,

    #[account(
        mut,
        constraint = buyer_token_account.owner == buyer.key(),
        constraint = buyer_token_account.mint == energy_token_mint.key()
    )]
    pub buyer_token_account: Account<'info, TokenAccount>,

    #[account(
        mut,
        constraint = escrow_token_account.mint == energy_token_mint.key()
    )]
    pub escrow_token_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}

// Data Structures

#[account]
pub struct EnergySource {
    pub owner: Pubkey,
    pub energy_type: String,
    pub capacity: u64,
    pub verified: bool,
    pub total_energy_produced: u64,
    pub bump: u8,
}

impl EnergySource {
    pub const SPACE: usize = 32 + // owner
                             36 + // energy_type (max 32 chars + 4 bytes for length)
                             8 +  // capacity
                             1 +  // verified
                             8 +  // total_energy_produced
                             1;   // bump
}

#[account]
pub struct Loan {
    pub borrower: Pubkey,
    pub amount: u64,
    pub term_days: u16,
    pub creation_time: i64,
    pub repaid_amount: u64,
    pub status: LoanStatus,
    pub bump: u8,
}

impl Loan {
    pub const SPACE: usize = 32 + // borrower
                             8 +  // amount
                             2 +  // term_days
                             8 +  // creation_time
                             8 +  // repaid_amount
                             1 +  // status
                             1;   // bump
}

#[account]
pub struct Listing {
    pub seller: Pubkey,
    pub amount: u64,
    pub price_per_token: u64,
    pub active: bool,
    pub bump: u8,
}

impl Listing {
    pub const SPACE: usize = 32 + // seller
                             8 +  // amount
                             8 +  // price_per_token
                             1 +  // active
                             1;   // bump
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum LoanStatus {
    Active,
    Repaid,
    Defaulted,
}

// Error Codes

#[error_code]
pub enum ErrorCode {
    #[msg("Arithmetic overflow")]
    ArithmeticOverflow,
    #[msg("Energy source not verified")]
    EnergySourceNotVerified,
    #[msg("Loan not active")]
    LoanNotActive,
    #[msg("Listing not active")]
    ListingNotActive,
    #[msg("Insufficient listing amount")]
    InsufficientListingAmount,
    #[msg("Unauthorized")]
    Unauthorized,
}
