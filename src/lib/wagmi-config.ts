import { http, createConfig } from "wagmi";
import { defineChain } from "viem";
import { injected, metaMask } from "wagmi/connectors";

export const xlayerTestnet = defineChain({
  id: 1952,
  name: "X Layer Testnet",
  nativeCurrency: { name: "OKB", symbol: "OKB", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://testrpc.xlayer.tech/evm"] },
  },
  blockExplorers: {
    default: { name: "OKX Explorer", url: "https://www.okx.com/explorer/xlayer-test" },
  },
  testnet: true,
});

export const wagmiConfig = createConfig({
  chains: [xlayerTestnet],
  connectors: [
    injected(),
    metaMask(),
  ],
  transports: {
    [xlayerTestnet.id]: http("https://testrpc.xlayer.tech/evm"),
  },
  ssr: true,
});
