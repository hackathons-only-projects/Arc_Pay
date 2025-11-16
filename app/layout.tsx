// app/layout.tsx
'use client'; // This file now needs to be a client component for the provider

import './globals.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { sepolia, bscTestnet } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

import { defineChain } from 'viem'; // 👈 Import defineChain


export const arcTestnet = defineChain({
  id: 5042002,
  name: 'Arc Testnet',
  nativeCurrency: {
    decimals: 6,
    name: 'USDC',
    symbol: 'USDC',
  },
  rpcUrls: {
    default: { http: ['https://rpc.testnet.arc.network'] },
  },
  blockExplorers: {
    default: { name: 'Arcscan', url: 'https://testnet.arcscan.app' },
  },
});

// --- Wagmi Configuration ---
const config = createConfig({
  chains: [sepolia, arcTestnet, bscTestnet],
  connectors: [injected()], // For MetaMask
  transports: {
    [sepolia.id]: http(),
    [arcTestnet.id]: http(),
    [bscTestnet.id]: http(),
  },
});

const queryClient = new QueryClient();
// -------------------------

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </WagmiProvider>
      </body>
    </html>
  );
}