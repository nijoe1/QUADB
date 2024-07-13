export interface VoterDeployment {
  // Contracts
  contractAddress: string;

  // Tables network
  tablelandHost:
    | "https://testnet.tableland.network"
    | "https://staging.tableland.network"
    | "http://localhost:8080";
}

export interface VoterDeployments {
  [key: string]: VoterDeployment;
}

export const deployments: VoterDeployments = {
  "optimism-goerli": {
    contractAddress: "",
    tablelandHost: "https://testnet.tableland.network",
  },
  "polygon-mumbai": {
    contractAddress: "",
    tablelandHost: "https://testnet.tableland.network",
  },
  "local-tableland": {
    // this is the address assuming you deploy on a fresh local-tableland instance
    contractAddress: "",
    tablelandHost: "http://localhost:8080",
  },
};
