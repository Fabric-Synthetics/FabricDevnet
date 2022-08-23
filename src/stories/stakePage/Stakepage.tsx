import { Container, Grid, Tooltip } from '@mui/material';
import './stakepage.css';
import { Badge } from '../badge/Badge';
import { AssetPanel } from '../panels/assetPanel/AssetPanel';
import { DonutLargeRounded, PaymentRounded, StarRounded } from '@material-ui/icons';
import { useConnectedWallet, useSolana } from '@gokiprotocol/walletkit';
import { useEffect, useState } from 'react';
import { Protocol, TransactionBuilder } from '@fabric-foundation/sdk'
import { PublicKey } from "@solana/web3.js";
import { IAssetList, IState, IUser } from '@fabric-foundation/sdk/dist/synths';
import { getAssociatedAddress, handleError, formatPriceNumber, formatPriceNumberScaled } from '../../utils';
import { toast } from 'react-toastify';
import { BorderLinearProgress, HtmlTooltip } from '../../styles';
import { Button } from '../button/Button';
import { getCollaterals } from '../../tokens/collaterals';
import { getSynthetics } from '../../tokens/synthetics';

interface StakepageProps {
    programId: string;
    bannerMessage?: string;
    protocol?: Protocol;
    userAccountExists: boolean;
    userAccount?: IUser;
    state?: IState;
    assetList?: IAssetList;
    currentSlot?: number;
    userDebtUsd?: number;
    maxUserDebtUsd?: number;
    cRatio?: number;
}

export const Stakepage = ({
    programId,
    bannerMessage,
    protocol,
    userAccountExists,
    userAccount,
    state,
    assetList,
    currentSlot,
    userDebtUsd,
    maxUserDebtUsd,
    cRatio
}: StakepageProps) => {

    const { connected, network } = useSolana();
    const wallet = useConnectedWallet();

    const [rewardsLabelTime, setRewardsLabelTime] = useState(Date.now());
    const [usersCurrentEpochRewards, setUsersCurrentEpochRewards] = useState(0);
    const [usersNextEpochRewards, setUsersNextEpochRewards] = useState(0);
    const [withdrawable, setWithdrawable] = useState(0);
    const [claimable, setClaimable] = useState(0);
    const [apr, setApr] = useState(0);
    const [apy, setApy] = useState(0);

    const [epochProgress, setEpochProgress] = useState(0);
    const [timeRemaining, setTimeRemaining] = useState("0d0h0m0s");

    const [loadingClaim, setLoadingClaim] = useState(false);
    const [loadingWithdraw, setLoadingWithdraw] = useState(false);

    var banner = (bannerMessage !== undefined) ?
        <div className="info-banner">
            <div className="info-banner-text">
                {bannerMessage}
            </div>
        </div> :
        <></>;
    var collateralPanels: any[] = [];
    var syntheticPanels: any[] = [];
    var collaterals = getCollaterals(network);
    var synthetics = getSynthetics(network);
    synthetics.forEach((synthetic, index) => {
        var panel = (
            <Grid item xs={12} style={{ paddingTop: (index !== 0 ? "16px" : "0px") }}>
                <AssetPanel
                    variant="synthetics"
                    syntheticInfo={synthetic}
                    protocol={protocol}
                    user={userAccount}
                    state={state}
                    assetList={assetList}
                    synthetics={synthetics}
                    userDebtUsd={userDebtUsd}
                    maxUserDebtUsd={maxUserDebtUsd}
                    cRatio={cRatio}
                />
            </Grid>);
        syntheticPanels.push(panel);
    });

    useEffect(() => {
        async function updateRewards() {
            if (userAccount && userAccountExists && protocol && state && currentSlot) {
                var totalEpochRewardsDecimal = state.globalStakingData.currentEpochData.rewardTokenAForEpoch;
                var totalEpochRewards = totalEpochRewardsDecimal.val.toNumber() / 10 ** totalEpochRewardsDecimal.scale;

                var globalDebtSharesForEpoch = state.globalStakingData.currentEpochData.globalDebtShares.toNumber();
                var userDebtSharesForEpoch = userAccount.userStakingData.currentEpochDebtShares.toNumber();
                var userRatio = userDebtSharesForEpoch / globalDebtSharesForEpoch;
                var userRewards = totalEpochRewards * userRatio;
                if (isNaN(userRewards)) {
                    userRewards = 0;
                }

                // TODO: calculate maximum possible rewards for epoch
                userRewards = userRewards * epochProgress;
                userRewards = userRewards > totalEpochRewards ? totalEpochRewards : userRewards;
                userRewards = userRewards < 0 ? 0 : userRewards;
                setUsersCurrentEpochRewards(userRewards);

                var totalNextEpochRewardsDecimal = state.globalStakingData.nextEpochData.rewardTokenAForEpoch;
                var totalNextEpochRewards = totalNextEpochRewardsDecimal.val.toNumber() / 10 ** totalNextEpochRewardsDecimal.scale;
                var globalDebtSharesForNextEpoch = state.globalStakingData.nextEpochData.globalDebtShares.toNumber();
                var userDebtSharesForNextEpoch = userAccount.userStakingData.nextEpochDebtShares.toNumber();
                var userRatioNextEpoch = userDebtSharesForNextEpoch / globalDebtSharesForNextEpoch;
                var userRewardsNextEpoch = totalNextEpochRewards * userRatioNextEpoch;

                if (isNaN(userRewardsNextEpoch)) {
                    userRewardsNextEpoch = 0;
                }
                setUsersNextEpochRewards(userRewardsNextEpoch);

                var withdrawableDecimal = userAccount.userStakingData.claimableRewards.val.toNumber() / 10 ** userAccount.userStakingData.claimableRewards.scale;
                setWithdrawable(withdrawableDecimal);

                // TODO: add check for which epoch is current
                // TODO: last epoch needs to be based on current slot, not previousEpochData
                
                var totalLastEpochRewardsDecimal = state.globalStakingData.previousEpochData.rewardTokenAForEpoch;
                var totalLastEpochRewards = totalLastEpochRewardsDecimal.val.toNumber() / 10 ** totalLastEpochRewardsDecimal.scale;
                var claimableDecimal = userAccount.userStakingData.lastUpdate.toNumber() < state.globalStakingData.currentEpochData.startSlot.toNumber() 
                    ? (userAccount.userStakingData.currentEpochDebtShares.toNumber() / state.globalStakingData.currentEpochData.globalDebtShares.toNumber()) * totalLastEpochRewards
                    : (userAccount.userStakingData.lastEpochDebtShares.toNumber() / state.globalStakingData.previousEpochData.globalDebtShares.toNumber()) * totalLastEpochRewards;
                claimableDecimal = isNaN(claimableDecimal) ? 0 : claimableDecimal;
                setClaimable(claimableDecimal);

                var currentEpochStartSlot = state.globalStakingData.currentEpochData.startSlot.toNumber();
                var nextEpochStartslot = state.globalStakingData.nextEpochData.startSlot.toNumber();
                var slotDelta = nextEpochStartslot - currentSlot;
                slotDelta = slotDelta < 0 ? 0 : slotDelta;
                var slotsToComplete = nextEpochStartslot - currentEpochStartSlot;
                var progress = (slotsToComplete - slotDelta) / (slotsToComplete);
                progress = progress < 0 ? 0 : progress;
                progress = progress > 1 ? 1 : progress;
                setEpochProgress(progress);

                var estimatedTimeRemaining = slotDelta * 400; // 400ms
                var epochEndTime = Date.now() + estimatedTimeRemaining;
                var distance = (epochEndTime - Date.now());

                var days = Math.floor(distance / (1000 * 60 * 60 * 24));
                days = days < 0 ? 0 : days;
                var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                hours = hours < 0 ? 0 : hours;
                var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                minutes = minutes < 0 ? 0 : minutes;
                var seconds = Math.floor((distance % (1000 * 60)) / 1000);
                seconds = seconds < 0 ? 0 : seconds;
                setTimeRemaining(`${slotDelta} slots (${days}d${hours}h${minutes}m${seconds}s)`);

                // set apr/apy
                if (assetList) {
                    var asset = assetList.assets[assetList.collaterals[0].assetIndex];
                    var price = asset.price.val.toNumber() / 10 ** asset.price.scale;
                    var rewardsPerEpochUsd = totalEpochRewards * price;
                    var collateralTvlUsd = await protocol.getTotalCollateralTvl();
                    var aprEpoch = rewardsPerEpochUsd / collateralTvlUsd * 365
                    setApr(aprEpoch * 100);
                    setApy((aprEpoch/365+1)**(365-1) * 100)
                }
            }
        }

        updateRewards();

        const interval = setInterval(() => setRewardsLabelTime(Date.now()), 1500);

        return () => {
            clearInterval(interval);
        };
    }, [rewardsLabelTime]);

    async function claim() {
        if (protocol && wallet) {
            setLoadingClaim(true);
            var account = ((await protocol.getUserAccount(wallet.publicKey)));
            try {
                var builder = new TransactionBuilder(protocol.connection, wallet.publicKey);
                builder = builder.add(await protocol.updatePricesIx());
                builder = builder.add(await protocol.claimRewardsIx(account[0]));
                var txId = await builder.buildSignSendAndConfirm(wallet);
                toast.success("Rewards claimed successfully. TX: " + txId.slice(0, 8));
            } catch (e) {
                handleError(e);
            }
        } else {
            toast.error("Please connect your wallet before claiming rewards.");
        }
        setLoadingClaim(false);
    }

    async function withdraw() {
        if (protocol && wallet) {
            setLoadingWithdraw(true);
            try {
                var associatedAddress = await getAssociatedAddress(new PublicKey(collaterals[0].mint), wallet.publicKey);
                var account = (await protocol.getUserAccount(wallet.publicKey))[0];
                var tx = await protocol.withdrawRewards(account, wallet.publicKey, associatedAddress);
                toast.success("Rewards withdrawn successfully. TX: " + tx.slice(0, 8));
            } catch (e) {
                handleError(e);
            }
        } else {
            toast.error("Please connect your wallet before withdrawing rewards.");
        }
        setLoadingWithdraw(false);
    }

    var debtRatio = (userDebtUsd !== undefined && maxUserDebtUsd !== undefined)    
        ? ((userDebtUsd / maxUserDebtUsd) * 100) 
        : 0;
    debtRatio = debtRatio > 100 ? 100 : debtRatio;
    var riskLevel = debtRatio >= 95 
        ? "high" 
        : debtRatio >= 70
            ? "medium"
            : "low";

    return (
        <Container className="stakepage" style={{
            backgroundColor: "#000000",
            padding: "0px",
            margin: "0px",
            maxWidth: "100%",
            marginLeft: "auto",
            marginRight: "auto",
        }}>
            {banner}
            <Container style={{
                backgroundColor: "#000000",
                marginLeft: "auto",
                marginRight: "auto",
                maxWidth: "100%",
            }} className="container-mobile">
                <Grid container spacing={0}>
                    <Grid container spacing={0} style={{ paddingTop: "12px" }}>

                        <Grid item xs={12} sm={12} md={6} xl={6} className="info-box-wrapper">
                            <div className="info-box" style={{ marginRight: "24px" }}>
                                <div className="inline-div">
                                    <div style={{ backgroundColor: "#126c73", border: "1px solid #15727D" }} className="scale-up-on-hover icon-wrapper ">
                                        <DonutLargeRounded style={{ color: "#21D7E5" }} className="stake-icons" />
                                    </div>
                                    <h3 style={{ display: 'block', margin: '0px', paddingLeft: "24px" }}>Collateral</h3>
                                </div>

                                <div className="info-box-text-row inline-div" style={{ paddingTop: "18px", paddingRight: "12px" }}>
                                    <div className="info-box-text-title collateral-title-text scale-up-on-hover">
                                        C-ratio
                                    </div>
                                    <div className="info-box-text-info c-ratio-info-text">
                                        {!(userAccountExists && connected && cRatio !== undefined) ? "N/A" : (cRatio > 0) ? `${formatPriceNumber.format(cRatio)}` : "∞"}
                                    </div>
                                </div>
                                <div className="info-box-text-row inline-div " style={{ paddingTop: "16px", paddingRight: "12px" }}>
                                    <div className="info-box-text-title collateral-title-text scale-up-on-hover">
                                        Risk level
                                    </div>
                                    <Badge variant={riskLevel} className="marginleft-auto" />
                                </div>

                            </div>
                        </Grid>

                        <Grid item xs={12} sm={12} md={6} xl={6} className="info-box-wrapper">
                            <div className="info-box" style={{ marginRight: "24px" }}>
                                <div className="inline-div">
                                    <div style={{ backgroundColor: "rgba(255, 247, 150, 0.5)", border: "1px solid #807c4bw" }} className="scale-up-on-hover icon-wrapper ">
                                        <StarRounded style={{ color: "#fff796" }} className="stake-icons" />
                                    </div>
                                    <h3 style={{ display: 'block', margin: '0px', paddingLeft: "24px" }}>Debt Overview</h3>
                                </div>

                                <div className="info-box-text-row inline-div" style={{ paddingTop: "48px", paddingRight: "12px" }}>
                                    <div className="info-box-text-title debt-progress-container inline-div">
                                        <HtmlTooltip title="This is the minimum possible amount of debt" placement='top'>
                                            <div style={{ paddingLeft: "15px" }} className="scale-up-on-hover">$0</div>
                                        </HtmlTooltip>
                                        <Tooltip
                                            open={true}
                                            title={(userAccountExists && connected && userDebtUsd !== undefined) ? `Current debt: $${formatPriceNumberScaled.format(userDebtUsd)}` : "Current debt: $0"}
                                            placement='top'
                                            PopperProps={{
                                                className: "tooltip-styled"
                                            }}>
                                            <Tooltip
                                                open={true}
                                                title={(userAccountExists && connected && maxUserDebtUsd !== undefined) ? `Maximum spend: $${formatPriceNumber.format(maxUserDebtUsd)}` : "Maximum spend: N/A"}
                                                placement='bottom'
                                                PopperProps={{
                                                    className: "tooltip-styled"
                                                }}>
                                                <BorderLinearProgress variant='determinate'
                                                    value={debtRatio} color='success' className="debt-progress-bar" />
                                            </Tooltip>
                                        </Tooltip>
                                        <HtmlTooltip title="This is the maximum allowed debt, calculated from staked collateral, collateral price and collateral ratio" placement='top'>
                                            <div className="scale-up-on-hover">{(userAccountExists && connected && maxUserDebtUsd !== undefined) ? `$${formatPriceNumber.format(maxUserDebtUsd)}` : "N/A"}</div>
                                        </HtmlTooltip>
                                    </div>
                                </div>

                            </div>
                        </Grid>
                    </Grid>
                    <Grid container spacing={0} style={{ paddingTop: "42px" }}>
                        <Grid item xs={12} md={6}>
                            <h1 style={{ display: 'block', margin: '0px', fontWeight: "bold", fontFamily: "Work Sans", fontSize: "30px" }}>Tokens deposited</h1>
                            <text style={{ color: "#6D979B", paddingTop: '16px', display: 'block', minHeight: "70px", paddingRight: "24px" }}>
                                Deposit your FAB tokens as collateral. Depositing DOES NOT enter you into the debt pool.
                            </text>
                            <Grid container spacing={0} style={{ paddingTop: "32px" }}>
                                <Grid item xs={12}>
                                    <AssetPanel
                                        variant="collateral"
                                        collateralInfo={collaterals[0]}
                                        protocol={protocol}
                                        user={userAccount}
                                        state={state}
                                        assetList={assetList}
                                        synthetics={synthetics}
                                        userDebtUsd={userDebtUsd}
                                        maxUserDebtUsd={maxUserDebtUsd}
                                        cRatio={cRatio}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} md={6} className='title-top-padding'>
                            <h1 style={{ display: 'block', margin: '0px', fontWeight: "bold", fontFamily: "Work Sans", fontSize: "30px" }}>Issued synthetics</h1>
                            <text style={{ color: "#6D979B", paddingTop: '16px', display: 'block', minHeight: "70px" }}>
                                Mint fUSD to enter the debt pool and earn rewards. Swap fUSD for other synthetics such as fXAU and fURA.
                            </text>
                            <Grid container spacing={0} style={{ paddingTop: "32px" }}>
                                {syntheticPanels}
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid container spacing={0} style={{ paddingTop: "42px" }}>
                        <Grid item xs={12} >
                            <h1 style={{ display: 'block', margin: '0px', fontSize: "30px", fontWeight: "bold", fontFamily: "Work Sans" }}>Rewards</h1>
                            <text style={{ color: "#6D979B", paddingTop: '16px', display: 'block', fontSize: "16px", fontFamily: "Roboto Mono" }}>
                                You will receive FAB staking rewards from synth trades and FAB emissions.
                            </text>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} xl={12} className="info-box-wrapper" style={{ paddingTop: "24px" }}>
                            <div className="info-box" style={{ marginRight: "24px" }}>
                                <div className="inline-div">
                                    <div style={{ backgroundColor: "#107b51", border: "1px solid #107b51" }} className="scale-up-on-hover icon-wrapper ">
                                        <PaymentRounded style={{ color: "#21e583" }} className="stake-icons" />
                                    </div>
                                    <h3 style={{ display: 'block', margin: '0px', paddingLeft: "24px" }}> Rewards</h3>
                                </div>
                                <div className="info-box-text-row inline-div" style={{ paddingTop: "18px", paddingRight: "12px" }}>
                                    <div className="info-box-text-title collateral-title-text scale-up-on-hover">
                                        Your rewards (current epoch)
                                    </div>
                                    <Tooltip title={`Your rewards (next epoch): ~${formatPriceNumber.format(usersNextEpochRewards)}`} placement='top' className="tooltip-styled">
                                        <div className="info-box-text-info c-ratio-info-text">
                                            {protocol === undefined ? "N/A" : `~${formatPriceNumber.format(usersCurrentEpochRewards)} FAB`}
                                        </div>
                                    </Tooltip>
                                </div>
                                <div className="info-box-text-row inline-div " style={{ paddingTop: "16px", paddingRight: "12px" }}>
                                    <div className="info-box-text-title collateral-title-text scale-up-on-hover">
                                        Your rewards (next epoch)
                                    </div>
                                    <div className="info-box-text-info c-ratio-info-text">
                                        {protocol === undefined ? "N/A" : `~${formatPriceNumber.format(usersNextEpochRewards)} FAB`}
                                    </div>
                                </div>
                                <div className="info-box-text-row inline-div " style={{ paddingTop: "16px", paddingRight: "12px" }}>
                                    <div className="info-box-text-title collateral-title-text scale-up-on-hover">
                                        Remaining
                                    </div>
                                    <div className="info-box-text-info c-ratio-info-text">
                                        {protocol === undefined ? "N/A" : timeRemaining}
                                    </div>
                                </div>
                                <div className="info-box-text-row inline-div " style={{ paddingTop: "16px", paddingRight: "12px" }}>
                                    <div className="info-box-text-title collateral-title-text scale-up-on-hover">
                                        Claimable
                                    </div>
                                    <div className="info-box-text-info c-ratio-info-text">
                                        {protocol === undefined ? "N/A" : `${formatPriceNumber.format(claimable)} FAB`}
                                    </div>
                                </div>
                                <div className="info-box-text-row inline-div " style={{ paddingTop: "16px", paddingRight: "12px" }}>
                                    <div className="info-box-text-title collateral-title-text scale-up-on-hover">
                                        Withdrawable
                                    </div>
                                    <div className="info-box-text-info c-ratio-info-text">
                                        {protocol === undefined ? "N/A" : `${formatPriceNumber.format(withdrawable)} FAB`}
                                    </div>
                                </div>
                                <div className="info-box-text-row inline-div " style={{ paddingTop: "16px", paddingRight: "12px" }}>
                                    <div className="info-box-text-title collateral-title-text scale-up-on-hover">
                                        APR (APY)
                                    </div>
                                    <div className="info-box-text-info c-ratio-info-text">
                                        {protocol === undefined ? "N/A" : `${formatPriceNumber.format(apr)}% (${apy > 1_000_000 ? "1,000,000%+" : formatPriceNumber.format(apy) + "%"}) `}
                                    </div>
                                </div>
                                <div className="info-box-text-row inline-div " style={{ paddingTop: "16px", paddingRight: "12px", justifyContent: 'center' }}>
                                    <div style={{ paddingRight: '10px' }}>
                                        <Button
                                            onClick={claim}
                                            label='Claim'
                                            width={100}
                                            maxWidth={200}
                                            height={50}
                                            loading={loadingClaim}
                                        />
                                    </div>
                                    <div style={{ paddingLeft: '10px' }}>
                                        <Button
                                            onClick={withdraw}
                                            label='Withdraw'
                                            width={100}
                                            maxWidth={200}
                                            height={50}
                                            loading={loadingWithdraw}
                                        />
                                    </div>
                                </div>

                            </div>
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
        </Container>
    );
};