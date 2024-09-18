const CheckAllowance = ({
  tokenAddress,
  setTokenAddress,
  contractAddress,
  setContractAddress,
  checkAllowance,
  allowance,
  error,
}) => {
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

      <button onClick={checkAllowance}>Check Allowance</button>
      {error && <p className="error-message">{error}</p>}
      {allowance !== null && (
        <div className="allowance-result">
          <h3>Allowance</h3>
          <p>{allowance} Tokens</p>{" "}
        </div>
      )}
    </>
  );
};

export default CheckAllowance;
