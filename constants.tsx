
import React from 'react';

export const POPULAR_CRYPTOS = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', icon: '₿' },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', icon: 'Ξ' },
  { id: 'tether', symbol: 'USDT', name: 'Tether', icon: '₮' },
  { id: 'solana', symbol: 'SOL', name: 'Solana', icon: 'S' },
  { id: 'binancecoin', symbol: 'BNB', name: 'BNB', icon: 'B' },
];

export const FIAT_CURRENCIES = [
  { id: 'USD', symbol: '$', name: 'US$' },
  { id: 'DOP', symbol: 'RD$', name: 'RD$' },
];

export const Icons = {
  Refresh: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
  ),
  Exchange: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/></svg>
  ),
  Brain: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .52 8.105 3 3 0 1 0 5.997.125 4 4 0 0 0 5.143-5.143 4 4 0 0 0 5.143-5.143 4 4 0 0 0-5.143-5.143A4 4 0 0 0 12 5Z"/><path d="M9 13a3 3 0 1 0 6 0 3 3 0 0 0-6 0"/></svg>
  ),
};
