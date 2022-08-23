import './faucetModal.css';
import '../../App.css';
import { useConnectedWallet, useSolana } from "@saberhq/use-solana";
import { Protocol } from '@fabric-foundation/sdk'
import { toast } from 'react-toastify';
import { LAMPORTS_PER_SOL, Connection } from '@solana/web3.js'
import { Button } from '../button/Button';
import { useState } from 'react';
import { handleError } from '../../utils';

interface FaucetModalProps {
    closeTrigger: () => void;
    protocol?: Protocol;
}

export const FaucetModal = ({
    closeTrigger,
    protocol
}: FaucetModalProps) => {

    const { connected, network } = useSolana();
    const wallet = useConnectedWallet();
    const [loadingFab, setLoadingFab] = useState(false);
    const [loadingSol, setLoadingSol] = useState(false);
    const [loadingUsdc, setLoadingUsdc] = useState(false);

    async function claimAirdrop() {
        if (connected && protocol && wallet) {
            setLoadingFab(true);
            try {
                var tx = await protocol.airdropFab(wallet.publicKey);
                toast.success("Airdrop claimed successfully. TX: " + tx.slice(0, 8));
            } catch (e) {
                handleError(e);
             }
        } else {
            toast.error('Your wallet must be connected to claim the FAB airdrop.');
        }
        setLoadingFab(false);
    }

    async function claimUsdcAirdrop() {
        if (connected && protocol && wallet) {
            setLoadingUsdc(true);
            try {
                var tx = await protocol.airdropUsdc(wallet.publicKey);
                toast.success("Airdrop claimed successfully. TX: " + tx.slice(0, 8));
            } catch (e) {
                handleError(e);
             }
        } else {
            toast.error('Your wallet must be connected to claim the FAB airdrop.');
        }
        setLoadingUsdc(false);
    }

    async function claimSolanaAirdrop() {
        if (connected && wallet && protocol) {
            setLoadingSol(true);
            try {
                var conn = new Connection(
                    network !== 'devnet' 
                        ? protocol.connection.rpcEndpoint 
                        : 'https://api.devnet.solana.com/', 
                    'confirmed');
                var tx = await conn.requestAirdrop(wallet.publicKey, 1 * LAMPORTS_PER_SOL);
                toast.success("Airdrop claimed successfully. TX: " + tx.slice(0, 8));
            } catch (e) {
                handleError(e);
            }
        } else {
            toast.error('Your wallet must be connected to claim the SOL airdrop.');
        }
        setLoadingSol(false);
    }

    return (
        <div className="faucet-outline">
            <div className='faucet-contents'>
                <div className='faucet-header'>
                    <div className='faucet-heading'>
                        Faucet
                    </div>
                    <a className='faucet-claim-all-button' onClick={closeTrigger}>
                        Close
                    </a>
                </div>

                <div className='faucet-divider'></div>

                <div className='faucet-entry'>
                    <div className='faucet-entry-icon'>
                        <img src="https://solana.com/src/img/branding/solanaLogoMark.png" width="20px" height="20px" />
                    </div>
                    <div className='faucet-entry-stacked-amount'>
                        <div className='faucet-entry-eligible-amount'>1</div>
                        <div className='faucet-entry-symbol'>SOL</div>
                    </div>
                    <div style={{marginLeft: 'auto'}}>
                        <Button
                            onClick={claimSolanaAirdrop}
                            label="Claim" 
                            width={75}
                            height={40}
                            loading={loadingSol}
                            fontSize={16}
                        />
                    </div>
                </div>

                <div className='faucet-divider'></div>

                <div className='faucet-entry'>
                    <div className='faucet-entry-icon'>
                        <img src="https://dex.fsynth.io/logo.png" width="20px" height="20px" />
                    </div>
                    <div className='faucet-entry-stacked-amount'>
                        <div className='faucet-entry-eligible-amount'>100,000</div>
                        <div className='faucet-entry-symbol'>FAB</div>
                    </div>
                    <div style={{marginLeft: 'auto'}}>
                        <Button
                            onClick={claimAirdrop}
                            label="Claim" 
                            width={75}
                            height={40}
                            loading={loadingFab}
                            fontSize={16}
                        />
                    </div>
                </div>

                <div className='faucet-divider'></div>

                <div className='faucet-entry'>
                    <div className='faucet-entry-icon'>
                        <img src="https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png" width="20px" height="20px" />
                    </div>
                    <div className='faucet-entry-stacked-amount'>
                        <div className='faucet-entry-eligible-amount'>1,000</div>
                        <div className='faucet-entry-symbol'>USDC</div>
                    </div>
                    <div style={{marginLeft: 'auto'}}>
                        <Button
                            onClick={claimUsdcAirdrop}
                            label="Claim" 
                            width={75}
                            height={40}
                            loading={loadingUsdc}
                            fontSize={16}
                        />
                    </div>
                </div>

            </div>
        </div>
    );
};