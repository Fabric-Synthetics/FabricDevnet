import { ASSOCIATED_TOKEN_PROGRAM_ID, Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { toast } from "react-toastify";
import { PublicKey } from "@solana/web3.js";

export function notify(message: string) {
    toast(message);
}

export function notifySuccess(message: string) {
    toast.success(message);
}

export function handleError(e: any) {
    console.log('message:', e.message);
    if (e.message === "failed to send transaction: Transaction simulation failed: Error processing Instruction 1: custom program error: 0x1") {
        toast.error('You have insufficient funds. Please reduce the amount.');
    } else if (e.message.includes("0: Unauthorized to perform action") || e.message.includes("0x1770")) {
        toast.error('You are not authorized to perform this action.');
    } else if (e.message.includes("1: Invalid asset index") || e.message.includes("0x1771")) {
        toast.error('Contract error: Invalid asset index (301).');
    } else if (e.message.includes("2: Asset not found") || e.message.includes("0x1772")) {
        toast.error('The asset cannot be found. Please try with a different asset.');
    } else if (e.message.includes("3: Collateral exceeds maximum allowed") || e.message.includes("0x1773")) {
        toast.error('The deposit limit for this collateral has been reached. Try again once the limit is raised.');
    } else if (e.message.includes("4: Minting greater than limit") || e.message.includes("0x1774")) {
        toast.error('Cannot mint more tokens than your collateral allows.');
    } else if (e.message.includes("5: Price is not up to date") || e.message.includes("0x1775")) {
        toast.error('The oracle price is not up to date. Please try again later.');
    } else if (e.message.includes("6: Attempting to set supply greater than maximum allowed supply") || e.message.includes("0x1776")) {
        toast.error('Cannot mint more than the maximum allowed supply.');
    } else if (e.message.includes("7: Attempting to burn shares with no debt") || e.message.includes("0x1777")) {
        toast.error('No debt to burn.');
    } else if (e.message.includes("8: Attempting to pass in an invalid account") || e.message.includes("0x1778")) {
        toast.error('Attempting to pass in an invalid account.');
    } else if (e.message.includes("9: Attempting operate on decimals with two different scales") || e.message.includes("0x1779")) {
        toast.error('Contract error: Attempting to operate on decimals with two different scales');
    } else if (e.message.includes("10: Attempting to withdraw more collateral than user has") || e.message.includes("0x177a")) {
        toast.error('Cannot withdraw more collateral than you have staked.');
    } else if (e.message.includes("11: Attempting to wash trade") || e.message.includes("0x177b")) {
        toast.error('Cannot swap to the same token.');
    } else if (e.message.includes("12: Oracle has incorrect data or is not trading") || e.message.includes("0x177c")) {
        toast.error('Oracle is not trading. Either the market feeding the prices are not active or the oracle is not active.');
    } else if (e.message.includes("13: Cannot swap zero tokens") || e.message.includes("0x177d")) {
        toast.error('Cannot swap zero tokens.');
    } else if (e.message.includes("14: Attempting to withdraw collateral whilst under optimum C-ratio") || e.message.includes("0x177e")) {
        toast.error('Cannot withdraw collateral whilst debt is greater than maximum spend');
    } else if (e.message.includes("15: Cannot swap less than 1 USD worth of tokens") || e.message.includes("0x177f")) {
        toast.error('Cannot swap less than 1 USD worth of tokens.');
    } else if (e.message.includes("16: Protocol has been halted") || e.message.includes("0x1780")) {
        toast.error('Protocol has been halted.');
    } else if (e.message.includes("17: Attempting to mint zero tokens") || e.message.includes("0x1781")) {
        toast.error('Cannot mint 0 tokens.');
    } else if (e.message.includes("18: Attempting to liquidate zero tokens") || e.message.includes("0x1782")) {
        toast.error('Cannot liquidate 0 tokens.');
    } else if (e.message.includes("19: Attempting to liquidate user before deadline has passed") || e.message.includes("0x1783")) {
        toast.error('Cannot liquidate user before deadline has passed.');
    } else if (e.message.includes("20: Attempting to liquidate user with healthy c ratio") || e.message.includes("0x1784")) {
        toast.error('Cannot liquidate user with healthy C-ratio.');
    } else if (e.message.includes("21: Attempting to set swap fee greater than 3%") || e.message.includes("0x1785")) {
        toast.error('Cannot set swap fee greater than 3%.');
    } else if (e.message.includes("22: Attempting to set liquidation rate greater than 100%") || e.message.includes("0x1786")) {
        toast.error('Cannot set liquidation rate greater than 100%.');
    } else if (e.message.includes("23: Attempting to liquidate more than maximum liquidatable amount") || e.message.includes("0x1787")) {
        toast.error('Cannot liquidate more than the maximum liquidatable amount.');
    } else if (e.message.includes("24: Cannot find collateral attempting to liquidate for user in user's account") || e.message.includes("0x1788")) {
        toast.error('Cannot find collateral attempting to liquidate for user in user\'s account.');
    } else if (e.message.includes("25: Attempting to set a liquidation cycle duration greater 1 million slots. Try setting a duration less than 1 million slots.") || e.message.includes("0x1789")) {
        toast.error('Cannot set a liquidation cycle duration greater 1 million slots. Try setting a duration less than 1 million slots.');
    } else if (e.message.includes("26: Attempting to set a liquidator fee greater than 15%. Try setting a fee less than 15%.") || e.message.includes("0x178a")) {
        toast.error('Cannot set a liquidator fee greater than 15%. Try setting a fee less than 15%.');
    } else if (e.message.includes("27: Attempting to set a protocol liquidation fee greater than 10%. Try setting a fee less than 10%.") || e.message.includes("0x178b")) {
        toast.error('Cannot set a protocol liquidation fee greater than 10%. Try setting a fee less than 10%.');
    } else if (e.message.includes("28: Attempting to liquidate an account for more collateral than the user has. Reduce the liquidation amount.") || e.message.includes("0x178c")) {
        toast.error('Cannot liquidate an account for more collateral than the user has. Reduce the liquidation amount.');
    } else if (e.message.includes("29: The collateral to liquidate was not found in assets list. Check you have passed the correct asset pubkey.") || e.message.includes("0x178d")) {
        toast.error('The collateral to liquidate was not found in assets list. Check you have passed the correct asset account.');
    } else if (e.message.includes("30: An incorrect liquidation fund account was passed to this instruction. Check you are using the liquidation fund account stored in the collateral within the global state.") || e.message.includes("0x178e")) {
        toast.error('An incorrect liquidation fund account was passed to this instruction. Check you are using the liquidation fund account stored in the collateral within the global state.');
    } else if (e.message.includes("31: Attempting to set a maximum supply less than existing supply.") || e.message.includes("0x178f")) {
        toast.error('Cannot set a maximum supply less than existing supply.');
    } else if (e.message.includes("32: Attempting to add a collateral that is already supported.") || e.message.includes("0x1790")) {
        toast.error('Cannot add a collateral that is already supported.');
    } else if (e.message.includes("33: Attempting to add a synthetic that is already supported.") || e.message.includes("0x1791")) {
        toast.error('Cannot add a synthetic that is already supported.');
    } else if (e.message.includes("34: Attempting to set maximum supply for collateral below current staked amount.") || e.message.includes("0x1792")) {
        toast.error('Cannot set maximum supply for collateral below current staked amount.');
    } else if (e.message.includes("35: Attempting to set maximum supply for synthetic below existing supply.") || e.message.includes("0x1793")) {
        toast.error('Cannot set maximum supply for synthetic below existing supply.');
    } else if (e.message.includes("36: An incorrect collateral reserve account was passed to this instruction. Check you are using the collateral reserve account stored in the collateral within the global state.") || e.message.includes("0x1794")) {
        toast.error('An incorrect collateral reserve account was passed to this instruction. Check you are using the collateral reserve account stored in the collateral within the global state.');
    } else if (e.message.includes("37: Switchboard round data is invalid.") || e.message.includes("0x1795")) {
        toast.error('Switchboard round data is invalid.');
    } else if (e.message.includes("38: Cannot claim rewards. User is below minimum C-ratio.") || e.message.includes("0x1796")) {
        toast.error('Unable to claim rewards as your c-ratio is below the minimum. Try increasing your c-ratio to the minimum before the end of this epoch to claim rewards. You will lose your last epoch\'s rewards if you do not claim within this epoch.');
    } else if (e.message.includes("User rejected the request")) {
        toast.error("Transaction cancelled by user.");
    } else if (e.message.includes("Node is behind by")) {
        toast.error("RPC node is behind in slots. Please try again in a few moments.");
    } else if (e.message.includes("Transaction was not confirmed in")) {
        toast.error("Transaction was not confirmed.");
    } else if (e.message.includes("Blockhash not found")) {
        toast.error("Blockhash not found. RPC node is behind in slots. Please try again in a few moments.");
    } else {
        console.log("unknown error - ", e);
        toast.error("An unknown error has occurred.");
    }
}

export async function getAssociatedAddress(mint: PublicKey, owner: PublicKey) {
    var associatedAddress = await Token.getAssociatedTokenAddress(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        mint,
        owner
    );
    return associatedAddress;
}


export function round(value: number, precision: number) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}

export function formatNumber(value: number, decimals: number): string {
    const formatter = new Intl.NumberFormat("en-US", {
        style: "decimal",
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    });
    return formatter.format(value);
}

export const formatPriceNumber = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});
  
export const formatPriceNumberScaled = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 5,
    maximumFractionDigits: 5,
});
  
