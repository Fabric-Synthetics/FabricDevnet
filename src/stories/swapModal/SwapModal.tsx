import { CloseRounded } from "@mui/icons-material";
import { Box, Grid } from "@mui/material";
import { Backdrop, style, StyledModal } from "../../styles";
import { InputField } from "../inputField/InputField";
import './swapModal.css';
import { useConnectedWallet, useSolana } from "@saberhq/use-solana";
import { Protocol, TransactionBuilder } from "@fabric-foundation/sdk";
import { useEffect, useState } from "react";
import { AccountLayout, ASSOCIATED_TOKEN_PROGRAM_ID, Token, TOKEN_PROGRAM_ID, u64 } from "@solana/spl-token";
import { PublicKey, Transaction, TransactionInstruction } from "@solana/web3.js";
import BN from "bn.js";
import { formatPriceNumber, getAssociatedAddress, handleError } from "../../utils";
import { toast } from "react-toastify";
import { Button } from "../button/Button";
import { parsePriceData } from '@pythnetwork/client';
import { SwapButton } from "../swapButton/SwapButton";
import { SymbolDetails } from "../../interfaces/SymbolDetails";

interface SwapModalProps {
    tokenList: SymbolDetails[];
    initialTokenAIndex: number;
    initialTokenBIndex: number;
    open: boolean;
    onClose: () => void;
    protocol?: Protocol;
}

export const SwapModal = ({
    tokenList,
    initialTokenAIndex,
    initialTokenBIndex,
    open,
    onClose,
    protocol
}: SwapModalProps) => {

    const { connected, connection, network } = useSolana();
    const wallet = useConnectedWallet();
    const [loadingSwap, setLoadingSwap] = useState(false);
    const [subscribed, setSubscribed] = useState(false);
    const [time, setTime] = useState(Date.now());
    const [loadingText, setLoadingText] = useState("");

    // token A details
    const [tokenAIndex, setTokenAIndex] = useState(initialTokenAIndex);
    const [tokenABalance, setTokenABalance] = useState(0.0);
    const [tokenAPrice, setTokenAPrice] = useState(0.0);
    const [tokenA, setTokenA] = useState<SymbolDetails>(tokenList[initialTokenAIndex]);
    
    // token B details
    const [tokenBIndex, setTokenBIndex] = useState(initialTokenBIndex);
    const [tokenBBalance, setTokenBBalance] = useState(0.0);
    const [tokenBPrice, setTokenBPrice] = useState(0.0);
    const [tokenB, setTokenB] = useState<SymbolDetails>(tokenList[initialTokenBIndex]);

    // subscription ids
    const [tokenAPriceSubId, setTokenAPriceSubId] = useState(0);
    const [tokenBPriceSubId, setTokenBPriceSubId] = useState(0);
    const [tokenABalanceSubId, setTokenABalanceSubId] = useState(0);
    const [tokenBBalanceSubId, setTokenBBalanceSubId] = useState(0);
    
    var tokenAElement = (document.getElementById("input-field-amount-token-a"));
    var tokenBElement = (document.getElementById("input-field-amount-token-b"));

    // @ts-expect-error
    var parsedTokenAValue: number = tokenAElement ? isNaN(parseFloat(tokenAElement.value)) ? 0 : parseFloat(tokenAElement.value) : 0;
    // @ts-expect-error
    var parsedTokenBValue: number = tokenBElement ? isNaN(parseFloat(tokenBElement.value)) ? 0 : parseFloat(tokenBElement.value) : 0;

    var livePriceBadge = `1 ${tokenB.name} <-> ${(tokenA.mint === tokenB.mint) ? 1 : (tokenBPrice/tokenAPrice).toFixed(4)} ${(tokenA.name)}`;
    var swapPreviewText = `Swapping ${formatPriceNumber.format(parsedTokenAValue)} ${(tokenA.name)} for ${formatPriceNumber.format(parsedTokenBValue)} ${(tokenB.name)}`;
    
    // react to change on input b
    function updateInputFieldBValue() {
        tokenAElement = document.getElementById('input-field-amount-token-a');
        tokenBElement = document.getElementById('input-field-amount-token-b');
        // @ts-expect-error
        var inputAValue = Number.isNaN(parseFloat(tokenAElement.value)) ? 0 : parseFloat(tokenAElement.value);

        // convert token a to usd
        var inputAValueUSD = inputAValue * tokenAPrice;
        
        // TODO: add fee
        inputAValueUSD = inputAValueUSD - (inputAValueUSD * 0.005);

        var inputBTokens = inputAValueUSD / tokenBPrice; 

        // update value
        // @ts-expect-error
        tokenBElement.value = inputBTokens.toFixed(tokenB.displayDecimals);
    } 

    // react to change on input a
    function updateInputFieldAValue() {
        tokenAElement = document.getElementById('input-field-amount-token-a');
        tokenBElement = document.getElementById('input-field-amount-token-b');
        // @ts-expect-error
        var inputBValue = Number.isNaN(parseFloat(tokenBElement.value)) ? 0 : parseFloat(tokenBElement.value);

        // convert token b to usd
        var inputBValueUSD = inputBValue * tokenBPrice;

        // TODO: add fee
        inputBValueUSD = inputBValueUSD + (inputBValueUSD * 0.005);

        // convert to token
        var inputATokens = inputBValueUSD * tokenAPrice;

        // update value
        // @ts-expect-error
        tokenAElement.value = inputATokens.toFixed(tokenA.displayDecimals);
    } 

    // update token A index
    function updateTokenA(value: any) {
        // find index of symbol
        var index = tokenList.findIndex(x => x.name === value);

        // update index
        setTokenAIndex(index);
        setTokenA(tokenList[index]);
    }

    // update token B index
    function updateTokenB(value: any) {
        // find index of symbol
        var index = tokenList.findIndex(x => x.name === value);

        // update index
        setTokenBIndex(index);
        setTokenB(tokenList[index]);
    }

    // subscribe to token A
    async function subscribeTokenA(index: number) {
        if (wallet) {
            var token = tokenList[index];
            var associatedAddressA = await Token.getAssociatedTokenAddress(
                ASSOCIATED_TOKEN_PROGRAM_ID, 
                TOKEN_PROGRAM_ID, 
                new PublicKey(token.mint), 
                new PublicKey(wallet.publicKey)
            );

            var aBalanceId = connection.onAccountChange(associatedAddressA, handleBalanceA, 'singleGossip');
            setTokenABalanceSubId(aBalanceId);

            if (!token.isFixed && token.priceFeed) {
                // subscribe to price feed
                var aPriceId = connection.onAccountChange(new PublicKey(token.priceFeed), (change) => {
                    var priceData = parsePriceData(change.data);
                    var scaledPrice = Number(priceData.aggregate.priceComponent) * 10 ** priceData.exponent;
                    setTokenAPrice(token.isUsdQuote ? scaledPrice : 1 / scaledPrice);
                }, 'single');
                setTokenAPriceSubId(aPriceId);

                // fetch initial price
                var aPriceInfo = await connection.getAccountInfo(new PublicKey(token.priceFeed));
                if (aPriceInfo) {
                    var priceData = parsePriceData(aPriceInfo.data);
                    var scaledPrice = Number(priceData.aggregate.priceComponent) * 10 ** priceData.exponent;
                    setTokenAPrice(token.isUsdQuote ? scaledPrice : 1 / scaledPrice);
                }

            } else {
                setTokenAPrice(1);
            }
        }
    }

    // subscribe to token B
    async function subscribeTokenB(index: number) {
        if (wallet) {
            var token = tokenList[index];
            var associatedAddressB = await Token.getAssociatedTokenAddress(
                ASSOCIATED_TOKEN_PROGRAM_ID, 
                TOKEN_PROGRAM_ID, 
                new PublicKey(token.mint), 
                new PublicKey(wallet.publicKey)
            );

            var bBalanceId = connection.onAccountChange(associatedAddressB, handleBalanceB, 'singleGossip');
            setTokenBBalanceSubId(bBalanceId);

            if (!token.isFixed && token.priceFeed) {
                // subscribe to price feed
                var bPriceId = connection.onAccountChange(new PublicKey(token.priceFeed), (change) => {
                    var priceData = parsePriceData(change.data);
                    var scaledPrice = Number(priceData.aggregate.priceComponent) * 10 ** priceData.exponent;
                    setTokenBPrice(token.isUsdQuote ? scaledPrice : 1 / scaledPrice);
                }, 'single');
                setTokenBPriceSubId(bPriceId);

                // fetch initial price
                var bPriceInfo = await connection.getAccountInfo(new PublicKey(token.priceFeed));
                if (bPriceInfo) {
                    var priceData = parsePriceData(bPriceInfo.data);
                    var scaledPrice = Number(priceData.aggregate.priceComponent) * 10 ** priceData.exponent;
                    setTokenBPrice(token.isUsdQuote ? scaledPrice : 1 / scaledPrice);
                }
            } else {
                setTokenBPrice(1);
            }
        }
    }

    // unsubscribe from token A
    async function unsubscribeTokenA() {
        if (tokenABalanceSubId !== 0) {
            try {
                await connection.removeAccountChangeListener(tokenABalanceSubId);
            } catch {}

            setTokenABalanceSubId(0);
        }

        if (tokenAPriceSubId !== 0) {
            try {
                await connection.removeAccountChangeListener(tokenAPriceSubId);
            } catch {}

            setTokenAPriceSubId(0);
        }
    }

    // unsubscribe from token B
    async function unsubscribeTokenB() {
        if (tokenBBalanceSubId !== 0) {
            try {
                await connection.removeAccountChangeListener(tokenBBalanceSubId);
            } catch {}
            setTokenBBalanceSubId(0);
        }

        if (tokenBPriceSubId !== 0) {
            try {
                await connection.removeAccountChangeListener(tokenBPriceSubId);
            } catch {}
            setTokenBPriceSubId(0);
        }
    }

    // handle token A balance change
    function handleBalanceA(change: any) {
        var buffer = Buffer.from(change.data)       
        var data = AccountLayout.decode(buffer);
        var scaledBalance = u64.fromBuffer(data.amount).toNumber();
        var decimals = tokenA.decimals;
        var balance = scaledBalance / (10 ** decimals);
        setTokenABalance(balance);
    }

    // handle token B balance change
    function handleBalanceB(change: any) {
        var buffer = Buffer.from(change.data)       
        var data = AccountLayout.decode(buffer);
        var scaledBalance = u64.fromBuffer(data.amount).toNumber();
        var decimals = tokenB.decimals;
        var balance = scaledBalance / (10 ** decimals);
        setTokenBBalance(balance);
    }

    // fetch token A balance
    async function fetchTokenABalance(index: number) {
        if (connected && wallet && protocol) {
            var token = tokenList[index];
            // fetch accounts
            var associatedAddressA = await getAssociatedAddress(new PublicKey(token.mint), wallet.publicKey);
            // fetch balances
            var balanceA = await protocol.getAccountBalance(associatedAddressA);
            // update balances
            setTokenABalance(balanceA);
        }
    } 

    // fetch token B balance
    async function fetchTokenBBalance(index: number) {
        if (connected && wallet && protocol) {
            var token = tokenList[index];
            // fetch accounts
            var associatedAddressB = await getAssociatedAddress(new PublicKey(token.mint), wallet.publicKey);
            // fetch balances
            var balanceB = await protocol.getAccountBalance(associatedAddressB);
            // update balances
            setTokenBBalance(balanceB);
        }
    } 

    // update UI
    useEffect(() => {
        // @ts-expect-error
        parsedTokenAValue = tokenAElement ? isNaN(parseFloat(tokenAElement.value)) ? 0 : parseFloat(tokenAElement.value) : 0;
        // @ts-expect-error
        parsedTokenBValue = tokenBElement ? isNaN(parseFloat(tokenBElement.value)) ? 0 : parseFloat(tokenBElement.value) : 0;

        if (!subscribed && wallet && connected) {
            subscribeTokenA(tokenAIndex);
            subscribeTokenB(tokenBIndex);
            setSubscribed(true);
        }

        const interval = setInterval(() => setTime(Date.now()), 500);

        return () => clearInterval(interval);
    });

    // on mount
    useEffect(() => {
        fetchTokenABalance(tokenAIndex);
        fetchTokenBBalance(tokenBIndex);
    }, [connected, subscribed, wallet]);

    // refresh token A subscriptions
    useEffect(() => {
        // unsubscribe from previous token account changes
        // subscribe to new token account changes
        // fetch and update balance handled by use effect
        setTokenABalance(0);
        setTokenAPrice(0);
        unsubscribeTokenA()
            .then(() => subscribeTokenA(tokenAIndex)
            .then(() => fetchTokenABalance(tokenAIndex)));

    }, [tokenAIndex, connected]);

    // refresh token B subscriptions
    useEffect(() => {
        // unsubscribe from previous token account changes
        // subscribe to new token account changes
        // fetch and update balance handled by use effect
        setTokenBBalance(0);
        setTokenBPrice(0);
        unsubscribeTokenB()
            .then(() => subscribeTokenB(tokenBIndex)
            .then(() => fetchTokenBBalance(tokenBIndex)));
    }, [tokenBIndex, connected]);

    async function swap() {
        if (protocol && wallet) {
            setLoadingSwap(true);
            var builder = new TransactionBuilder(protocol.connection, wallet.publicKey);
            builder = await builder.addCreateTokenAccountIfNotExists(new PublicKey(tokenA.mint));
            builder = await builder.addCreateTokenAccountIfNotExists(new PublicKey(tokenB.mint));

            // try swap
            try {
                var swapIx = await protocol.swapIx(
                    new BN(parsedTokenAValue * 10 ** (tokenA.decimals)),
                    wallet.publicKey,
                    new PublicKey(tokenA.mint),
                    new PublicKey(tokenB.mint),
                    await protocol.getAssociatedTokenAccount(new PublicKey(tokenA.mint), wallet.publicKey),
                    await protocol.getAssociatedTokenAccount(new PublicKey(tokenB.mint), wallet.publicKey)
                );
                builder = builder.add(swapIx);
                toast.info('Swapping tokens...');

                // sign transaction
                setLoadingText("Signing transaction...");
                var signedTx = await builder.buildAndSign(wallet);
                
                // confirm transaction
                setLoadingText("Confirming transaction...");
                var sig = await builder.sendAndConfirm(signedTx.serialize());

                // create notification
                toast.success(<div>{"Swap successful. "}<a href={`https://solscan.io/tx/${sig}?cluster=${network}`} target='_blank'>{"TX: " + sig.slice(0, 8)}</a></div>);
                setLoadingText("");
                setLoadingSwap(false);

                onClose();
            } catch (e) {
                handleError(e);
                setLoadingText("");
                setLoadingSwap(false);
            }
        }
        setLoadingSwap(false);
    }

    return (
        <StyledModal
            aria-labelledby="unstyled-modal-title"
            aria-describedby="unstyled-modal-description"
            open={open}
            onClose={onClose}
            BackdropComponent={Backdrop}
        >
            <Box sx={style} className='no-outline-on-focus'>
                <Grid container sm={12} spacing={0}>
                    <Grid item sm={11}>
                        <div className="panel-title-text">
                            Swap
                        </div>
                    </Grid>
                    <Grid item sm={1} className="panel-close-button-container pin-right scale-up-on-hover clickable" onClick={onClose}>
                        <CloseRounded />
                    </Grid>
                    <InputField
                        placeholderText={'Amount to swap'}
                        symbolIconUrl={tokenA.logoUrl}
                        symbolName={tokenA.name}
                        symbolPrice={tokenAPrice}
                        maxValue={tokenABalance}
                        maxValueLabel={'Balance'}
                        connected={connected}
                        step={0.0001}
                        min={0.01}
                        inputFieldId='input-field-amount-token-a'
                        className='input-field-amount-token-a input-field'
                        onChange={updateInputFieldBValue}
                        assetList={tokenList}
                        onSelection={updateTokenA}
                        displayDecimals={tokenA.displayDecimals}
                    />
                    <SwapButton onClick={() => {
                        setTokenAIndex(tokenBIndex);
                        setTokenA(tokenList[tokenBIndex]);
                        setTokenBIndex(tokenAIndex);
                        setTokenB(tokenList[tokenAIndex]);
                        
                        // @ts-expect-error
                        var inputAValue = document.getElementById('input-field-amount-token-a').value;
                        // @ts-expect-error
                        var inputBValue = document.getElementById('input-field-amount-token-b').value;
                        // @ts-expect-error
                        document.getElementById('input-field-amount-token-b').value = inputAValue;
                        // @ts-expect-error
                        document.getElementById('input-field-amount-token-a').value = inputBValue;
                    }} />
                    <InputField
                        placeholderText={'Amount to swap to'}
                        symbolIconUrl={tokenB.logoUrl}
                        symbolName={tokenB.name}
                        symbolPrice={tokenBPrice}
                        maxValue={tokenBBalance}
                        maxValueLabel={'Balance'}
                        connected={connected}
                        step={0.0001}
                        min={0.01}
                        inputFieldId='input-field-amount-token-b'
                        className='input-field-amount-token-b input-field'
                        onChange={updateInputFieldAValue}
                        assetList={tokenList}
                        onSelection={updateTokenB}
                        displayDecimals={tokenB.displayDecimals}
                    />
                </Grid>
                <Grid container sm={12} spacing={0}>
                    <Grid item sm={8}>
                        <div className='panel-live-price-badge'>
                            <div className='panel-live-price-badge-text'>
                                {livePriceBadge}
                            </div>
                        </div>
                    </Grid>
                    <Grid item sm={4}>
                        <div className='panel-live-fee-badge'>
                            <div className='panel-live-fee-badge-text'>
                                0.5% fee
                            </div>
                        </div>
                    </Grid>
                </Grid>
                <div className='divider'></div>
                <Grid item sm={12}>
                    <div className='panel-conversion-text' id='panel-conversion-text'>
                        {swapPreviewText}
                    </div>
                </Grid>
                <Grid item sm={12}>
                    <Button
                        onClick={swap}
                        label='Swap'
                        height={44}
                        loading={loadingSwap}
                        loadingText={loadingText}
                    />
                </Grid>
            </Box>
        </StyledModal>
    );
}