import { useState } from "react";
import { ethers } from "../../../ethers-5.6.esm.min.js";
import "./TokenAllowance.css";
import CheckAllowance from "./CheckAllowance";
import ApproveTokens from "./ApproveTokens";

const ERC20_ABI = [
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) external returns (bool)",
];

const TokenAllowance = () => {
  const [tokenAddress, setTokenAddress] = useState("");
  const [contractAddress, setContractAddress] = useState("");
  const [allowance, setAllowance] = useState(null);
  const [approvalAmount, setApprovalAmount] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [mode, setMode] = useState("check");

  const provider = new ethers.providers.Web3Provider(window.ethereum);

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
        />
      )}
    </div>
  );
};

export default TokenAllowance;
