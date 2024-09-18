# TokenTrackr

### Monitor, track, and manage your tokens effortlessly.

This decentralized application (dApp) enables users to manage their cryptocurrency tokens by adding tokens to a watch list, tracking real-time and historical balances, checking token allowances, and performing essential operations like transfers and approvals, all with a user-friendly interface for a seamless experience.

## Key Features

1. **Authentication & Wallet Connection**:  
   TokenTrackr offers multiple methods for users to connect their cryptocurrency wallets and authenticate their identity:

- **Web3Auth Login**: Users can connect using Web3Auth, which simplifies the process of connecting to decentralized applications using familiar authentication methods (e.g., email or social accounts). It provides access to wallets even for non-technical users, leveraging private key management through Web3Auth.

- **MetaMask Integration**: Users can directly connect their MetaMask wallet to interact with the dApp. This integration allows users to interact with the Ethereum blockchain through a secure, decentralized environment.

- **Manual Wallet Address Input**: For users who prefer not to use MetaMask or Web3Auth, the dApp allows them to manually input their wallet address. After entering the wallet address, TokenTrackr fetches the balance and allows the user to track and monitor their assets, although certain actions like token transfers will not be available in this mode.

2. **Token Management Dashboard**:
   Once logged in, users are taken to the main dashboard, which acts as a central hub for all the dApp’s features. The dashboard is designed to display key wallet information in a concise and visually appealing format.

- **Real-Time Wallet Balances**: The dashboard displays the user's wallet address, Ethereum (or other network) balance, and gas fees in real-time. This ensures that users are always aware of their current holdings and transaction costs.

- **Responsive Design**: The dashboard is fully responsive, ensuring users can interact with it smoothly across different devices. On smaller screens, non-essential information (such as current gas prices) is hidden to enhance usability.

3. **Token Watch List**:
   Users can create a personalized token watch list, allowing them to keep track of specific tokens they are interested in. The watch list can include popular tokens, custom tokens, or any ERC-20 token that the user wants to monitor.

- **Token Logos & Icons**: For popular tokens, the dApp displays token logos instead of text-based names, improving the visual appeal and user experience.

- **Custom Token Integration**: If a token is not on the watch list, users can input the custom token address, and TokenTrackr will fetch its balance and allow it to be added to the list.

4. **Historical Data Tracking**:
   The historical data tracking feature allows users to view their wallet balances over time, providing an in-depth understanding of their token holdings' performance.

- **Multiple Token Support**: The dApp supports the historical tracking of several popular tokens (e.g., USDC, DAI, Wrapped Ether, ChainLink, Uniswap), allowing users to analyze their portfolios comprehensively.

- **Custom Date Selection**: Users can select custom dates to view token balances at specific points in time, helping them analyze their portfolio's performance over any given period.

- **Graphical Display**: The historical data is displayed through visually appealing charts, allowing users to track trends easily. This data is fetched from reliable sources like Bitquery and Alchemy, ensuring accuracy.

5. **Token Allowances Management**:
   TokenTrackr provides a feature for managing ERC-20 token allowances, which allows users to see which decentralized applications have permission to spend their tokens and modify or revoke those permissions.

- **Custom Token Allowances**: The dApp also supports custom tokens, allowing users to add any ERC-20 token and view or adjust allowances for that token. Extensive care taken to restrict users to allow tokens more than their balance.

6. **Token Transfer & Custom Token Support**:
   TokenTrackr allows users to seamlessly transfer tokens directly through the platform. Users can transfer Sepolia ETH or other supported tokens using a clean and intuitive UI.

- **Popular Tokens & Custom Token Selection**: The dApp includes a list of popular tokens users can easily select for transfer. Additionally, users can input a custom token address if the token they want to transfer isn't on the list, making the platform flexible and user-friendly.

- **Switch Between Tokens**: Users can easily switch between tokens when making a transfer. They can revert to the default network token (Sepolia ETH) or continue with their selected token. The app also ensures that the correct balance is displayed before the transfer is made.

## Tech Stack

1. **Frontend:**

- **React.js**: TokenTrackr’s UI is built using React.js, providing a responsive and dynamic interface.
- **CSS**: Custom styles ensure a consistent theme across the dApp, making it visually appealing and functional on all screen sizes.

2. **Blockchain:**

- **Web3Auth:** Used for simplified user login and wallet connection.
- **MetaMask:** Direct integration for Ethereum wallet connections.
- **Ethers.js:** The app uses ethers.js for blockchain interactions like fetching balances, transferring tokens, and interacting with smart contracts.
- **Alchemy API**: These services are used to fetch real-time and historical token balances from the Ethereum network.

## Run Locally

Clone the project

```bash
  git clone https://github.com/pranayjalan254/TokenTrackr.git
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run dev
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file  
Create a .env file in the root directory.

`VITE_CLIENT_ID`  
You need to setup your Web3auth Dashboard to get the clientID.

`VITE_API_KEY`  
This is the alchemy API Key to fetch the historical token balances. You need to make an alchemy account and get the API Key.

## Improvements Needed

- **Web3Auth Session Handling:** Currently, Web3Auth behaves inconsistently when the site is refreshed. This issue needs to be resolved to ensure smoother user experience during session restoration and wallet reconnections. Metamask and manual input address works fine.

- **Historical Balance Fetching:** The process of retrieving historical balances uses approximations for fetching block numbers. Various methods were tested, including binary search to find the nearest block number for a specific date, but this approach was too slow when querying a large range of dates. Although some success was found when retrieving historical balances for ChainLink tokens, providing nearly accurate results, the overall performance needs improvement.

## Note

The dApp currently runs on Sepolia Tesnet. The popular tokens are configured as per testnet and will not work on mainnet as intended. To change to mainnet, we need to chain the chainconfig as well as the token addresses for popular tokens.

## Demo

[TokenTrackr](https://token-trackr.vercel.app/)

## Support

For support, email pranayjalan.work@gmail.com
