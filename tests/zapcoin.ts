import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { Keypair, PublicKey, SystemProgram } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from '@solana/spl-token';
import { Zapcoin } from '../target/types/zapcoin';
import { expect } from 'chai';

describe('zapcoin', () => {
  // Configure the client to use the local cluster
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Zapcoin as Program<Zapcoin>;
  const wallet = provider.wallet;

  // Test user
  const user = Keypair.generate();

  // Energy token mint PDA
  let energyTokenMintPDA: PublicKey;
  let energyTokenMintBump: number;

  // Energy source PDA
  let energySourcePDA: PublicKey;
  let energySourceBump: number;

  before(async () => {
    // Airdrop SOL to the test user
    const signature = await provider.connection.requestAirdrop(
      user.publicKey,
      1000000000 // 1 SOL
    );
    await provider.connection.confirmTransaction(signature);

    // Find the energy token mint PDA
    const [mintPDA, mintBump] = await PublicKey.findProgramAddress(
      [Buffer.from('energy_token_mint')],
      program.programId
    );
    energyTokenMintPDA = mintPDA;
    energyTokenMintBump = mintBump;

    // Find the energy source PDA
    const [sourcePDA, sourceBump] = await PublicKey.findProgramAddress(
      [Buffer.from('energy_source'), user.publicKey.toBuffer()],
      program.programId
    );
    energySourcePDA = sourcePDA;
    energySourceBump = sourceBump;
  });

  it('Initializes an energy source', async () => {
    // Initialize an energy source
    await program.methods
      .initializeEnergySource('Solar', new anchor.BN(5000))
      .accounts({
        owner: user.publicKey,
        energySource: energySourcePDA,
        systemProgram: SystemProgram.programId,
      })
      .signers([user])
      .rpc();

    // Fetch the energy source account
    const energySource = await program.account.energySource.fetch(energySourcePDA);

    // Verify the energy source data
    expect(energySource.owner.toString()).to.equal(user.publicKey.toString());
    expect(energySource.energyType).to.equal('Solar');
    expect(energySource.capacity.toNumber()).to.equal(5000);
    expect(energySource.verified).to.be.false;
    expect(energySource.totalEnergyProduced.toNumber()).to.equal(0);
    expect(energySource.bump).to.equal(energySourceBump);
  });

  it('Verifies an energy source', async () => {
    // Verify the energy source
    await program.methods
      .verifyEnergySource()
      .accounts({
        authority: provider.wallet.publicKey,
        energySource: energySourcePDA,
      })
      .rpc();

    // Fetch the energy source account
    const energySource = await program.account.energySource.fetch(energySourcePDA);

    // Verify the energy source is now verified
    expect(energySource.verified).to.be.true;
  });

  it('Creates a BNPL loan', async () => {
    // Get the current timestamp
    const currentTime = Math.floor(Date.now() / 1000);

    // Find the loan PDA
    const [loanPDA, loanBump] = await PublicKey.findProgramAddress(
      [
        Buffer.from('loan'),
        user.publicKey.toBuffer(),
        new anchor.BN(currentTime).toArrayLike(Buffer, 'le', 8)
      ],
      program.programId
    );

    // Create a loan
    await program.methods
      .createLoan(new anchor.BN(1000), 30)
      .accounts({
        borrower: user.publicKey,
        loan: loanPDA,
        systemProgram: SystemProgram.programId,
      })
      .signers([user])
      .rpc();

    // Fetch the loan account
    const loan = await program.account.loan.fetch(loanPDA);

    // Verify the loan data
    expect(loan.borrower.toString()).to.equal(user.publicKey.toString());
    expect(loan.amount.toNumber()).to.equal(1000);
    expect(loan.termDays).to.equal(30);
    expect(loan.repaidAmount.toNumber()).to.equal(0);
    expect(loan.status).to.deep.equal({ active: {} });
    expect(loan.bump).to.equal(loanBump);
  });

  it('Creates a marketplace listing', async () => {
    // Find the listing PDA
    const [listingPDA, listingBump] = await PublicKey.findProgramAddress(
      [Buffer.from('listing'), user.publicKey.toBuffer()],
      program.programId
    );

    // Get the associated token account for the seller
    const sellerTokenAccount = await getAssociatedTokenAddress(
      energyTokenMintPDA,
      user.publicKey
    );

    // Get the associated token account for the escrow
    const escrowTokenAccount = await getAssociatedTokenAddress(
      energyTokenMintPDA,
      listingPDA,
      true // allowOwnerOffCurve
    );

    // Create a listing
    await program.methods
      .createListing(new anchor.BN(100), new anchor.BN(10))
      .accounts({
        seller: user.publicKey,
        listing: listingPDA,
        energyTokenMint: energyTokenMintPDA,
        sellerTokenAccount: sellerTokenAccount,
        escrowTokenAccount: escrowTokenAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .signers([user])
      .rpc();

    // Fetch the listing account
    const listing = await program.account.listing.fetch(listingPDA);

    // Verify the listing data
    expect(listing.seller.toString()).to.equal(user.publicKey.toString());
    expect(listing.amount.toNumber()).to.equal(100);
    expect(listing.pricePerToken.toNumber()).to.equal(10);
    expect(listing.active).to.be.true;
    expect(listing.bump).to.equal(listingBump);
  });
});
