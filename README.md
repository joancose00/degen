# Degen Inc. Call Platform

A decentralized application for interacting with the CallPlatform smart contract on Sonic Blaze testnet.

## Features

- Connect wallet via RainbowKit
- Make calls with token information
- View all calls or personal calls
- Track maximum gains for each call
- Admin panel for owner and oracle functionality
- Copy addresses to clipboard
- View tokens on DexScreener
- Dark mode UI with purple accents

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/degen-call-platform.git
   cd degen-call-platform/ui
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your values:
   ```env
   VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
   VITE_CONTRACT_ADDRESS=0x45893069bfAd401C833CD4906Eb4AA6f34183251
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment

### Cloudflare Pages

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy with Wrangler:
   ```bash
   npx wrangler pages deploy dist
   ```

Or connect your GitHub repository to Cloudflare Pages for automatic deployments.

## Environment Variables

- `VITE_WALLETCONNECT_PROJECT_ID`: Your WalletConnect Cloud project ID (required for wallet connectivity)
- `VITE_CONTRACT_ADDRESS`: The deployed CallPlatform contract address

## Contract Info

- Network: Sonic Blaze Testnet
- Chain ID: 57054
- RPC: https://rpc.blaze.soniclabs.com
- Explorer: https://blaze.soniclabs.com
- Default Contract: 0x45893069bfAd401C833CD4906Eb4AA6f34183251

## Technologies Used

- React + TypeScript
- Vite
- Wagmi + Viem
- RainbowKit
- TailwindCSS

## Admin Features

- **Owner**: Set oracle address
- **Oracle**: Update max gain for individual calls or batch update multiple calls

## License

MIT