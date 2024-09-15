const ApproveTokens = ({
  tokenAddress,
  setTokenAddress,
  contractAddress,
  setContractAddress,
  approvalAmount,
  setApprovalAmount,
  approveTokens,
  success,
  error,
  isApproving,
}) => {
  const handleApprove = async () => {
    try {
      await approveTokens();
    } catch (err) {
      console.error("Error during approval:", err);
    }
  };

  return (
    <>
      <div className="form-group">
        <label htmlFor="token-address">Token Address</label>
        <input
          type="text"
          id="token-address"
          value={tokenAddress}
          onChange={(e) => setTokenAddress(e.target.value)}
          placeholder="Enter token address"
        />
      </div>

      <div className="form-group">
        <label htmlFor="contract-address">Contract Address</label>
        <input
          type="text"
          id="contract-address"
          value={contractAddress}
          onChange={(e) => setContractAddress(e.target.value)}
          placeholder="Enter contract address"
        />
      </div>

      <div className="form-group">
        <label htmlFor="approval-amount">Amount to Approve</label>
        <input
          type="text"
          id="approval-amount"
          value={approvalAmount}
          onChange={(e) => setApprovalAmount(e.target.value)}
          placeholder="Enter amount to approve"
        />
      </div>

      <button onClick={handleApprove} disabled={isApproving}>
        {isApproving ? "Approving..." : "Approve"}
      </button>

      {success && <p className="success-message">{success}</p>}
      {error && <p className="error-message">{error}</p>}
    </>
  );
};

export default ApproveTokens;
