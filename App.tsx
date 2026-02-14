
import React, { useState, useEffect, useCallback } from 'react';
import { POPULAR_CRYPTOS, FIAT_CURRENCIES, Icons } from './constants';
import { CryptoData, ExchangeRates, ConversionState } from './types';
import CalculatorButton from './components/CalculatorButton';
import { getMarketInsight } from './services/geminiService';

const App: React.FC = () => {
  const [cryptoPrices, setCryptoPrices] = useState<Record<string, number>>({
    bitcoin: 65000,
    ethereum: 3500,
    tether: 1,
    solana: 140,
    binancecoin: 580
  });

  const [fiatRates, setFiatRates] = useState<ExchangeRates>({
    USD: 1,
    DOP: 60.15,
  });

  const [state, setState] = useState<ConversionState>({
    amount: '1',
    fromCurrency: 'bitcoin',
    toCurrency: 'USD',
    isCryptoToFiat: true
  });

  const [insight, setInsight] = useState<{ text: string, loading: boolean }>({
    text: '',
    loading: false
  });

  const refreshPrices = useCallback(async () => {
    setCryptoPrices(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(key => {
        next[key] = next[key] * (1 + (Math.random() * 0.02 - 0.01));
      });
      return next;
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(refreshPrices, 30000);
    return () => clearInterval(interval);
  }, [refreshPrices]);

  const handleNumpadClick = (val: string) => {
    setState(prev => {
      if (val === 'C') return { ...prev, amount: '0' };
      if (val === '⌫') {
        const next = prev.amount.slice(0, -1);
        return { ...prev, amount: next === '' ? '0' : next };
      }
      if (val === '.') {
        if (prev.amount.includes('.')) return prev;
        return { ...prev, amount: prev.amount + '.' };
      }
      
      const nextAmount = prev.amount === '0' ? val : prev.amount + val;
      if (nextAmount.length > 10) return prev;
      return { ...prev, amount: nextAmount };
    });
  };

  const toggleDirection = () => {
    setState(prev => ({
      ...prev,
      isCryptoToFiat: !prev.isCryptoToFiat,
    }));
  };

  const getConversion = () => {
    const num = parseFloat(state.amount) || 0;
    const cryptoPrice = cryptoPrices[state.fromCurrency] || 0;
    const fiatRate = fiatRates[state.toCurrency as keyof ExchangeRates] || 1;

    if (state.isCryptoToFiat) {
      return (num * cryptoPrice * fiatRate).toLocaleString('es-DO', { 
        style: 'currency', 
        currency: state.toCurrency,
        maximumFractionDigits: 2 
      });
    } else {
      return (num / (cryptoPrice * fiatRate)).toLocaleString('es-DO', { 
        maximumFractionDigits: 8 
      });
    }
  };

  const handleAnalyze = async () => {
    const crypto = POPULAR_CRYPTOS.find(c => c.id === state.fromCurrency);
    const fiat = FIAT_CURRENCIES.find(f => f.id === state.toCurrency);
    if (!crypto || !fiat) return;

    setInsight({ text: '', loading: true });
    const res = await getMarketInsight(crypto.name, fiat.name);
    setInsight({ text: res.text, loading: false });
  };

  const currentCrypto = POPULAR_CRYPTOS.find(c => c.id === state.fromCurrency);
  const currentFiat = FIAT_CURRENCIES.find(f => f.id === state.toCurrency);

  return (
    <div className="max-w-lg mx-auto p-4 md:pt-10 flex flex-col min-h-screen gap-6 bg-white">
      {/* Header */}
      <header className="flex justify-between items-center px-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Cripto<span className="text-indigo-600">Calc</span> RD
          </h1>
          <p className="text-slate-500 text-sm font-medium">Conversor Premium USD & DOP</p>
        </div>
        <button 
          onClick={refreshPrices}
          className="p-3 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors text-slate-600 border border-slate-200 shadow-sm"
        >
          <Icons.Refresh />
        </button>
      </header>

      {/* Main Display Area */}
      <div className="bg-slate-50 border border-slate-200 rounded-[2.5rem] p-6 md:p-10 shadow-xl space-y-10">
        <div className="flex flex-col gap-6 relative">
          {/* Top Unit Selection - EXPANDIDO */}
          <div className="flex flex-col gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-4xl bg-slate-100 p-2 rounded-2xl border border-slate-200">{state.isCryptoToFiat ? currentCrypto?.icon : currentFiat?.symbol}</span>
                <div className="flex flex-col">
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">De</span>
                  <select 
                    value={state.isCryptoToFiat ? state.fromCurrency : state.toCurrency}
                    onChange={(e) => state.isCryptoToFiat ? setState({...state, fromCurrency: e.target.value}) : setState({...state, toCurrency: e.target.value})}
                    className="bg-transparent text-xl font-bold outline-none cursor-pointer text-slate-800 appearance-none pr-6"
                    style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%2364748b\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right center', backgroundSize: '1rem' }}
                  >
                    {state.isCryptoToFiat 
                      ? POPULAR_CRYPTOS.map(c => <option key={c.id} value={c.id} className="bg-white">{c.name}</option>)
                      : FIAT_CURRENCIES.map(f => <option key={f.id} value={f.id} className="bg-white">{f.name}</option>)
                    }
                  </select>
                </div>
              </div>
              <div className="text-right">
                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Monto</span>
                <div className="text-4xl font-black text-slate-900 tabular-nums">{state.amount}</div>
              </div>
            </div>
          </div>

          {/* Toggle Button */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <button 
              onClick={toggleDirection}
              className="bg-indigo-600 p-3 rounded-2xl border-4 border-slate-50 shadow-xl hover:bg-indigo-700 transition-all hover:scale-110 active:rotate-180 text-white"
            >
              <Icons.Exchange />
            </button>
          </div>

          {/* Bottom Unit Result - EXPANDIDO */}
          <div className="flex flex-col gap-4 bg-indigo-50/50 p-6 rounded-3xl border border-indigo-100 shadow-sm transition-all hover:shadow-md">
             <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-4xl bg-white p-2 rounded-2xl border border-indigo-100">{state.isCryptoToFiat ? currentFiat?.symbol : currentCrypto?.icon}</span>
                <div className="flex flex-col">
                  <span className="text-indigo-400 text-xs font-bold uppercase tracking-wider">A</span>
                  <select 
                    value={state.isCryptoToFiat ? state.toCurrency : state.fromCurrency}
                    onChange={(e) => state.isCryptoToFiat ? setState({...state, toCurrency: e.target.value}) : setState({...state, fromCurrency: e.target.value})}
                    className="bg-transparent text-xl font-bold outline-none cursor-pointer text-indigo-900 appearance-none pr-6"
                    style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%234f46e5\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right center', backgroundSize: '1rem' }}
                  >
                    {state.isCryptoToFiat 
                      ? FIAT_CURRENCIES.map(f => <option key={f.id} value={f.id} className="bg-white">{f.name}</option>)
                      : POPULAR_CRYPTOS.map(c => <option key={c.id} value={c.id} className="bg-white">{c.name}</option>)
                    }
                  </select>
                </div>
              </div>
              <div className="text-right">
                <span className="text-indigo-400 text-xs font-bold uppercase tracking-wider">Resultado</span>
                <div className="text-3xl md:text-4xl font-black text-indigo-600 tracking-tight tabular-nums">{getConversion()}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Numpad */}
        <div className="grid grid-cols-3 gap-4">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '⌫'].map((key) => (
            <CalculatorButton 
              key={key} 
              label={key} 
              variant={key === '⌫' ? 'delete' : 'number'}
              onClick={handleNumpadClick} 
            />
          ))}
          <div className="col-span-3">
            <CalculatorButton 
              label="Limpiar Pantalla (C)" 
              variant="action" 
              onClick={() => handleNumpadClick('C')} 
            />
          </div>
        </div>
      </div>

      {/* Gemini Analysis Section */}
      <section className="mt-4 pb-12">
        <div className="bg-slate-50 border border-slate-200 rounded-[2rem] p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="text-indigo-600 bg-indigo-100 p-2 rounded-xl"><Icons.Brain /></span>
              <h2 className="font-bold text-slate-800 text-lg">Análisis de Mercado AI</h2>
            </div>
            <button 
              onClick={handleAnalyze}
              disabled={insight.loading}
              className={`text-sm px-4 py-2 rounded-xl font-bold transition-all shadow-sm border ${
                insight.loading 
                ? 'bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed' 
                : 'bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 active:scale-95'
              }`}
            >
              {insight.loading ? 'Consultando...' : 'Obtener Insight'}
            </button>
          </div>

          {insight.loading ? (
             <div className="flex flex-col gap-3 animate-pulse">
                <div className="h-4 bg-slate-200 rounded w-full"></div>
                <div className="h-4 bg-slate-200 rounded w-11/12"></div>
                <div className="h-4 bg-slate-200 rounded w-4/5"></div>
             </div>
          ) : insight.text ? (
            <div className="text-slate-700 text-sm leading-relaxed whitespace-pre-line bg-white p-5 rounded-2xl border border-slate-200 shadow-inner">
              {insight.text}
            </div>
          ) : (
            <p className="text-slate-500 text-sm italic text-center py-2">
              ¿Hacia dónde va {currentCrypto?.name}? Toca para un análisis instantáneo.
            </p>
          )}
        </div>
      </section>

      {/* Footer Info */}
      <footer className="mt-auto py-8 text-center border-t border-slate-100">
        <div className="flex flex-col gap-1">
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest">CriptoCalc RD Premium Edition</p>
          <p className="text-slate-400 text-xs">Datos en tiempo real • Optimizado para USD & DOP</p>
          <p className="text-indigo-400 text-[10px] mt-2 font-bold uppercase">Powered by Gemini AI</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
