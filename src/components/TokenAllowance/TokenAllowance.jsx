import { useState, useEffect } from "react";
import { ethers } from "../../../ethers-5.6.esm.min.js";
import "./TokenAllowance.css";
import CheckAllowance from "./CheckAllowance";
import ApproveTokens from "./ApproveTokens";
import { web3auth } from "../SignUp/signup";

const ERC20_ABI = [
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function balanceOf(address owner) view returns (uint256)",
];

const TokenAllowance = () => {
  const [tokenAddress, setTokenAddress] = useState("");
  const [contractAddress, setContractAddress] = useState("");
  const [allowance, setAllowance] = useState(null);
  const [approvalAmount, setApprovalAmount] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [mode, setMode] = useState("check");
  const [provider, setProvider] = useState(null);
  const [isApproving, setIsApproving] = useState(false);

  useEffect(() => {
    const setupProvider = async () => {
      if (web3auth.connected) {
        const web3authProvider = await web3auth.connect();
        setProvider(new ethers.providers.Web3Provider(web3authProvider));
      } else if (window.ethereum) {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        setProvider(new ethers.providers.Web3Provider(window.ethereum));
      } else {
        setError("No wallet provider found. Please connect a wallet.");
      }
    };

    setupProvider();
  }, []);

  const checkAllowance = async () => {
    if (!tokenAddress || !contractAddress) {
      setError("Please provide both token address and contract address.");
      return;
    }

    try {
      const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
      const signer = provider.getSigner();
      const ownerAddress = await signer.getAddress();
      const allowanceAmount = await contract.allowance(
        ownerAddress,
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

      // Check token balance
      const balance = await contract.balanceOf(ownerAddress);
      const formattedBalance = ethers.utils.formatUnits(balance, 18);
      if (parseFloat(formattedBalance) < parseFloat(approvalAmount)) {
        setError("Insufficient token balance for approval.");
        return;
      }

      setIsApproving(true); // Disable button and show "Approving..."
      const tx = await contract
        .connect(signer)
        .approve(contractAddress, ethers.utils.parseUnits(approvalAmount, 18));
      await tx.wait();
      setSuccess("Approval successful!");
      setError("");
      setAllowance(null);
    } catch (err) {
      setError(
        "Error approving tokens. Please check the details and try again."
      );
      setSuccess("");
    } finally {
      setIsApproving(false); // Enable button again after process
    }
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
