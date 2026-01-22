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
    return address.slice(0, 6) + '...' + address.slice(-4);
  };

  return (
    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow bg-white">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-2">Seller</p>
          <p className="text-lg font-semibold text-black mb-4">
            {truncateAddress(sellerAddress)}
          </p>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Amount</p>
              <p className="text-xl font-bold text-black">{amount}</p>
              <p className="text-xs text-gray-500">CCT</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Price</p>
              <p className="text-xl font-bold text-orange-500">{pricePerToken}</p>
              <p className="text-xs text-gray-500">{currency}/token</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-xl font-bold text-lime-600">{totalPrice}</p>
              <p className="text-xs text-gray-500">{currency}</p>
            </div>
          </div>
        </div>

        <button
          onClick={onBuy}
          className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-bold rounded-lg transition-all duration-200"
        >
          Buy
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
}> = ({
  amount,
  price,
  currency,
  onAmountChange,
  onPriceChange,
  onCurrencyChange,
  onSubmit,
  onCancel,
}) => {
  return (
    <div className="mt-6 space-y-4">
      <div>
        <label className="block text-sm font-semibold text-black mb-2">
          Amount (CCT)
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          placeholder="Enter amount"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-lime-500 text-black"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-black mb-2">
          Price Per Token
        </label>
        <input
          type="number"
          step="0.01"
          value={price}
          onChange={(e) => onPriceChange(e.target.value)}
          placeholder="Enter price"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-lime-500 text-black"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-black mb-2">
          Currency
        </label>
        <select
          value={currency}
          onChange={(e) => onCurrencyChange(e.target.value as 'XLM' | 'USDC')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-lime-500 text-black"
        >
          <option value="XLM">XLM</option>
          <option value="USDC">USDC</option>
        </select>
      </div>

      <div className="flex gap-2 mt-4">
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-black font-bold rounded-lg transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          onClick={onSubmit}
          className="flex-1 px-4 py-3 bg-lime-600 hover:bg-lime-700 text-white font-bold rounded-lg transition-all duration-200"
        >
          Confirm Listing
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
}> = ({
  sellerAddress,
  availableAmount,
  pricePerToken,
  currency,
  buyAmount,
  onAmountChange,
  onConfirm,
  onCancel,
}) => {
  const truncateAddress = (address: string) => {
    return address.slice(0, 6) + '...' + address.slice(-4);
  };

  const totalCost = buyAmount
    ? (parseFloat(buyAmount) * pricePerToken).toFixed(2)
    : '0.00';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-xl">
        <h2 className="text-2xl font-bold text-black mb-6">Buy Tokens</h2>

        <div className="bg-gray-50 rounded p-4 mb-6">
          <p className="text-sm text-gray-600 mb-1">From Seller</p>
          <p className="font-semibold text-black mb-4">
            {truncateAddress(sellerAddress)}
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-600">Available</p>
              <p className="font-bold text-black">{availableAmount} CCT</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Price</p>
              <p className="font-bold text-orange-500">
                {pricePerToken} {currency}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-black mb-2">
            Amount to Buy (CCT)
          </label>
          <input
            type="number"
            max={availableAmount}
            value={buyAmount}
            onChange={(e) => onAmountChange(e.target.value)}
            placeholder="Enter amount"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 text-black"
          />
        </div>

        {buyAmount && (
          <div className="bg-lime-50 border border-lime-200 rounded p-4 mb-6">
            <p className="text-sm text-gray-600 mb-2">Total Cost</p>
            <p className="text-2xl font-bold text-lime-600">
              {totalCost} {currency}
            </p>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-black font-bold rounded-lg transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-bold rounded-lg transition-all duration-200"
          >
            Confirm Buy
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
    <div className="bg-white border border-gray-200 rounded p-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="text-sm text-gray-600">Listing</p>
          <p className="font-bold text-black">
            {amount} CCT @ {pricePerToken} {currency}
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded text-xs font-semibold ${
            status === 'active'
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {status}
        </span>
      </div>

      <p className="text-xs text-gray-500 mb-3">
        Listed: {listedAt.toLocaleDateString()}
      </p>

      <button
        onClick={onCancel}
        className="w-full px-3 py-2 text-sm bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded transition-colors duration-200"
      >
        Cancel Listing
      </button>
    </div>
  );
};

export const EmptyState: React.FC<{ message: string }> = ({ message }) => (
  <p className="text-gray-600 text-sm">{message}</p>
);

export const SectionHeader: React.FC<{ title: string; subtitle?: string }> = ({
  title,
  subtitle,
}) => (
  <div className="mb-8">
    <h2 className="text-3xl font-bold text-black mb-2">{title}</h2>
    {subtitle && <p className="text-gray-600">{subtitle}</p>}
  </div>
);
