import { useState, useEffect } from "react";
import { ethers } from "../../../ethers-5.6.esm.min.js";
import Modal from "react-modal";
import "./TokenTransfer.css";
import { web3auth } from "../SignUp/signup";
import { ERC20_ABI } from "../../../ERC20_ABI.js";

const TokenTransfer = () => {
  const [recipientAddress, setRecipientAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [provider, setProvider] = useState(null);
  const [error, setError] = useState("");
  const [token, setToken] = useState("ETH");
  const [tokenBalance, setTokenBalance] = useState(0);
  const [tokens] = useState([
    { symbol: "ETH", address: null },
    {
      symbol: "ChainLink",
      address: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
    },
  ]);

  useEffect(() => {
    const setupProvider = async () => {
      try {
        if (web3auth.connected) {
          const web3authProvider = await web3auth.connect();
          setProvider(new ethers.providers.Web3Provider(web3authProvider));
        } else if (window.ethereum) {
          await window.ethereum.request({ method: "eth_requestAccounts" });
          setProvider(new ethers.providers.Web3Provider(window.ethereum));
        } else {
          setError("No wallet provider found. Please connect a wallet.");
        }
      } catch (err) {
        setError("Error connecting to wallet. Please try again.");
        console.error("Provider setup error:", err);
      }
    };

    setupProvider();
  }, []);

  const fetchTokenBalance = async () => {
    if (!provider) return;

    const signer = provider.getSigner();
    const address = await signer.getAddress();

    if (token === "ETH") {
      const balance = await provider.getBalance(address);
      setTokenBalance(ethers.utils.formatEther(balance));
    } else {
      const tokenContract = new ethers.Contract(
        tokens.find((t) => t.symbol === token).address,
        ERC20_ABI,
        signer
      );
      const balance = await tokenContract.balanceOf(address);
      setTokenBalance(ethers.utils.formatUnits(balance, 18));
    }
  };

  useEffect(() => {
    fetchTokenBalance();
  }, [token, provider]);

  const handleTransfer = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTransactionDetails(null);

    if (!provider) {
      setError("No wallet connected. Please connect a wallet first.");
      setLoading(false);
      return;
    }

    try {
      const signer = provider.getSigner();

      if (token === "ETH") {
        const tx = {
          to: recipientAddress,
          value: ethers.utils.parseEther(amount),
        };
        const transaction = await signer.sendTransaction(tx);
        const receipt = await transaction.wait();
        setTransactionDetails({
          hash: transaction.hash,
          from: transaction.from,
          to: transaction.to,
          value: ethers.utils.formatEther(transaction.value),
          gasUsed: receipt.gasUsed.toString(),
          gasPrice: ethers.utils.formatUnits(receipt.effectiveGasPrice, "gwei"),
          blockNumber: receipt.blockNumber,
        });
      } else {
        const tokenContract = new ethers.Contract(
          tokens.find((t) => t.symbol === token).address,
          ERC20_ABI,
          signer
        );

        const transaction = await tokenContract.transfer(
          recipientAddress,
          ethers.utils.parseUnits(amount, 18)
        );

        const receipt = await transaction.wait();
        setTransactionDetails({
          hash: transaction.hash,
          from: transaction.from,
          to: recipientAddress,
          value: amount,
          gasUsed: receipt.gasUsed.toString(),
          gasPrice: ethers.utils.formatUnits(receipt.effectiveGasPrice, "gwei"),
          blockNumber: receipt.blockNumber,
        });
      }
      setModalIsOpen(true);
      setRecipientAddress("");
      setAmount("");
      setError("");
    } catch (error) {
      console.error("Error processing transaction:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="token-transfer-container">
      <h2>Token Transfer</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleTransfer}>
        <div className="form-group token-dropdown">
          <label htmlFor="token">Select Token</label>
          <select
            id="token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          >
            {tokens.map((token) => (
              <option key={token.symbol} value={token.symbol}>
                {token.symbol}
              </option>
            ))}
          </select>
        </div>

        <div className="balance-display">
          <p>
            Balance: {tokenBalance} {token}
          </p>
        </div>
        <div className="form-group">
          <label htmlFor="recipient">Recipient Address</label>
          <input
            type="text"
            id="recipient"
            placeholder="Recipient Wallet Address"
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="amount">Amount</label>
          <input
            type="text"
            id="amount"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send Payment"}
        </button>
      </form>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Transaction Details"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h3>Payment Successful</h3>
        {transactionDetails ? (
          <div className="transaction-details">
            <p>
              <strong>Transaction Hash:</strong> {transactionDetails.hash}
            </p>
            <p>
              <strong>From:</strong> {transactionDetails.from}
            </p>
            <p>
              <strong>To:</strong> {transactionDetails.to}
            </p>
            <p>
              <strong>Value:</strong> {transactionDetails.value} {token}
            </p>
            <p>
              <strong>Gas Price:</strong> {transactionDetails.gasPrice} GWEI
            </p>
            <p>
              <strong>Block Number:</strong> {transactionDetails.blockNumber}
            </p>
          </div>
        ) : (
          <p>No transaction details available.</p>
        )}
        <button onClick={() => setModalIsOpen(false)}>Close</button>
      </Modal>
    </div>
  );
};

export default TokenTransfer;
