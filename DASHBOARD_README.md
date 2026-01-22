# Dashboard Implementation

## Overview

The dashboard allows authenticated users to view their environmental impact, token holdings, and transaction history. It integrates with Stellar blockchain and Soroban smart contracts.

## Features

✅ **Wallet Connection**: Requires Freighter wallet connection (redirects if not connected)
✅ **CCT Token Balance**: Displays user's token balance from Soroban contract
✅ **CO₂ Offset**: Shows total carbon dioxide offset by the user
✅ **Trees Funded**: Displays number of trees funded through donations
✅ **Transaction History**: Complete table with date, type, amount, CO₂ impact, and transaction links
✅ **Retire Tokens**: CTA button for token retirement
✅ **Visual Charts**: Monthly contribution chart and impact over time
✅ **Responsive Design**: Works on all device sizes
✅ **Loading States**: Proper loading indicators throughout

## File Structure

```
app/
  dashboard/
    page.tsx              # Main dashboard page

components/
  dashboard/
    stats-card.tsx        # Reusable stat card component
    transaction-table.tsx # Transaction history table
    impact-charts.tsx     # Recharts visualization components
    retire-tokens-button.tsx # Retire tokens CTA

lib/
  wallet.ts               # Wallet connection utilities
  stellar.ts              # Stellar/Soroban integration

types/
  window.d.ts            # TypeScript definitions for Freighter wallet
```

## Setup

### 1. Install Dependencies

```bash
npm install stellar-sdk recharts
```

### 2. Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_CCT_TOKEN_CONTRACT=YOUR_CONTRACT_ADDRESS
```

### 3. Wallet Connection

The dashboard uses Freighter wallet for Stellar. Users need to:
1. Install [Freighter wallet](https://freighter.app)
2. Connect their wallet on the homepage
3. Navigate to `/dashboard`

## Implementation Details

### Wallet Connection

- Uses `localStorage` to persist wallet connection
- Checks for Freighter wallet API (`window.freighterApi`)
- Redirects to homepage if wallet not connected

### Stellar Integration

- **Token Balance**: Reads from Soroban contract (placeholder implementation)
- **Transaction History**: Fetches from Stellar Horizon API
- **Network**: Configurable via `NEXT_PUBLIC_STELLAR_NETWORK` (testnet/mainnet)

### Data Flow

1. Dashboard page checks wallet connection
2. If connected, fetches:
   - CCT token balance (Soroban)
   - Transaction history (Horizon API)
   - Calculates CO₂ offset and trees funded
3. Displays data in cards, charts, and table

## TODO: Soroban Contract Integration

The `getCCTTokenBalance` function currently returns mock data in development. To implement real Soroban contract calls:

```typescript
// In lib/stellar.ts
export const getCCTTokenBalance = async (publicKey: string): Promise<string> => {
  // TODO: Use Soroban SDK to call contract
  // Example:
  // const contract = new Contract(CCT_TOKEN_CONTRACT);
  // const result = await contract.call('balance', { id: publicKey });
  // return result.toString();
};
```

## Transaction Types

Transactions are categorized based on memo field:
- **Donation**: Memo contains "donation" or "donate"
- **Retirement**: Memo contains "retire" or "retirement"
- **Transfer**: Default for all other transactions

## Charts

Uses `recharts` library for visualizations:
- **Monthly Contributions**: Bar chart showing CCT contributions per month
- **CO₂ Impact Over Time**: Line chart showing cumulative CO₂ offset

## Responsive Design

- Mobile-first approach
- Grid layouts adapt to screen size
- Tables scroll horizontally on mobile
- Charts resize responsively

## Error Handling

- Graceful error handling for API failures
- Loading states for all async operations
- Empty states when no data available
- User-friendly error messages

## Testing

To test the dashboard:

1. Connect a wallet (or use mock data in development)
2. Navigate to `/dashboard`
3. Verify all data loads correctly
4. Test responsive design on different screen sizes

## Future Enhancements

- [ ] Real Soroban contract integration
- [ ] Token retirement modal with amount selection
- [ ] Export transaction history
- [ ] Filter transactions by type
- [ ] Pagination for transaction table
- [ ] Real-time updates via WebSocket
