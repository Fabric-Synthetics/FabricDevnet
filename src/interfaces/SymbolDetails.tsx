
export interface SymbolDetails {
  name: string;
  logoUrl: string;
  mint: string;
  decimals: number;
  priceFeed?: string;
  isFixed: boolean;
  displayDecimals: number;
  isUsdQuote: boolean;
}
