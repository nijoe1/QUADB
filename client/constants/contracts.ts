const QUADB = "0x120948a3df0eae291ac71c5d7297c3c710075c0f";

export const ADDRESS = QUADB;
export const CONTRACT_ADDRESSES = ADDRESS;

export const CONTRACT_ADDRESS = {
  "314": ADDRESS,
  "314159": ADDRESS,
};

export const CONTRACT_ADDRESS_BY_NETWORK = {
  "314": ADDRESS,
  "314159": ADDRESS,
};

export const CONTRACT_ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_registry",
        type: "address",
      },
      {
        internalType: "address",
        name: "_registrar",
        type: "address",
      },
      {
        internalType: "address",
        name: "_publicResolver",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "_baseNode",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "_gateImplementation",
        type: "address",
      },
      {
        internalType: "address",
        name: "_subscriptionImplementation",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "chainid",
        type: "uint256",
      },
    ],
    name: "ChainNotSupported",
    type: "error",
  },
  {
    inputs: [],
    name: "InstanceAlreadyExists",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidTokenAmount",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidTokenSender",
    type: "error",
  },
  {
    inputs: [],
    name: "NoCodeOwner",
    type: "error",
  },
  {
    inputs: [],
    name: "NoInstanceAccess",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [],
    name: "DOMAIN_ID",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "PUBLIC_RESOLVER",
    outputs: [
      {
        internalType: "contract IFNSResolver",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "QUADB_NODE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "REGISTRAR",
    outputs: [
      {
        internalType: "contract IFNSRegistrar",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "REGISTRY",
    outputs: [
      {
        internalType: "contract IFNS",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "TABLELAND",
    outputs: [
      {
        internalType: "contract ITablelandTables",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    name: "codeOwner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
    ],
    name: "createDBSpace",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_DBSpace",
        type: "bytes32",
      },
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
    ],
    name: "createDBSubSpace",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_instance",
        type: "bytes32",
      },
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
      {
        internalType: "string",
        name: "_about",
        type: "string",
      },
      {
        internalType: "string",
        name: "_chatID",
        type: "string",
      },
      {
        internalType: "string",
        name: "_codeIPNS",
        type: "string",
      },
      {
        internalType: "string",
        name: "_IPNSEncryptedKey",
        type: "string",
      },
    ],
    name: "createInstanceCode",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_node",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "_price",
        type: "uint256",
      },
      {
        internalType: "address[]",
        name: "_members",
        type: "address[]",
      },
      {
        internalType: "string",
        name: "_metadataCID",
        type: "string",
      },
      {
        internalType: "string",
        name: "_chatID",
        type: "string",
      },
      {
        internalType: "string",
        name: "_IPNS",
        type: "string",
      },
      {
        internalType: "string",
        name: "_IPNSEncryptedKey",
        type: "string",
      },
    ],
    name: "createSpaceInstance",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_instanceID",
        type: "bytes32",
      },
    ],
    name: "extendInstanceSubscription",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_sender",
        type: "address",
      },
      {
        internalType: "address",
        name: "_gatedContract",
        type: "address",
      },
    ],
    name: "getAccess",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_salt",
        type: "bytes32",
      },
    ],
    name: "getDeterministicAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_instanceID",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "_owner",
        type: "address",
      },
    ],
    name: "getRemainingSubscriptionTime",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_salt",
        type: "bytes32",
      },
    ],
    name: "getSuscriptionDeterministicAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getTime",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_instanceID",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "_subscriber",
        type: "address",
      },
    ],
    name: "hasActiveSubscription",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_instance",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "_sender",
        type: "address",
      },
    ],
    name: "hasMutateAccess",
    outputs: [
      {
        internalType: "bool",
        name: "access",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_instance",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "_sender",
        type: "address",
      },
    ],
    name: "hasViewAccess",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_instance",
        type: "bytes32",
      },
      {
        internalType: "address[]",
        name: "_members",
        type: "address[]",
      },
    ],
    name: "insertNewMembers",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    name: "instanceSubscription",
    outputs: [
      {
        internalType: "contract IGated",
        name: "subscriptionContract",
        type: "address",
      },
      {
        internalType: "address",
        name: "creator",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "prize",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    name: "instances",
    outputs: [
      {
        internalType: "address",
        name: "gatedContract",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "creator",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    name: "isType",
    outputs: [
      {
        internalType: "enum Core.Types",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "onERC721Received",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_instanceID",
        type: "bytes32",
      },
    ],
    name: "purchaseInstanceSubscription",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_instance",
        type: "bytes32",
      },
      {
        internalType: "address[]",
        name: "_members",
        type: "address[]",
      },
    ],
    name: "removeMembers",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "tableIDs",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "tables",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferDomainOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_codeID",
        type: "bytes32",
      },
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
      {
        internalType: "string",
        name: "_about",
        type: "string",
      },
    ],
    name: "updateCode",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_instanceID",
        type: "bytes32",
      },
      {
        internalType: "string",
        name: "_metadataCID",
        type: "string",
      },
    ],
    name: "updateInstance",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
] as const;
