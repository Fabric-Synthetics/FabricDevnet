import { Network, OracleType } from "@fabric-foundation/sdk";

interface ICollaterals {
    localnet: ICollateral[];
    mainnet: ICollateral[];
    devnet: ICollateral[];
}

interface ICollateral {
    name: string;
    logoUrl: string;
    mint: string;
    reserve: string;
    decimals: number;
    tvlUsd: number;
    optimumCollateralRatio: number;
    oracleType: OracleType;
}

export const collaterals: ICollaterals = {
    localnet: [{
        name: "FAB",
        logoUrl: "https://uploads-ssl.webflow.com/60b35c8cd73f399dc4a8d8b9/60b370df8e7b7a8633e75b16_FABLOGO_TRANS192.png",
        mint: "3WQ1o16MHoyebFBFpL1g915Nm4Bx7UxcUVG26QWtd8sV",
        reserve: "2eoHtqXHycHEz9hjXTs2HfFMVB12YwKKQXZbTGZoJdpP",
        decimals: 8,
        tvlUsd: 0,
        optimumCollateralRatio: 10.0,
        oracleType: OracleType.Pyth
    }],
    devnet: [{
        name: "FAB",
        logoUrl: "https://uploads-ssl.webflow.com/60b35c8cd73f399dc4a8d8b9/60b370df8e7b7a8633e75b16_FABLOGO_TRANS192.png",
        mint: "8RcoapffJxVRoo523cMC8Q7mCZHT5xUWQfQLSjF5Xzox",
        reserve: "2AXLhyrZLgx4tTTbeem9qmp4Y4BmidBGUnHB5M1cMMGH",
        decimals: 8,
        tvlUsd: 0,
        optimumCollateralRatio: 10.0,
        oracleType: OracleType.Switchboard
    },
    {
        name: "USDC",
        logoUrl: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
        mint: "Bpe4dwD2wgGCDxucsXk3MwrKK6ND8mB6m1je6vbsJJGK",
        reserve: "CzpHYvDoedjtrkzq966NwRy5d2ooc1vcrSDBcy2Ttmvf",
        decimals: 8,
        tvlUsd: 0,
        optimumCollateralRatio: 5.0,
        oracleType: OracleType.Pyth
    }],
    mainnet: [{
        name: "FAB",
        logoUrl: "https://uploads-ssl.webflow.com/60b35c8cd73f399dc4a8d8b9/60b370df8e7b7a8633e75b16_FABLOGO_TRANS192.png",
        mint: "EdAhkbj5nF9sRM7XN7ewuW8C9XEUMs8P7cnoQ57SYE96",
        reserve: "3v4exWkPSCd3YJxEnFW2wfWToUVinJ4YNSkMF91t67jc",
        decimals: 9,
        tvlUsd: 0,
        optimumCollateralRatio: 2.0,
        oracleType: OracleType.Switchboard
    }]
};

export function getCollaterals(network: Network) {
    switch (network) {
        case 'devnet':
            return collaterals.devnet;
        case 'localnet':
        case 'localhost':
            return collaterals.localnet;
        case 'mainnet-beta':
            return collaterals.mainnet;
        case 'testnet':
        default:
            throw new Error('Network not supported');
    }
}