// X Layer Testnet RPC — chain ID 195
// RPC: https://testrpc.xlayer.tech/evm
// Explorer: https://www.okx.com/explorer/xlayer-test

const RPC_URL = "https://testrpc.xlayer.tech/evm";

async function rpcCall(method: string, params: unknown[]) {
  const res = await fetch(RPC_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", method, params, id: 1 }),
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error.message);
  return json.result;
}

export async function getTestnetBalance(address: string): Promise<{
  balanceWei: string;
  balanceOKB: number;
  balanceUsd: number;
}> {
  const hex = await rpcCall("eth_getBalance", [address, "latest"]);
  const balanceWei = BigInt(hex).toString();
  const balanceOKB = Number(BigInt(hex)) / 1e18;
  // OKB price ~$50 (approximate for display)
  const balanceUsd = balanceOKB * 50;
  return { balanceWei, balanceOKB: Math.round(balanceOKB * 10000) / 10000, balanceUsd: Math.round(balanceUsd * 100) / 100 };
}

export async function getTestnetTxCount(address: string): Promise<number> {
  const hex = await rpcCall("eth_getTransactionCount", [address, "latest"]);
  return Number(BigInt(hex));
}

export async function getTestnetBlockNumber(): Promise<number> {
  const hex = await rpcCall("eth_blockNumber", []);
  return Number(BigInt(hex));
}

export async function getTestnetGasPrice(): Promise<string> {
  const hex = await rpcCall("eth_gasPrice", []);
  const gwei = Number(BigInt(hex)) / 1e9;
  return `${gwei.toFixed(2)} Gwei`;
}

export const XLAYER_TESTNET = {
  chainId: 195,
  chainName: "X Layer Testnet",
  rpcUrl: RPC_URL,
  explorerUrl: "https://www.okx.com/explorer/xlayer-test",
  nativeToken: "OKB",
  nativeDecimals: 18,
};
