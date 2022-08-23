import { Network } from "@fabric-foundation/sdk";

interface ISynthetics {
  localnet: ISynthetic[];
  mainnet: ISynthetic[];
  devnet: ISynthetic[];
}

interface ISynthetic {
  name: string;
  logoUrl: string;
  mint: string;
  priceFeed?: string;
  isFixed: boolean;
  decimals: number;
  displayDecimals: number;
  isUsdQuote: boolean;
}

export const synthetics: ISynthetics = {
  mainnet: [
    {
      name: "fUSD",
      logoUrl: "https://imagedelivery.net/9NaZ0y3QBjls8_Ib2N2gQw/ec3521b6-b382-4efb-1d16-7b60c75b9100/public",
      mint: "B7mXkkZgn7abwz1A3HnKkb18Y6y18WcbeSkh1DuLMkee",
      priceFeed: undefined,
      isFixed: true,
      decimals: 8,
      displayDecimals: 2,
      isUsdQuote: true,
    },
    {
      name: "fXAU",
      logoUrl: "https://imagedelivery.net/9NaZ0y3QBjls8_Ib2N2gQw/44d5355a-45e3-4c2d-decb-0cf723959900/public",
      mint: "7nvyNSn5gWrpfE8Qp4uLPUFz7g6uHKVyLNYeHcbq81Aa",
      priceFeed: "8y3WWjvmSmVGWVKH1rCA7VTRmuU7QbJ9axafSsBX5FcD",
      isFixed: false,
      decimals: 8,
      displayDecimals: 5,
      isUsdQuote: true,
    }
  ],
  localnet: [
    {
      name: "fUSD",
      logoUrl: "https://imagedelivery.net/9NaZ0y3QBjls8_Ib2N2gQw/ec3521b6-b382-4efb-1d16-7b60c75b9100/public",
      mint: "8YvDuNuAeKpbfpjDCy8NumqYN7wmzgizVRY6ijxQhhFb",
      priceFeed: undefined,
      isFixed: true,
      decimals: 8,
      displayDecimals: 2,
      isUsdQuote: true,
    },
    {
      name: "fURA",
      logoUrl: "https://imagedelivery.net/9NaZ0y3QBjls8_Ib2N2gQw/e6570c13-2421-403c-74d6-eb5654472900/public",
      mint: "EbUoryugsejEXr5hU7GyrP2aLtXAEHNfrxZc7RfckBvP",
      priceFeed: "C4aNh2G2yhq7BDtDR264RXpS29ggGnj2HxQi9g2jCjmS",
      isFixed: false,
      decimals: 8,
      displayDecimals: 2,
      isUsdQuote: true,
    },
    {
      name: "fXAU",
      logoUrl: "https://imagedelivery.net/9NaZ0y3QBjls8_Ib2N2gQw/44d5355a-45e3-4c2d-decb-0cf723959900/public",
      mint: "CwdjdNDLzU5f7Q1pPPWwJwwsbhS511AQ4ULFMngZRkNQ",
      priceFeed: "DaN4ce5VJdAou54J3SsH6AM8j6f4YKsizos4qVQqMSLV",
      isFixed: false,
      decimals: 8,
      displayDecimals: 5,
      isUsdQuote: true,
    },
  ],
  devnet: [
    {
      name: "fUSD",
      logoUrl: "https://imagedelivery.net/9NaZ0y3QBjls8_Ib2N2gQw/ec3521b6-b382-4efb-1d16-7b60c75b9100/public",
      mint: "GqGn2LFgZYLhjikiSYW6Q4w26JXxnxBRuNMFmT3MjB6M",
      priceFeed: undefined,
      isFixed: true,
      decimals: 8,
      displayDecimals: 2,
      isUsdQuote: true,
    },
    {
      name: "fURA",
      logoUrl: "https://imagedelivery.net/9NaZ0y3QBjls8_Ib2N2gQw/e6570c13-2421-403c-74d6-eb5654472900/public",
      mint: "Cc9PpPUswF4bHD8KJNijxKUKPzcZz1U9Km1STXEvQU5t",
      priceFeed: "5b6G3428xAeHkZzzaM2VU24iTdkVATQq5WNwLGHCMoJg",
      isFixed: false,
      decimals: 8,
      displayDecimals: 2,
      isUsdQuote: true,
    },
    {
      name: "fXAU",
      logoUrl: "https://imagedelivery.net/9NaZ0y3QBjls8_Ib2N2gQw/44d5355a-45e3-4c2d-decb-0cf723959900/public",
      mint: "AS9argtvFaBWoW91LpfNMoJRk4ju8ugEVdWfMMmFzapx",
      priceFeed: "4GqTjGm686yihQ1m1YdTsSvfm4mNfadv6xskzgCYWNC5",
      isFixed: false,
      decimals: 8,
      displayDecimals: 5,
      isUsdQuote: true,
    },
    {
      name: "fDOGE",
      logoUrl: "https://imagedelivery.net/9NaZ0y3QBjls8_Ib2N2gQw/12cd1cf4-f68a-4b32-355e-b40053725300/public",
      mint: "4XZhhTtMQ2SXmBSKucQ28PtseRtwBGpc4AVej37kuTTv",
      priceFeed: "4L6YhY8VvUgmqG5MvJkUJATtzB2rFqdrJwQCmFLv4Jzy",
      isFixed: false,
      decimals: 8,
      displayDecimals: 2,
      isUsdQuote: true,
    },
    {
      name: "fEUR",
      logoUrl: "https://imagedelivery.net/9NaZ0y3QBjls8_Ib2N2gQw/1ed84129-6754-4668-7e4b-2cf143f5a100/public",
      mint: "BWc6VuazzHxJ8yRrWocjLZfKjfEkMEr8grYMhT8jLQWK",
      priceFeed: "E36MyBbavhYKHVLWR79GiReNNnBDiHj6nWA7htbkNZbh",
      isFixed: false,
      decimals: 8,
      displayDecimals: 2,
      isUsdQuote: true,
    },
    {
      name: "fGBP",
      logoUrl: "https://imagedelivery.net/9NaZ0y3QBjls8_Ib2N2gQw/b00332ce-5694-4d33-09fc-d523b63bbe00/public",
      mint: "FK12Vfus9VH4kasYe7d7R6syEcuTbS8JCJtk9ZmesT5q",
      priceFeed: "DhmUMEyq1hmEAGpifaH8HzfG1NqipvrVhBZgBog7NCb6",
      isFixed: false,
      decimals: 8,
      displayDecimals: 2,
      isUsdQuote: true,
    },
    {
      name: "fBTC",
      logoUrl: "https://imagedelivery.net/9NaZ0y3QBjls8_Ib2N2gQw/ec84365d-c9a9-45b6-afeb-4ca5ca831600/public",
      mint: "BwhbNiZRwTKB7rz6n95SUQcMwkFYbb9cx2h6FPDHstwU",
      priceFeed: "HovQMDrbAgAYPCmHVSrezcSmkMtXSSUsLDFANExrZh2J",
      isFixed: false,
      decimals: 8,
      displayDecimals: 5,
      isUsdQuote: true,
    },
    {
      name: "fADA",
      logoUrl: "https://imagedelivery.net/9NaZ0y3QBjls8_Ib2N2gQw/a6d47d98-ea35-47ec-cf43-eb95ac94d500/public",
      mint: "A6QvgEnaFf2ftq35M5kztaxRufpeiryWuPXEXM71AjmA",
      priceFeed: "8oGTURNmSQkrBS1AQ5NjB2p8qY34UVmMA9ojrw8vnHus",
      isFixed: false,
      decimals: 8,
      displayDecimals: 2,
      isUsdQuote: true,
    },
    {
      name: "fAVAX",
      logoUrl: "https://imagedelivery.net/9NaZ0y3QBjls8_Ib2N2gQw/aa894435-4e95-4af0-e4ff-5faefbc65b00/public",
      mint: "J9nzLNpbc8vfvyV45RDAgjH2LkYH1KnegGfDXKmKbdMT",
      priceFeed: "FVb5h1VmHPfVb1RfqZckchq18GxRv4iKt8T4eVTQAqdz",
      isFixed: false,
      decimals: 8,
      displayDecimals: 2,
      isUsdQuote: true,
    },
    {
      name: "fBCH",
      logoUrl: "https://imagedelivery.net/9NaZ0y3QBjls8_Ib2N2gQw/17e71390-758e-4355-bae1-5b0fb6afed00/public",
      mint: "4qr9SiYyi4E3k6DT9ycD6CQh8m5E82gNkoUWNvTxZefj",
      priceFeed: "4EQrNZYk5KR1RnjyzbaaRbHsv8VqZWzSUtvx58wLsZbj",
      isFixed: false,
      decimals: 8,
      displayDecimals: 5,
      isUsdQuote: true,
    },
    {
      name: "fFTM",
      logoUrl: "https://imagedelivery.net/9NaZ0y3QBjls8_Ib2N2gQw/875a80a0-4ae6-4d76-bc8b-3f2eee6b5b00/public",
      mint: "FgsHQ2TdFokDuEVGYdhkrwoxD1Y8bg5HcTRCmD7KEpgb",
      priceFeed: "BTwrLU4so1oJMViWA3BTzh8YmFwiLZ6CL4U3JryG7Q5S",
      isFixed: false,
      decimals: 8,
      displayDecimals: 2,
      isUsdQuote: true,
    },
    {
      name: "fLUNA",
      logoUrl: "https://imagedelivery.net/9NaZ0y3QBjls8_Ib2N2gQw/8bf381db-f096-4d6f-3397-e9224a012c00/public",
      mint: "FE9KLJTUyd2jSnpKRmnxoJB2CQhTFLTmhc8D5Szdpxue",
      priceFeed: "8PugCXTAHLM9kfLSQWe2njE5pzAgUdpPk3Nx5zSm7BD3",
      isFixed: false,
      decimals: 8,
      displayDecimals: 2,
      isUsdQuote: true,
    },
    {
      name: "fNEAR",
      logoUrl: "https://imagedelivery.net/9NaZ0y3QBjls8_Ib2N2gQw/86dbb0ed-4918-4495-ded2-b8ed1ee2d000/public",
      mint: "r7KZ6SgMCPeA6MU7bjtxgV1xageYcstYzmw4Ed2UQZz",
      priceFeed: "3gnSbT7bhoTdGkFVZc1dW1PvjreWzpUNUD5ppXwv1N59",
      isFixed: false,
      decimals: 8,
      displayDecimals: 2,
      isUsdQuote: true,
    },
    {
      name: "fRUB",
      logoUrl: "https://imagedelivery.net/9NaZ0y3QBjls8_Ib2N2gQw/2fc3c060-058b-40f7-d0c4-f0cda2028a00/public",
      mint: "8Pb8DVqFpHZjs9gr3C6EaALRaLihsMaFjNFYnHcuBYAN",
      priceFeed: "HmbmyjvNBAo3HSkCB8qJRRyp7VYZTso7MBKneyozZrz1",
      isFixed: false,
      decimals: 8,
      displayDecimals: 2,
      isUsdQuote: false,
    },
    {
      name: "fAUD",
      logoUrl: "https://imagedelivery.net/9NaZ0y3QBjls8_Ib2N2gQw/a947a9ec-937c-4f1f-503b-125ced87d800/public",
      mint: "DPHkden93xyfq8NWXHzrrgisjcNn3nGNENBhaBbMBFbQ",
      priceFeed: "3aR6kTksEFb2GsCHGBNtpvUpUJ1XzeA41RTnS4APD8oG",
      isFixed: false,
      decimals: 8,
      displayDecimals: 2,
      isUsdQuote: true,
    },
    {
      name: "fJPY",
      logoUrl: "https://imagedelivery.net/9NaZ0y3QBjls8_Ib2N2gQw/ebe7a85c-369a-4001-44a6-cc64a3f98500/public",
      mint: "HHbfnUoVFEStzvj4BVBS6A5MD1xgjU6nrSW5fjvKTzSY",
      priceFeed: "3CVi3EEprs1zeKhv5kw9EpRDv1hNfvpunQ98gex27Prd",
      isFixed: false,
      decimals: 8,
      displayDecimals: 2,
      isUsdQuote: false,
    },
    {
      name: "fHKD",
      logoUrl: "https://imagedelivery.net/9NaZ0y3QBjls8_Ib2N2gQw/769ca850-3c72-4569-117c-36e382e41400/public",
      mint: "6BDn21cdxgBD7esxQTBYdutthFyxe1V3pbJtxAi9i81r",
      priceFeed: "FPt3saZ3o2rTxh4qvS53J4eqkcsesr5x7hXQG15wALtQ",
      isFixed: false,
      decimals: 8,
      displayDecimals: 2,
      isUsdQuote: false,
    },
    {
      name: "fCNY",
      logoUrl: "https://imagedelivery.net/9NaZ0y3QBjls8_Ib2N2gQw/df0abef9-defd-41c5-2d48-4ab29d95f500/public",
      mint: "EB5aFtRzgo6vjCXqHoRXug9KGZWAPA8jmf3Dsc6DLbtn",
      priceFeed: "EShsgFi7KN3T9zV9AjC9GcfpoaPneoypadYrpjN41r9f",
      isFixed: false,
      decimals: 8,
      displayDecimals: 2,
      isUsdQuote: false,
    },
  ],
};

export function getSynthetics(network: Network) {
  switch (network) {
    case "devnet":
      return synthetics.devnet;
    case "localnet":
    case "localhost":
      return synthetics.localnet;
    case "mainnet-beta":
      return synthetics.mainnet;
    case "testnet":
    default:
      throw new Error("Network not supported");
  }
}
