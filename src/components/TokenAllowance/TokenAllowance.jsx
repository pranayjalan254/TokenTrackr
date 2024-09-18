import { useState, useEffect } from "react";
import { ethers } from "../../../ethers-5.6.esm.min.js";
import "./TokenAllowance.css";
import CheckAllowance from "./CheckAllowance";
import ApproveTokens from "./ApproveTokens";
import { web3auth } from "../SignUp/signup";
import { ERC20_ABI } from "../../../ERC20_ABI.js";
import { popularTokens } from "../../PopularTokens.js";
import { chainConfig } from "../SignUp/signup";

const TokenAllowance = () => {
  const [tokenAddress, setTokenAddress] = useState(""); // Address of the token to check/approve
  const [contractAddress, setContractAddress] = useState(""); // Address of the contract to check/approve allowance
  const [allowance, setAllowance] = useState(null); // Token allowance
  const [approvalAmount, setApprovalAmount] = useState(""); // Amount of tokens to approve
  const [error, setError] = useState(""); // Error message
  const [success, setSuccess] = useState(""); // Success message
  const [mode, setMode] = useState("check"); // Mode: "check" or "approve"
  const [provider, setProvider] = useState(null); // Ethereum provider
  const [isApproving, setIsApproving] = useState(false); // Approval state
  const [selectedToken, setSelectedToken] = useState(""); // Currently selected token

  // List of popular tokens including ETH
  const tokens = [{ symbol: "ETH", address: null }, ...popularTokens];

  // Initialize Ethereum provider
  useEffect(() => {
    const setupProvider = async () => {
      let address = localStorage.getItem("walletAddress");

      if (address) {
        setProvider(
          new ethers.providers.JsonRpcProvider(chainConfig.rpcTarget)
        );
      } else {
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
      }
    };
    setupProvider();
  }, []);

  // Update token address when a new token is selected
  useEffect(() => {
    if (selectedToken) {
      setTokenAddress(selectedToken);
    }
  }, [selectedToken]);

  // Check token allowance for the specified contract
  const checkAllowance = async () => {
    if (!tokenAddress || !contractAddress) {
      setError("Please provide both token address and contract address.");
      return;
    }

    try {
      const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
      let address = localStorage.getItem("walletAddress");

      if (!address) {
        const signer = provider.getSigner();
        address = await signer.getAddress();
      }

      const allowanceAmount = await contract.allowance(
        address,
        contractAddress
      );
      setAllowance(ethers.utils.formatEther(allowanceAmount));
      setError("");
    } catch (err) {
      setError(
        "Error fetching allowance. Please check the addresses and try again."
      );
      setAllowance(null);
    }
  };

  // Approve tokens for the specified contract
  const approveTokens = async () => {
    if (!tokenAddress || !contractAddress || !approvalAmount) {
      setError(
        "Please provide token address, contract address, and approval amount."
      );
      return;
    }

    try {
      const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
      const signer = provider.getSigner();
      const ownerAddress = await signer.getAddress();
      const balance = await contract.balanceOf(ownerAddress);
      const decimals = await contract.decimals();
      const formattedBalance = ethers.utils.formatUnits(balance, decimals);

      if (parseFloat(formattedBalance) < parseFloat(approvalAmount)) {
        setError("Insufficient token balance for approval.");
        return;
      }

      setIsApproving(true);
      const tx = await contract
        .connect(signer)
        .approve(
          contractAddress,
          ethers.utils.parseUnits(approvalAmount, decimals)
        );
      await tx.wait();
      setSuccess("Approval successful!");
      setError("");
      setAllowance(null);
    } catch (err) {
      setError(
        "Error approving tokens. Connect to a wallet or try again later."
      );
      setSuccess("");
    } finally {
      setIsApproving(false);
    }
  };

  // Handle token selection from the popular tokens list
  const handleTokenSelect = (address) => {
    setSelectedToken(address);
  };

  return (
    <div className="token-allowance-container">
      <h2>Token Allowance</h2>

      <div className="toggle-mode">
        <button
          onClick={() => setMode("check")}
          className={mode === "check" ? "active" : ""}
        >
          Check Allowance
        </button>
        <button
          onClick={() => setMode("approve")}
          className={mode === "approve" ? "active" : ""}
        >
          Approve Allowance
        </button>
      </div>

      <div className="popular-tokens">
        {tokens
          .filter((t) => t.symbol !== "ETH")
          .map((tokenItem) => (
            <img
              key={tokenItem.symbol}
              src={tokenItem.logo}
              alt={tokenItem.symbol}
              className="token-logo"
              onClick={() => handleTokenSelect(tokenItem.address)}
            />
          ))}
      </div>

      {mode === "check" && (
        <CheckAllowance
          tokenAddress={tokenAddress}
          setTokenAddress={setTokenAddress}
          contractAddress={contractAddress}
          setContractAddress={setContractAddress}
          checkAllowance={checkAllowance}
          allowance={allowance}
          error={error}
        />
      )}

      {mode === "approve" && (
        <ApproveTokens
          tokenAddress={tokenAddress}
          setTokenAddress={setTokenAddress}
          contractAddress={contractAddress}
          setContractAddress={setContractAddress}
          approvalAmount={approvalAmount}
          setApprovalAmount={setApprovalAmount}
          approveTokens={approveTokens}
          success={success}
          error={error}
          setSuccess={setSuccess}
          setError={setError}
          isApproving={isApproving}
        />
      )}
    </div>
  );
};

export default TokenAllowance;
