import './assetPanel.css';
import 'react-toastify/dist/ReactToastify.css';
import { useConnectedWallet, useSolana } from "@saberhq/use-solana";
import { IAssetList, IState, IUser, Logger, Protocol, TransactionBuilder } from '@fabric-foundation/sdk'
import { PublicKey, Transaction } from "@solana/web3.js";
import { Token, ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, AccountLayout, u64 } from "@solana/spl-token";
import BN from 'bn.js';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { handleError, getAssociatedAddress, formatPriceNumber, formatNumber } from '../../../utils';
import { CollateralManagementPanel } from '../collateralManagementPanel/CollateralManagementPanel';
import { SwapModal } from '../../swapModal/SwapModal';
import { SymbolDetails } from "../../../interfaces/SymbolDetails";
import { getSynthetics } from '../../../tokens/synthetics';

const Log = Logger.from('ui/asset-panel');

export const AssetPanel = ({
    variant,
    collateralInfo,
    syntheticInfo,
    protocol,
    user,
    state,
    assetList,
    userDebtUsd,
    maxUserDebtUsd,
    cRatio
}: AssetPanelProps) => {

    const { connected, network } = useSolana();
    const wallet = useConnectedWallet();
    const [staked, setStaked] = useState(0.0);
    const [mintable, setMintable] = useState(0.0);
    const [tokenBalance, setTokenBalance] = useState(0.0);
    const [time, setTime] = useState(Date.now());
    const [tvlOrMc, setTvlOrMc] = useState(0.0);
    const [cRatioOrTotalSupply, setCRatioOrTotalSupply] = useState(0.0);
    const [price, setPrice] = useState(0);
    const [loadingText, setLoadingText] = useState("");

    // stake mint panel
    const [openStakeMintPanel, setOpenStakeMintPanel] = useState(false);
    const handleOpenStakeMintPanel = () => setOpenStakeMintPanel(true);
    const handleCloseStakeMintPanel = () => setOpenStakeMintPanel(false);

    // unstake burn panel
    const [openUnstakeBurnPanel, setOpenUnstakeBurnPanel] = useState(false);
    const handleOpenUnstakeBurnPanel = () => setOpenUnstakeBurnPanel(true);
    const handleCloseUnstakeBurnPanel = () => setOpenUnstakeBurnPanel(false);
    
    const [loadingUnstakeBurn, setLoadingUnstakeBurn] = useState(false);
    const [loadingStakeMint, setLoadingStakeMint] = useState(false);
    const [subscribed, setSubscribed] = useState(false);

    async function handleAction(actionType: ActionType, amount: number) {
        if (wallet && connected && protocol) {
            var txBuilder = new TransactionBuilder(protocol.connection, wallet.publicKey);

            // update state
            await protocol.getState();

            // check users account exists
            if (!(await protocol.checkIfUserAccountExists(wallet.publicKey))) {
                var createUserIx = await protocol.createUserAccountIx(wallet.publicKey);
                txBuilder = txBuilder.add(createUserIx);
            }
            var userAccount = await protocol.getUserAccount(wallet.publicKey);
            
            // create account if not exists
            // @ts-ignore
            var mint = new PublicKey((variant === "collateral" ? collateralInfo.mint : syntheticInfo.mint));
            txBuilder = await txBuilder.addCreateTokenAccountIfNotExists(mint);
            var associatedAddress = await getAssociatedAddress(mint, wallet.publicKey);
            
            switch (actionType) {
                case ActionType.Deposit:
                    console.log("Deposit");
                    var depositIx = await protocol.depositCollateralIx(
                        new BN(amount * 1e9),
                        userAccount[0],
                        // @ts-ignore
                        new PublicKey(collateralInfo.reserve),
                        // @ts-ignore
                        associatedAddress,
                        wallet.publicKey
                    );
                    txBuilder = txBuilder.add(depositIx);
                    break;
                case ActionType.Mint:
                    console.log("Mint");
                    var mintIx = await protocol.mintIx(
                        new BN(amount * 1e8),
                        wallet.publicKey,
                        // @ts-ignore
                        associatedAddress,
                        userAccount[0]
                    );
                    txBuilder = txBuilder.add(mintIx);
                    break;
                case ActionType.Withdraw:
                    console.log("Withdraw");
                    var withdrawIx = await protocol.withdrawCollateralIx(
                        new BN(amount * 1e9),
                        userAccount[0],
                        // @ts-ignore
                        new PublicKey(collateralInfo.reserve),
                        // @ts-ignore
                        associatedAddress,
                        wallet.publicKey
                    );
                    txBuilder = txBuilder.add(withdrawIx);
                    break;
                case ActionType.Burn:
                    console.log("Burn");
                    let burnIx = await protocol.burnIx(
                        new BN(amount * 1e8),
                        wallet.publicKey,
                        // @ts-ignore
                        associatedAddress,
                        userAccount[0]
                    );
                    txBuilder = txBuilder.add(burnIx);
                    break;
            }

            // build transaction
            var tx = await txBuilder.build();

            // sign transaction
            setLoadingText("Signing transaction...");
            var signedTx = await wallet.signTransaction(tx);
            // broadcast transaction
            var sig = await protocol.connection.sendRawTransaction(signedTx.serialize());
            // confirm transaction
            setLoadingText("Confirming transaction...");
            await protocol.connection.confirmTransaction(sig, 'confirmed');

            // create notification
            setLoadingText("");
            toast.success(<div>{"TX successful. "}<a href={`https://solscan.io/tx/${sig}?cluster=${network}`} target='_blank'>{"TX: " + sig.slice(0, 8)}</a></div>);

            handleCloseUnstakeBurnPanel();
            handleCloseStakeMintPanel();         
        }
    }

    async function action(variant: string, stakeMint: boolean) {
        // @ts-expect-error
        var value = document.getElementById("input-field-amount").value;
        var amount = parseFloat(value);
        if (amount === NaN || amount <= 0) {
            toast.error("The amount entered was not valid. Please try again.");
            setLoadingText("");
            return;
        } else if (wallet && connected && protocol) {
            setLoadingStakeMint(true);
            setLoadingUnstakeBurn(true);
            await protocol.getState();

            try {
                if (variant === "collateral" && stakeMint) {
                    await handleAction(ActionType.Deposit, amount);
                } else if (variant !== "collateral" && stakeMint) {
                    await handleAction(ActionType.Mint, amount);
                } else if (variant === "collateral" && !stakeMint) {
                    await handleAction(ActionType.Withdraw, amount);
                } else if (variant !== "collateral" && !stakeMint) {
                    await handleAction(ActionType.Burn, amount);
                }
            } catch (e) {
                console.log(e);
                handleError(e);
            }

            setLoadingText("");
        }

        setLoadingStakeMint(false);
        setLoadingUnstakeBurn(false);
    }

    useEffect(() => {
        async function fetchBalance() {
            if (connected && wallet && protocol) {
                Log.debug("Fetching balance...");
                
                // fetch account
                var associatedAddress = await Token.getAssociatedTokenAddress(
                    ASSOCIATED_TOKEN_PROGRAM_ID,
                    TOKEN_PROGRAM_ID,
                    new PublicKey(collateralInfo ? collateralInfo.mint : syntheticInfo ? syntheticInfo.mint : ''),
                    new PublicKey(wallet.publicKey)
                );

                // fetch balance
                var balance = await protocol.getAccountBalanceForMint(associatedAddress);
                // update balance
                setTokenBalance(balance);
                return balance;
            }
        }

        async function balanceUpdate(update: any) {    
            Log.debug("Balance update...");

            var buffer = Buffer.from(update.data);   
            var data = AccountLayout.decode(buffer);
            var scaledBalance = u64.fromBuffer(data.amount).toNumber();
            var decimals = collateralInfo !== undefined ? collateralInfo.decimals : syntheticInfo !== undefined ? syntheticInfo.decimals : 8;
            var balance = scaledBalance / (10 ** decimals);
            setTokenBalance(balance);
        }

        async function subscribe() {
            if (protocol && wallet) {
                Log.debug("Subscribing to balance updates...");

                var mint = collateralInfo ? collateralInfo.mint : syntheticInfo ? syntheticInfo.mint : '';
                var associatedAddress = await Token.getAssociatedTokenAddress(
                    ASSOCIATED_TOKEN_PROGRAM_ID,
                    TOKEN_PROGRAM_ID,
                    new PublicKey(mint),
                    new PublicKey(wallet.publicKey)
                );

                protocol.connection.onAccountChange(
                    associatedAddress,
                    balanceUpdate,
                    'single'
                );
                setSubscribed(true);
            }
        }

        if (!subscribed) {
            fetchBalance();
            subscribe();
        }
    }, [ user, protocol, connected ]);

    useEffect(() => {
        async function getStaked() {
            if (connected && wallet && protocol && collateralInfo && user) {
                Log.debug("Fetching staked amount...");

                const userCollaterals = user.userCollaterals;
                var collateral = userCollaterals.find(x => x.collateralMintAddress.toString() === collateralInfo.mint);
                if (collateral != undefined) {
                    var amountStaked;
                    try {
                        amountStaked = collateral.amount.toNumber() / 1e9;
                    } catch {
                        amountStaked = collateral.amount.div(new BN(1e9)).toNumber();
                    }
                    setStaked(amountStaked);
                }
            }
        }

        // TODO: refactor and add SDK method
        async function getMintable() {
            if (connected && wallet && syntheticInfo && protocol) {
                Log.debug("Fetching mintable amount...");

                var userAccount = await protocol.getUserAccount(wallet.publicKey);
                var maxUserDebt = await protocol.getMaximumPossibleUserDebtUsd(userAccount[0], user, assetList);
                var currentUserDebt = await protocol.getUserDebtUsd(userAccount[0], user, state, assetList);
                var availableBalanceInUsd = maxUserDebt - currentUserDebt;
                setMintable(availableBalanceInUsd > 0 ? availableBalanceInUsd : 0);
            }
        }

        async function getTVLAndCRatio() {
            if (connected && wallet && syntheticInfo && protocol) {
                Log.debug("Fetching TVL and CRatio...");

                var synthInfo = await protocol.getSyntheticSupplyAndMarketCap(new PublicKey(syntheticInfo.mint), assetList, syntheticInfo.name === 'fUSD');
                setTvlOrMc(synthInfo.marketCap);
                setCRatioOrTotalSupply(synthInfo.supply)
            }
        }

        async function getMarketCapAndTotalSupply() {
            if (connected && wallet && collateralInfo && protocol) {
                Log.debug("Fetching market cap and total supply...");
                
                var collateralDetails = await protocol.getCollateralTvlAndCRatio(new PublicKey(collateralInfo.mint), assetList);
                setTvlOrMc(collateralDetails.collateralTvl);
                setCRatioOrTotalSupply(collateralDetails.collateralRatio);
            }
        }

        async function getPrice() {
            if (connected && wallet && protocol && assetList) {
                Log.debug("Fetching price...");

                // TODO: refactor to realtime price
                var mint = syntheticInfo ? syntheticInfo.mint : collateralInfo ? collateralInfo.mint : '';

                var synthetic = assetList.synthetics.find(x => x.assetAddress.toBase58() === mint);
                if (synthetic) {
                    if (syntheticInfo) {
                        if (syntheticInfo.name === 'fUSD') {
                            setPrice(1);
                        } else {
                            var asset = assetList.assets[synthetic.assetIndex];
                            var price = asset.price.val.toNumber() / 10 ** Math.abs(8);
                            setPrice(price);
                        }
                    }
                } else {
                    var collateral = assetList.collaterals.find(x => x.collateralMintAddress.toBase58() === mint);
                    if (collateral) {
                        var asset = assetList.assets[collateral.assetIndex];
                        var price = asset.price.val.toNumber() / 10 ** Math.abs(8);
                        setPrice(price);
                    } else {
                        console.log('No price found');
                    }
                }
            }
        }

        const interval = setInterval(() => setTime(Date.now()), 5000);


        if (user !== undefined) {
            if (variant === 'collateral') {
                getStaked();
            } else {
                getMintable();
            }
        }
        
        getMarketCapAndTotalSupply();
        getTVLAndCRatio();
        getPrice();

        return () => {
            clearInterval(interval);
        };
        // eslint-disable-next-line
    }, [
        connected,
        time,
        user
    ]);

    var synthetics = getSynthetics(network);
    var syntheticIndex = syntheticInfo && assetList
        ? synthetics.findIndex(x => x.mint === syntheticInfo.mint)
        : 0;
    syntheticIndex = syntheticIndex === -1 ? 0 : syntheticIndex;

    var mintDepositLabel = connected 
        ? (variant === "collateral" 
            ? `${formatPriceNumber.format(tokenBalance)} ${collateralInfo?.name}` 
            : `${formatNumber(mintable, syntheticInfo?.displayDecimals || 2)} ${syntheticInfo?.name}`) 
        : "N/A";
    
    var balanceString = connected
        ? (variant === "collateral"
            ? `${formatPriceNumber.format(staked)} ${collateralInfo?.name}`
            : `${formatNumber(tokenBalance, syntheticInfo?.displayDecimals || 2)} ${syntheticInfo?.name}`)
        : "N/A"

    return (
        <div className="outline" style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div className="inline-div">
                <img src={variant === "collateral" ? collateralInfo?.logoUrl : syntheticInfo?.logoUrl} width="32px" height="32px" />
                <h4 className="asset-panel-heading">{variant === "collateral" ? collateralInfo?.name : syntheticInfo?.name}</h4>
            </div>

            <div className="inline-div label-info" style={{ paddingTop: "20px" }}>
                <h4>Price</h4>
                <div style={{ marginLeft: "auto" }}>${formatNumber(price, 4)}</div>
            </div>

            <div className="inline-div label-info" style={{ paddingTop: "15px" }}>
                <h4>{variant === "collateral" ? "TVL" : "Market Cap"}</h4>
                <div style={{ marginLeft: "auto" }}>${formatPriceNumber.format(tvlOrMc)}</div>
            </div>

            <div className="inline-div label-info" style={{ paddingTop: "15px" }}>
                <h4>{variant === "collateral" ? "Minimum C-ratio" : "Supply"}</h4>
                <div style={{ marginLeft: "auto" }}>{formatPriceNumber.format(cRatioOrTotalSupply)}</div>
            </div>

            <div style={{ border: "1px solid", boxShadow: "0 0 4px 0 var(--primary)", marginTop: "24px", marginBottom: "24px" }}></div>
            {syntheticInfo && syntheticInfo?.name === 'fUSD' || collateralInfo ? 
                <div className="inline-div">
                    <div>
                        <div className="label-title">
                            {variant === "collateral" ? "Able to deposit" : syntheticInfo?.name === 'fUSD' ? "Able to mint" : 'Balance'}
                        </div>
                        <div className="label-normal">{mintDepositLabel}</div>
                    </div>
                    <a 
                        style={{ marginLeft: "auto" }} 
                        className={"action-button"} onClick={() => {
                            if (connected && wallet && protocol) {                              
                                handleOpenStakeMintPanel();
                            } else {
                                toast.error("Please connect your wallet before " + (variant === "collateral" ? "depositing." : "minting."));
                            }
                    }}>
                        {variant === "collateral" ? "Deposit" : "Mint"}
                    </a>
                    <CollateralManagementPanel
                        placeholderText={`${(variant === "collateral" ? "Deposit" : "Mint")} amount`}
                        panelTitle={variant === "collateral" ? "Deposit" : "Mint"}
                        symbolIconUrl={collateralInfo ? collateralInfo?.logoUrl : syntheticInfo ? syntheticInfo?.logoUrl : ''}
                        symbolName={collateralInfo ? collateralInfo?.name : syntheticInfo ? syntheticInfo?.name : ''}
                        price={price}
                        maxValue={(variant === "collateral") ? tokenBalance : mintable}
                        maxValueLabel={(variant === "collateral") ? 'Balance' : 'Max'}
                        connected={connected}
                        closePanel={handleCloseStakeMintPanel}
                        isPanelOpen={openStakeMintPanel}
                        buttonOnClickAction={async () => action(variant, true)}
                        buttonLabel={variant === "collateral" ? "Deposit" : "Mint"}
                        badgeLabel={variant === "collateral" ? "Depositing" : "Minting"}
                        isButtonLoading={loadingStakeMint}
                        loadingText={loadingText}
                        userDebtUsd={userDebtUsd}
                        maxUserDebtUsd={maxUserDebtUsd}
                        cRatio={cRatio}
                    />
                </div> : <></>}
            {syntheticInfo && syntheticInfo?.name === 'fUSD' || collateralInfo 
                ? <div style={{ border: "1px solid", boxShadow: "0 0 4px 0 var(--primary)", marginTop: "24px", marginBottom: "24px", opacity: "0.3" }}></div>
                : <></>}
            <div className="inline-div">
                <div>
                    <div className="label-title">
                        {variant === "collateral" ? "Deposited" : "Balance"}
                    </div>
                    <div className="label-normal">{balanceString}
                    </div>
                </div>
                <a 
                    style={{ marginLeft: "auto" }} 
                    className={"action-button" + (
                        syntheticInfo && syntheticInfo?.name === 'fUSD' && !user || syntheticInfo && syntheticInfo?.name === 'fUSD' && user && user.userDebtShares.toNumber() == 0 ? " disabled" : "")} 
                    onClick={() => {
                        if (connected && wallet && protocol) {
                            if (syntheticInfo && syntheticInfo?.name === 'fUSD' && !user || syntheticInfo && syntheticInfo?.name === 'fUSD' && user && user.userDebtShares.toNumber() == 0) {
                                return;
                            }    
                            handleOpenUnstakeBurnPanel();
                        } else {
                            toast.error("Please connect your wallet.");
                        }
                    }
                }>
                    {variant === "collateral"
                        ? "Withdraw"
                        : syntheticInfo?.name === 'fUSD' 
                            ? "Burn"
                            : "Swap"}
                </a>
                {syntheticInfo && syntheticInfo?.name === 'fUSD' || collateralInfo
                    ? 
                        <CollateralManagementPanel
                            placeholderText={`${(variant === "collateral" ? "Withdraw" : "Burn")} amount`}
                            panelTitle={variant === "collateral" ? "Withdraw" : "Burn"}
                            symbolIconUrl={collateralInfo ? collateralInfo?.logoUrl : syntheticInfo ? syntheticInfo?.logoUrl : ''}
                            symbolName={collateralInfo ? collateralInfo?.name : syntheticInfo ? syntheticInfo?.name : ''}
                            price={price}
                            maxValue={(variant === "collateral") ? staked : tokenBalance}
                            maxValueLabel={(variant === "collateral") ? 'Balance' : 'Max'}
                            connected={connected}
                            closePanel={handleCloseUnstakeBurnPanel}
                            isPanelOpen={openUnstakeBurnPanel}
                            buttonOnClickAction={async () => action(variant, false)}
                            buttonLabel={variant === "collateral" ? "Withdraw" : "Burn"}
                            badgeLabel={variant === "collateral" ? "Unstaking" : "Burning"}
                            isButtonLoading={loadingUnstakeBurn} 
                            loadingText={loadingText}
                            userDebtUsd={userDebtUsd}
                            maxUserDebtUsd={maxUserDebtUsd}
                            cRatio={cRatio}
                        />
                    : syntheticInfo && syntheticInfo?.name !== 'fUSD' 
                        ? openUnstakeBurnPanel 
                            ? <SwapModal 
                                tokenList={synthetics}
                                initialTokenAIndex={0}
                                initialTokenBIndex={syntheticIndex} 
                                open={openUnstakeBurnPanel}
                                onClose={handleCloseUnstakeBurnPanel}
                                protocol={protocol} /> 
                            : <></>
                        : <></>
                }
            </div>
        </div>
    );
};

interface AssetPanelProps {
    variant: 'collateral' | 'synthetics';
    collateralInfo?: CollateralInfo;
    syntheticInfo?: SyntheticInfo;
    protocol?: Protocol;
    user?: IUser;
    state?: IState;
    assetList?: IAssetList;
    synthetics: SymbolDetails[];
    userDebtUsd?: number;
    maxUserDebtUsd?: number;
    cRatio?: number;
};

export enum ActionType {
    Deposit = 1,
    Mint = 2,
    Withdraw = 3,
    Burn = 4
};

export interface CollateralInfo {
    logoUrl: string;
    name: string;
    tvlUsd: number;
    optimumCollateralRatio: number;
    mint: string;
    reserve: string;
    decimals: number;
};

export interface SyntheticInfo {
    logoUrl: string;
    name: string;
    marketCapUsd?: number;
    totalSupply?: number;
    mint: string;
    decimals: number;
    displayDecimals: number;
};