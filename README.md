# TokenTrackr

### Monitor, track, and manage your tokens effortlessly.

This decentralized application (dApp) enables users to manage their cryptocurrency tokens by adding tokens to a watch list, tracking real-time and historical balances, checking token allowances, and performing essential operations like transfers and approvals, all with a user-friendly interface for a seamless experience.

## Run Locally

Clone the project

```bash
  git clone https://github.com/pranayjalan254/TokenTrackr.git
```

Go to the project directory

```bash
  cd tokentrackr
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

## Demo

[TokenTrackr](https://token-trackr.vercel.app/)

## Support

For support, email pranayjalan.work@gmail.com

## Tech Stack

**Client:** ReactJS, Vanilla CSS  
**Blockchain:** Ether.js
