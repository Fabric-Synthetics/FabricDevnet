import './navbar.css';
import '../../App.css';
import {
    ChevronRight,
    Language,
    AccountBalanceWallet,
    MenuOpenRounded,
    HelpOutlineOutlined
} from '@mui/icons-material';
import { useWalletKit } from "@gokiprotocol/walletkit";
import { useConnectedWallet, useSolana } from "@saberhq/use-solana";
import { Protocol } from '@fabric-foundation/sdk'
import { FaucetModal } from '../faucetModal/FaucetModal';
import { useState } from 'react';
import { StyledModal } from '../../styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFaucet } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { Link } from "react-router-dom";

interface NavbarProps {
    currentPage: string;
    protocol?: Protocol;
    toggleDrawer: () => void;
}

export const Navbar = ({
    currentPage,
    protocol,
    toggleDrawer
}: NavbarProps) => {

    const { connected, disconnect, setNetwork, network } = useSolana();
    const wallet = useConnectedWallet();
    const { connect } = useWalletKit();

    const [faucet, setOpenFaucet] = useState(false);
    const closeFaucet = () => setOpenFaucet(false);
    const openFaucet = () => setOpenFaucet(true);

    async function toggleFaucetOpen() {
        if (connected && wallet && protocol) {
            openFaucet();
        } else {
            toast.error("Please connect your wallet.");
        }
    }

    return (
        <div className="dapp-navbar">
            <div className="breadcrumb w-clearfix">
                <Link className="breadcrumb-link" to='/'>
                    FABRIC
                </Link>
                <ChevronRight className="icon" />
                <a href="#" className="breadcrumb-link w--current">{currentPage}</a>
            </div>

            <div className="dapp-top-nav-right padded">
                <div className="network-select w-clearfix" onClick={() => { 
                    if (network === 'devnet') {
                        setNetwork('localnet');
                    } else if (network === 'localnet') {
                        setNetwork('mainnet-beta');
                    } else if (network === 'mainnet-beta') {
                        setNetwork('devnet');
                    }
                 }}>
                    <div className="net-swap-label w-clearfix inline-div">
                        <Language className="icon" />
                        <div className="network-selector">GenesysGo ({network})</div>
                    </div>
                </div>

                <a href="#" className="menu-button-2 menu-button-icon-mobile mobile-show" onClick={toggleDrawer}>
                    <MenuOpenRounded className="w-icon-nav-menu" width="24px" height="24px" />
                </a>

                <a className="btn-compact w-clearfix w-button" onClick={() => {
                    if (connected) { disconnect(); } else { connect(); }
                }}>
                    <AccountBalanceWallet className="icon" /> {!connected ? "Connect" : wallet?.publicKey.toBase58().slice(0, 8)}
                </a>

                <Link className="balances-wrap" to='/diagnostics'>
                    <HelpOutlineOutlined className="balances w-clearfix" />
                </Link>

                {
                    network !== 'mainnet-beta' 
                    ? <div className="balances-wrap" onClick={toggleFaucetOpen}>
                        <FontAwesomeIcon icon={faFaucet} className="balances w-clearfix" style={{boxSizing: 'inherit'}} />
                    </div>
                    : <></>
                }
                
            </div>
            <StyledModal open={faucet} onClose={closeFaucet}>
                <FaucetModal closeTrigger={closeFaucet} protocol={protocol} />
            </StyledModal>
        </div>
    );
};