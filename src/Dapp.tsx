import { Navbar } from './stories/navbar/Navbar';
import { Stakepage } from './stories/stakePage/Stakepage';
import { useConnectedWallet, useSolana } from "@gokiprotocol/walletkit";
import { List, Tooltip, CSSObject } from '@mui/material';
import { IAssetList, IState, IUser, Logger, Protocol } from '@fabric-foundation/sdk';
import { SlotUpdate } from "@solana/web3.js";
import { ecosystemMenuLinks } from './stories/menuLinks';
import { MenuOpenRounded } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import './App.css';
import MuiDrawer from '@mui/material/Drawer';
import { styled } from '@mui/system';
import { SwapModal } from './stories/swapModal/SwapModal';
import VerticalAlignBottomIcon from '@mui/icons-material/VerticalAlignBottom';
import { CurrencyExchangeRounded, AssessmentRounded } from '@mui/icons-material';
import { formatPriceNumber } from './utils';
import { getSynthetics } from './tokens/synthetics';

const drawerWidth = 240;

interface DappProps {
    children?: React.ReactNode;
}

const Log = Logger.from('ui/dapp');

export const Dapp = ({
    children
}: DappProps) => {
    const { connected, connection, network } = useSolana();
    const wallet = useConnectedWallet();
    const [open, setOpen] = React.useState(false);
    const [protocol, setProtocol] = useState<Protocol>();
    const [openSwap, setOpenSwap] = useState(false);
    const handleOpenSwap = () => setOpenSwap(true);
    const handleCloseSwap = () => setOpenSwap(false);
        
    const [userAccountExists, setUserAccountExists] = useState(false);
    const [userAccount, setUserAccount] = useState<IUser>();
    const [state, setState] = useState<IState>();
    const [assetList, setAssetList] = useState<IAssetList>();
    const [currentSlot, setCurrentSlot] = useState(0);
    const [subscribed, setSubscribed] = useState(false);
    const [time, setTime] = useState(Date.now());
    const [userDebtUsd, setUserDebtUsd] = useState(0);
    const [maxUserDebtUsd, setMaxUserDebtUsd] = useState(0);
    const [stakedUsd, setStakedUsd] = useState(0);
    const [cRatio, setRatio] = useState(0);

    useEffect(() => {
        async function updateSlot(slot: SlotUpdate) {
            if (slot.type === 'completed') {
                var latestSlot = slot.slot;
                setCurrentSlot(latestSlot);
            }
        }

        async function updateState(stateUpdate: IState) {
            setState(stateUpdate);
        }

        async function updateUser(userUpdate: IUser) {
            setUserAccount(userUpdate);
        }

        async function updateAssetList(assetListUpdate: IAssetList) {
            setAssetList(assetListUpdate);
        }

        async function subscribeToUser() {
            if (protocol && wallet?.connected) {
                Log.debug('subscribing to user account');
                var account = await protocol.getUserAccount(wallet?.publicKey);
                Log.debug(`user account: ${account[0].toBase58()}`);
                var user = await protocol.getUser(account[0]);
                Log.debug(`user: ${JSON.stringify(user)}`);
                setUserAccount(user);
                setUserAccountExists(user === undefined ? false : true);
                protocol.onUserChange(account[0], updateUser);
            }
        }

        async function subscribeToState() {
            if (protocol && wallet?.connected) {
                Log.debug('subscribing to state');
                setState(await protocol.getState());
                protocol.onStateChange(updateState);
            }
        }

        async function subscribeToAssetList() {
            if (protocol && wallet?.connected) {
                Log.debug('subscribing to asset list');
                var assetList = await protocol.getAssetList();
                setAssetList(assetList);
                protocol.onAssetListChange(updateAssetList);
            }
        }

        if (protocol && !subscribed && wallet?.connected) {
            var connection = protocol.connection;
            try {
                subscribeToAssetList().then(() => subscribeToUser().then(() => subscribeToState()));
                connection.onSlotUpdate(updateSlot);
                setSubscribed(true);
            } catch {
                Log.debug('failed to subscribe to events');
                setSubscribed(true);
            }

        }

    });
    
    useEffect(() => {
        async function setProtocolDefault() {
            if (connected && wallet?.connected) {
                Log.debug('setting protocol default');
                setProtocol(await Protocol.initialise(
                    connection,
                    wallet,
                    network
                ));
            }
        }

        async function getUser() {
            if (connected && wallet?.connected && !userAccountExists && protocol) {
                Log.debug('getting user account - not exists');
                var account = ((await protocol.getUserAccount(wallet?.publicKey)));
                try {
                    var user = await protocol.getUser(account[0]);
                    if (user !== undefined) {
                        setUserAccountExists(true);
                        setUserAccount(user);
                        setUserDebtUsd(await protocol.getUserDebtUsd(account[0], user, state, assetList));
                        setRatio(await protocol.getUserCollateralRatio(account[0], user, state, assetList));
                        setMaxUserDebtUsd(await protocol.getMaximumPossibleUserDebtUsd(account[0], user, assetList));
                        setStakedUsd(await protocol.getUserCollateralUsd(account[0], user, assetList));
                    } else {
                        setUserAccountExists(false);
                    }
                } catch (e) {
                    Log.debug('failed to get user account', e);
                    setUserAccountExists(false);
                }
            } else if (connected && wallet?.connected && userAccountExists && protocol) {
                Log.debug('getting user account');
                // update user account
                var account = ((await protocol.getUserAccount(wallet?.publicKey)));
                setMaxUserDebtUsd(await protocol.getMaximumPossibleUserDebtUsd(account[0], userAccount, assetList));
                setUserDebtUsd(await protocol.getUserDebtUsd(account[0], userAccount, state, assetList));
                setRatio(await protocol.getUserCollateralRatio(account[0], userAccount, state, assetList));
                setStakedUsd(await protocol.getUserCollateralUsd(account[0], userAccount, assetList));
            }
        }

        if (!protocol) {
            setProtocolDefault();
        } else {
            getUser();
        }

        const interval = setInterval(() => setTime(Date.now()), 5000);

        return () => {
            clearInterval(interval);
        };
        // eslint-disable-next-line
    }, [
        connected,
        time
    ]);

    const toggleDrawer = () => {
        setOpen(!open);
    };

    var synthetics = getSynthetics(network);

    return (
        <div className="wrap dapp">
            <Box className='mobile-only-flex'>
                <Drawer variant="permanent" open={open}>
                    <div className='navbar-background'>
                        <div className="brand dapp w-nav-brand inline-div" style={{ width: "100%" }}>
                            <img width="28" height="28" src="https://uploads-ssl.webflow.com/60b35c8cd73f399dc4a8d8b9/60b370df8e7b7a8633e75b16_FABLOGO_TRANS192.png" loading="lazy" alt="FABRIC Logo" style={{ marginLeft: "11px" }} />
                            {(open) ? <div className="fabric-text">FABRIC</div> : <></>}
                            <a href="#" className="menu-button-2 menu-button-icon" onClick={toggleDrawer}>
                                <MenuOpenRounded className="w-icon-nav-menu" width="24px" height="24px" />
                            </a>
                        </div>
                    </div>

                    <div className={"dapp-navbar-section-heading navbar-background " + (open ? "" : "display-none")}>Synthetics</div>
                    <List className="navbar-background">
                        <Tooltip title='Stake' followCursor>
                            <a className={"dapp-nav-link active-text"} href={"/#"}  target=''>
                                <div className="icon w-clearfix">
                                    <VerticalAlignBottomIcon className="icon" />
                                </div>
                                {open ? <div>Stake</div> : <></>}
                            </a>
                        </Tooltip>  
                        <Tooltip title='Swap' followCursor>
                            <a className={"dapp-nav-link inactive-text"} href={"/#"} target='' onClick={handleOpenSwap}>
                                <div className="icon w-clearfix">
                                    <CurrencyExchangeRounded className="icon" />
                                </div>
                                {open ? <div>Swap</div> : <></>}
                            </a>
                        </Tooltip>
                        <Tooltip title='Analytics (coming soon)' followCursor>
                            <a className={"dapp-nav-link disabled "} href={"/#"} target=''>
                                <div className="icon w-clearfix">
                                    <AssessmentRounded className="icon" />
                                </div>
                                {open ? <div>Analytics</div> : <></>}
                            </a>
                        </Tooltip>
                    </List>
                    <div className={"dapp-navbar-section-heading navbar-background " + (open ? "" : "display-none")}>Ecosystem</div>
                    <List className="navbar-background" style={{ height: "100%" }}>
                        {ecosystemMenuLinks.map((menuLink, index) => (
                            menuLink.disabled ?
                                <Tooltip title={`${menuLink.name} (coming soon)`} followCursor>
                                    <a className={"dapp-nav-link inactive-text" + (menuLink.disabled ? " disabled" : "")} href={menuLink.link} target={menuLink.external ? '_blank' : ''}>
                                        <div className="icon w-clearfix">
                                            {menuLink.icon}
                                        </div>
                                        {open ? <div>{menuLink.name}</div> : <></>}
                                    </a>
                                </Tooltip>
                                :
                                <Tooltip title={menuLink.name} followCursor>
                                    <a className={"dapp-nav-link inactive-text" + (menuLink.disabled ? " disabled" : "")} href={menuLink.link} target={menuLink.external ? '_blank' : ''}>
                                        <div className="icon w-clearfix">
                                            {menuLink.icon}
                                        </div>
                                        {open ? <div>{menuLink.name}</div> : <></>}
                                    </a>
                                </Tooltip>
                        ))}
                    </List>
                    <div className={"side-nav-bottom-block " + (open ? "" : "display-none")}>
                        <div className="dapp-navbar-section-heading">Me</div>
                        <a className="dapp-nav-link">
                            <div className='left-aligned'>
                                Debt: 
                            </div>
                            <div className='right-aligned'>
                                {userAccountExists && connected && userDebtUsd !== undefined ? `$${formatPriceNumber.format(userDebtUsd)}` : "N/A"}
                            </div>
                        </a>
                        <a className="dapp-nav-link">
                            <div className='left-aligned'>
                                C-Ratio: 
                            </div>
                            <div className='right-aligned'>
                                {userAccountExists && connected && cRatio !== undefined ? `${cRatio.toFixed(2)}` : "N/A"}
                            </div>
                        </a>
                        <a className="dapp-nav-link">
                            <div className='left-aligned'>
                                Staked: 
                            </div>
                            <div className='right-aligned'>
                                {userAccountExists && connected && stakedUsd !== undefined ? `$${formatPriceNumber.format(stakedUsd)}` : "N/A"}
                            </div>
                        </a>
                    </div>
                </Drawer>
                <Box component="main" sx={{ flexGrow: 1 }}>
                    <Navbar
                        currentPage={children ? 'Diagnostics' : 'Stake'}
                        protocol={protocol}
                        toggleDrawer={toggleDrawer}
                    />

                    <div className="dapp-content-wrapper">
                        {children 
                            ? children 
                            : <Stakepage
                                bannerMessage="This dApp has been audited."
                                programId=""
                                protocol={protocol}
                                userAccountExists={userAccountExists}
                                userAccount={userAccount}
                                state={state}
                                assetList={assetList}
                                currentSlot={currentSlot}
                                userDebtUsd={userDebtUsd}
                                maxUserDebtUsd={maxUserDebtUsd}
                                cRatio={cRatio}
                            />}
                        {openSwap 
                            ? <SwapModal 
                                tokenList={synthetics}
                                initialTokenAIndex={0}
                                initialTokenBIndex={1} 
                                open={openSwap}
                                onClose={handleCloseSwap}
                                protocol={protocol} />
                            : <></>}
                    </div>
                </Box>
            </Box>
        </div>
    )
}

export const openedMixin = (theme: any): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
    backgroundColor: 'black',
    border: '1px solid #292929',
});

export const closedMixin = (theme: any): CSSObject => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    backgroundColor: 'black',
    [theme.breakpoints.down('sm')]: {
        width: `0px`,
    },
    [theme.breakpoints.up('sm')]: {
        width: `80px`,
    },
    border: '1px solid #292929'
});

export const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        backgroundColor: 'transparent',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);