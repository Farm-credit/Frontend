import React from 'react';

export const TokenCard: React.FC<{
  sellerAddress: string;
  amount: number;
  pricePerToken: number;
  currency: 'XLM' | 'USDC';
  totalPrice: number;
  onBuy: () => void;
}> = ({ sellerAddress, amount, pricePerToken, currency, totalPrice, onBuy }) => {
  const truncateAddress = (address: string) => {
    return address.slice(0, 8) + '...' + address.slice(-6);
  };

  return (
    <div className="group border border-gray-100 rounded-2xl p-6 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all duration-300 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-orange-400 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100">
              <span className="text-gray-400 font-mono text-xs">S</span>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Seller Address</p>
              <p className="text-sm font-mono text-gray-900 bg-gray-50 px-2 py-0.5 rounded">
                {truncateAddress(sellerAddress)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 md:gap-8">
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-500">Available</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-gray-900">{amount}</span>
                <span className="text-xs font-bold text-gray-400">CCT</span>
              </div>
            </div>
            <div className="space-y-1 border-x border-gray-50 px-6 md:px-8">
              <p className="text-xs font-medium text-gray-500">Price</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-orange-500">{pricePerToken}</span>
                <span className="text-xs font-bold text-orange-400/60 uppercase">{currency}</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-500">Total Value</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-lime-600">{totalPrice}</span>
                <span className="text-xs font-bold text-lime-500/60 uppercase">{currency}</span>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={onBuy}
          className="w-full md:w-auto px-10 py-4 bg-gray-900 hover:bg-black text-white font-bold rounded-xl transition-all duration-300 shadow-xl shadow-gray-200 hover:shadow-gray-300 active:scale-95"
        >
          Buy Tokens
        </button>
      </div>
    </div>
  );
};

export const ListTokensForm: React.FC<{
  amount: string;
  price: string;
  currency: 'XLM' | 'USDC';
  onAmountChange: (value: string) => void;
  onPriceChange: (value: string) => void;
  onCurrencyChange: (value: 'XLM' | 'USDC') => void;
  onSubmit: () => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}> = ({
  amount,
  price,
  currency,
  onAmountChange,
  onPriceChange,
  onCurrencyChange,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  return (
    <div className="mt-8 space-y-6 animate-in slide-in-from-top-4 duration-500">
      <div className="space-y-4">
        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">
            Amount (CCT)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => onAmountChange(e.target.value)}
            placeholder="0.00"
            disabled={isSubmitting}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-500/20 focus:border-lime-500 text-gray-900 font-bold placeholder:text-gray-300 disabled:bg-gray-50 transition-all"
          />
        </div>

        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">
            Price Per Token
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => onPriceChange(e.target.value)}
              placeholder="0.00"
              disabled={isSubmitting}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-500/20 focus:border-lime-500 text-gray-900 font-bold placeholder:text-gray-300 disabled:bg-gray-50 transition-all"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-gray-50 px-2 py-1 rounded text-[10px] font-black border border-gray-100">
              {currency}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">
            Payout Currency
          </label>
          <select
            value={currency}
            onChange={(e) => onCurrencyChange(e.target.value as 'XLM' | 'USDC')}
            disabled={isSubmitting}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-500/20 focus:border-lime-500 text-gray-900 font-bold disabled:bg-gray-50 transition-all appearance-none"
          >
            <option value="XLM">Stellar Lumens (XLM)</option>
            <option value="USDC">USD Coin (USDC)</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          onClick={onCancel}
          disabled={isSubmitting}
          className="flex-1 px-4 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold rounded-xl transition-all active:scale-[0.98] disabled:opacity-50"
        >
          Discard
        </button>
        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="flex-[2] px-6 py-3.5 bg-lime-600 hover:bg-lime-700 text-white font-black uppercase tracking-wider text-xs rounded-xl shadow-lg shadow-lime-900/10 transition-all active:scale-[0.98] disabled:bg-gray-300 disabled:shadow-none"
        >
          {isSubmitting ? 'Finalizing...' : 'Launch Listing'}
        </button>
      </div>
    </div>
  );
};

export const BuyModal: React.FC<{
  sellerAddress: string;
  availableAmount: number;
  pricePerToken: number;
  currency: 'XLM' | 'USDC';
  buyAmount: string;
  onAmountChange: (value: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}> = ({
  sellerAddress,
  availableAmount,
  pricePerToken,
  currency,
  buyAmount,
  onAmountChange,
  onConfirm,
  onCancel,
  isSubmitting = false,
}) => {
  const truncateAddress = (address: string) => {
    return address.slice(0, 8) + '...' + address.slice(-6);
  };

  const totalCost = buyAmount
    ? (parseFloat(buyAmount) * pricePerToken).toFixed(2)
    : '0.00';

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in transition-all">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden border border-gray-100">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 to-orange-500"></div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Buy Tokens</h2>
        <p className="text-sm text-gray-500 mb-8 font-medium">Purchase Carbon Credit Tokens directly from this seller.</p>

        <div className="bg-gray-50/80 rounded-xl p-5 mb-8 border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Seller</span>
            <span className="font-mono text-xs text-gray-700 bg-white px-2 py-0.5 rounded shadow-sm">
              {truncateAddress(sellerAddress)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-0.5">
              <p className="text-[10px] uppercase font-bold text-gray-400">Available</p>
              <p className="text-lg font-bold text-gray-900">{availableAmount} <span className="text-xs">CCT</span></p>
            </div>
            <div className="space-y-0.5 text-right">
              <p className="text-[10px] uppercase font-bold text-gray-400">Rate</p>
              <p className="text-lg font-bold text-orange-500">
                {pricePerToken} <span className="text-xs uppercase font-bold opacity-60">{currency}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <label className="block text-xs font-bold text-gray-700 mb-3 uppercase tracking-wide">
            Amount to Buy
          </label>
          <div className="relative">
            <input
              type="number"
              max={availableAmount}
              value={buyAmount}
              onChange={(e) => onAmountChange(e.target.value)}
              disabled={isSubmitting}
              placeholder="0.00"
              className="w-full pl-4 pr-12 py-4 bg-white border-2 border-gray-100 rounded-xl focus:outline-none focus:border-orange-400 text-xl font-bold text-gray-900 placeholder:text-gray-200 transition-colors disabled:bg-gray-50"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">CCT</span>
          </div>
        </div>

        {buyAmount && (
          <div className="bg-lime-50 rounded-xl p-5 mb-8 border border-lime-100 flex items-center justify-between animate-in slide-in-from-bottom-2 duration-300">
            <div>
              <p className="text-[10px] uppercase font-bold text-lime-700 mb-0.5">Estimated Total</p>
              <p className="text-2xl font-black text-lime-700">
                {totalCost} <span className="text-sm font-bold opacity-70 uppercase">{currency}</span>
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-lime-200/50 flex items-center justify-center">
              <span className="text-lime-700">✓</span>
            </div>
          </div>
        )}

        <div className="flex gap-4">
          <button
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex-1 px-4 py-4 text-gray-500 hover:text-gray-900 font-bold rounded-xl transition-all duration-200 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isSubmitting}
            className="flex-[2] px-4 py-4 bg-gray-900 hover:bg-black text-white font-bold rounded-xl transition-all duration-300 shadow-xl shadow-gray-200 active:scale-95 disabled:bg-gray-300 disabled:shadow-none"
          >
            {isSubmitting ? 'Processing...' : 'Confirm Purchase'}
          </button>
        </div>
      </div>
    </div>
  );
};

export const UserListingCard: React.FC<{
  amount: number;
  pricePerToken: number;
  currency: 'XLM' | 'USDC';
  status: 'active' | 'completed';
  listedAt: Date;
  onCancel: () => void;
}> = ({ amount, pricePerToken, currency, status, listedAt, onCancel }) => {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5 hover:border-gray-200 transition-all shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Position</span>
            <span className={`w-1.5 h-1.5 rounded-full ${status === 'active' ? 'bg-lime-500 animate-pulse' : 'bg-gray-300'}`}></span>
          </div>
          <p className="text-lg font-black text-gray-900 leading-none">
            {amount} <span className="text-xs text-gray-400">CCT</span>
          </p>
          <p className="text-xs font-bold text-orange-500 mt-1">
            {pricePerToken} <span className="opacity-60">{currency}</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Listed On</p>
          <p className="text-xs font-mono font-medium text-gray-700">{listedAt.toLocaleDateString()}</p>
        </div>
      </div>

      <button
        onClick={onCancel}
        className="w-full py-2.5 text-[10px] font-black uppercase tracking-widest bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors border border-red-100"
      >
        Cancel Listing
      </button>
    </div>
  );
};

export const EmptyState: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
      <span className="text-gray-300 text-xl font-black">?</span>
    </div>
    <p className="text-gray-400 text-sm font-medium italic">{message}</p>
  </div>
);

export const SectionHeader: React.FC<{ title: string; subtitle?: string }> = ({
  title,
  subtitle,
}) => (
  <div className="mb-10">
    <h2 className="text-4xl font-black text-gray-900 tracking-tight border-l-4 border-lime-500 pl-6 mb-3 italic">
      {title}
    </h2>
    {subtitle && <p className="text-gray-500 font-medium ml-7">{subtitle}</p>}
  </div>
);

export const WalletModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConnect: () => Promise<void>;
  isLoading: boolean;
}> = ({ isOpen, onClose, onConnect, isLoading }) => {
  if (!isOpen) return null;

  const wallets = [
    { name: 'Freighter', icon: 'F', description: 'Stellar browser extension' },
    { name: 'Albedo', icon: 'A', description: 'Direct browser connection' },
    { name: 'Rabet', icon: 'R', description: 'Lightweight extension' },
    { name: 'Generic', icon: 'G', description: 'Other injected providers' },
  ];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-[100] animate-in fade-in transition-all">
      <div className="bg-white rounded-[32px] p-10 max-w-lg w-full shadow-2xl relative overflow-hidden border border-gray-100">
        <div className="absolute top-0 left-0 w-full h-2.5 bg-gradient-to-r from-orange-400 via-lime-500 to-green-600"></div>
        
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-4xl font-black text-gray-900 tracking-tighter mb-2 italic">Gateway</h2>
            <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">Select your Stellar provider</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors text-gray-400 hover:text-gray-900"
          >
            <span className="text-2xl font-black">&times;</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 mb-10">
          {wallets.map((wallet) => (
            <button
              key={wallet.name}
              onClick={onConnect}
              disabled={isLoading}
              className="group flex items-center gap-4 p-5 bg-gray-50 hover:bg-gray-900 rounded-2xl border border-gray-100 transition-all active:scale-[0.98] disabled:opacity-50 text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-white group-hover:bg-gray-800 flex items-center justify-center font-black text-gray-400 group-hover:text-lime-400 shadow-sm transition-colors border border-gray-100 group-hover:border-gray-700">
                {wallet.icon}
              </div>
              <div className="flex-1">
                <p className="text-lg font-black text-gray-900 group-hover:text-white leading-none mb-1 transition-colors">{wallet.name}</p>
                <p className="text-xs text-gray-400 group-hover:text-gray-500 font-medium transition-colors uppercase tracking-wider">{wallet.description}</p>
              </div>
              <div className="opacity-0 group-hover:opacity-100 text-lime-400 transition-opacity translate-x-2 group-hover:translate-x-0 transition-transform">
                <span className="text-xl">→</span>
              </div>
            </button>
          ))}
        </div>

        <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100">
          <div className="flex gap-3">
            <span className="w-5 h-5 rounded-full bg-orange-200 flex items-center justify-center text-[10px] font-black text-orange-700">!</span>
            <p className="text-xs text-orange-800 font-medium leading-relaxed">
              Don&apos;t have a wallet? Install <a href="https://www.freighter.app/" target="_blank" rel="noopener noreferrer" className="font-black underline decoration-orange-300">Freighter</a> to get started securely with the Stellar network.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
