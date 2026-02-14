
export enum CurrencyType {
  CRYPTO = 'CRYPTO',
  FIAT = 'FIAT'
}

export interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  priceUsd: number;
  change24h: number;
}

export interface ExchangeRates {
  USD: number;
  DOP: number;
}

export interface ConversionState {
  amount: string;
  fromCurrency: string;
  toCurrency: string;
  isCryptoToFiat: boolean;
}
