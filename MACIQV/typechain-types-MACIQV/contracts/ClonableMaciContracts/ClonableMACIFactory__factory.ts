/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../common";
import type {
  ClonableMACIFactory,
  ClonableMACIFactoryInterface,
} from "./ClonableMACIFactory";

const _abi = [
  {
    inputs: [],
    name: "InvalidInitialization",
    type: "error",
  },
  {
    inputs: [],
    name: "NotInitializing",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint64",
        name: "version",
        type: "uint64",
      },
    ],
    name: "Initialized",
    type: "event",
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
    name: "MESSAGE_DATA_LENGTH",
    outputs: [
      {
        internalType: "uint8",
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
        name: "_signUpGatekeeper",
        type: "address",
      },
      {
        internalType: "address",
        name: "_initialVoiceCreditProxy",
        type: "address",
      },
      {
        internalType: "address",
        name: "_coordinator",
        type: "address",
      },
      {
        internalType: "uint8",
        name: "_maciId",
        type: "uint8",
      },
    ],
    name: "createMACI",
    outputs: [
      {
        internalType: "address",
        name: "_cloneMaci",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_verifier",
        type: "address",
      },
      {
        internalType: "address",
        name: "_vkRegistry",
        type: "address",
      },
      {
        internalType: "address",
        name: "_poll",
        type: "address",
      },
      {
        internalType: "address",
        name: "_owner",
        type: "address",
      },
      {
        internalType: "enum DomainObjs.Mode",
        name: "mode",
        type: "uint8",
      },
    ],
    name: "deployMessageProcessor",
    outputs: [
      {
        internalType: "address",
        name: "messageProcessorAddr",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_duration",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "maxMessages",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxVoteOptions",
            type: "uint256",
          },
        ],
        internalType: "struct Params.MaxValues",
        name: "_maxValues",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "uint8",
            name: "intStateTreeDepth",
            type: "uint8",
          },
          {
            internalType: "uint8",
            name: "messageTreeSubDepth",
            type: "uint8",
          },
          {
            internalType: "uint8",
            name: "messageTreeDepth",
            type: "uint8",
          },
          {
            internalType: "uint8",
            name: "voteOptionTreeDepth",
            type: "uint8",
          },
        ],
        internalType: "struct Params.TreeDepths",
        name: "_treeDepths",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "x",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "y",
            type: "uint256",
          },
        ],
        internalType: "struct DomainObjs.PubKey",
        name: "_coordinatorPubKey",
        type: "tuple",
      },
      {
        internalType: "address",
        name: "_maci",
        type: "address",
      },
      {
        internalType: "address",
        name: "_pollOwner",
        type: "address",
      },
    ],
    name: "deployPoll",
    outputs: [
      {
        internalType: "address",
        name: "pollAddr",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_verifier",
        type: "address",
      },
      {
        internalType: "address",
        name: "_vkRegistry",
        type: "address",
      },
      {
        internalType: "address",
        name: "_poll",
        type: "address",
      },
      {
        internalType: "address",
        name: "_messageProcessor",
        type: "address",
      },
      {
        internalType: "address",
        name: "_owner",
        type: "address",
      },
      {
        internalType: "enum DomainObjs.Mode",
        name: "mode",
        type: "uint8",
      },
    ],
    name: "deployTally",
    outputs: [
      {
        internalType: "address",
        name: "tallyAddr",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "_maciId",
        type: "uint8",
      },
    ],
    name: "getMaxVoteOptions",
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
        internalType: "address",
        name: "_clonableMaciImplementation",
        type: "address",
      },
      {
        internalType: "address",
        name: "_PollImplementation",
        type: "address",
      },
      {
        internalType: "address",
        name: "_TallyImplementation",
        type: "address",
      },
      {
        internalType: "address",
        name: "_MessageProcessorImplementation",
        type: "address",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    name: "maciSettings",
    outputs: [
      {
        components: [
          {
            internalType: "uint8",
            name: "intStateTreeDepth",
            type: "uint8",
          },
          {
            internalType: "uint8",
            name: "messageTreeSubDepth",
            type: "uint8",
          },
          {
            internalType: "uint8",
            name: "messageTreeDepth",
            type: "uint8",
          },
          {
            internalType: "uint8",
            name: "voteOptionTreeDepth",
            type: "uint8",
          },
        ],
        internalType: "struct Params.TreeDepths",
        name: "treeDepths",
        type: "tuple",
      },
      {
        internalType: "uint8",
        name: "stateTreeDepth",
        type: "uint8",
      },
      {
        internalType: "address",
        name: "verifier",
        type: "address",
      },
      {
        internalType: "address",
        name: "vkRegistry",
        type: "address",
      },
    ],
    stateMutability: "view",
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
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "_maciId",
        type: "uint8",
      },
      {
        components: [
          {
            components: [
              {
                internalType: "uint8",
                name: "intStateTreeDepth",
                type: "uint8",
              },
              {
                internalType: "uint8",
                name: "messageTreeSubDepth",
                type: "uint8",
              },
              {
                internalType: "uint8",
                name: "messageTreeDepth",
                type: "uint8",
              },
              {
                internalType: "uint8",
                name: "voteOptionTreeDepth",
                type: "uint8",
              },
            ],
            internalType: "struct Params.TreeDepths",
            name: "treeDepths",
            type: "tuple",
          },
          {
            internalType: "uint8",
            name: "stateTreeDepth",
            type: "uint8",
          },
          {
            internalType: "address",
            name: "verifier",
            type: "address",
          },
          {
            internalType: "address",
            name: "vkRegistry",
            type: "address",
          },
        ],
        internalType: "struct ClonableMACIFactory.MACI_SETTINGS",
        name: "_maciSettings",
        type: "tuple",
      },
    ],
    name: "setMaciSettings",
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
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b50611379806100206000396000f3fe608060405234801561001057600080fd5b50600436106100b45760003560e01c80637726bf4c116100715780637726bf4c146101d25780638da5cb5b146101e5578063c9ed4fdd14610215578063d4161da014610228578063f2fde38b1461023b578063f8c8765e1461024e57600080fd5b8063056e031c146100b957806308645404146100ce5780633bc69ee614610164578063447140fd1461018f578063683f3dc3146101b0578063715018a6146101ca575b600080fd5b6100cc6100c7366004610cc6565b610261565b005b61014b6100dc366004610d4e565b600060208181529181526040908190208151608081018352815460ff8082168352610100808304821696840196909652620100008204811694830194909452630100000090048316606082015260018201546002909201549093928216926001600160a01b0392048216911684565b60405161015b9493929190610d70565b60405180910390f35b610177610172366004610de2565b61032e565b6040516001600160a01b03909116815260200161015b565b6101a261019d366004610d4e565b61042e565b60405190815260200161015b565b6101b8600a81565b60405160ff909116815260200161015b565b6100cc610460565b6101776101e0366004610e47565b610474565b7f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c199300546001600160a01b0316610177565b610177610223366004610f18565b61056c565b610177610236366004610f7f565b610727565b6100cc610249366004610fd3565b610898565b6100cc61025c366004610fee565b6108d6565b610269610a3b565b60ff9182166000908152602081815260409182902083518051825482850151838701516060948501518a1663010000000263ff00000019918b1662010000029190911663ffff000019928b1661010090810261ffff19909516958c169590951793909317919091169190911717835592850151600183018054958701516001600160a01b039081169095026001600160a81b031990961691909716179390931790945591015160029092018054929091166001600160a01b0319909216919091179055565b60045460058054600092839261035e926001600160a01b039092169190846103558361104d565b90915550610a96565b604051633073cecf60e01b815290915081906001600160a01b03821690633073cecf90610395908b908b908b908a90600401611088565b600060405180830381600087803b1580156103af57600080fd5b505af11580156103c3573d6000803e3d6000fd5b505060405163f2fde38b60e01b81526001600160a01b0388811660048301528416925063f2fde38b9150602401600060405180830381600087803b15801561040a57600080fd5b505af115801561041e573d6000803e3d6000fd5b50939a9950505050505050505050565b60ff808216600090815260208190526040812054909161045791630100000090041660056111c3565b60ff1692915050565b610468610a3b565b6104726000610b3c565b565b60035460058054600092839261049b926001600160a01b039092169190846103558361104d565b6040516246133b60e11b815290915081906001600160a01b03821690628c2676906104d2908c908c908c908c908b906004016111d5565b600060405180830381600087803b1580156104ec57600080fd5b505af1158015610500573d6000803e3d6000fd5b505060405163f2fde38b60e01b81526001600160a01b0388811660048301528416925063f2fde38b9150602401600060405180830381600087803b15801561054757600080fd5b505af115801561055b573d6000803e3d6000fd5b50939b9a5050505050505050505050565b600066040000000000008660200151106105c05760405162461bcd60e51b815260206004820152601060248201526f496e76616c69644d617856616c75657360801b60448201526064015b60405180910390fd5b604080516060810182526001600160a01b0380861682526000602083018190529282018390526002546005805485936105ff931691846103558361104d565b60405163494ebb9f60e11b815290915081906001600160a01b0382169063929d773e90610638908e908e908e908e908a90600401611214565b600060405180830381600087803b15801561065257600080fd5b505af1158015610666573d6000803e3d6000fd5b50505050806001600160a01b031663e1c7392a6040518163ffffffff1660e01b8152600401600060405180830381600087803b1580156106a557600080fd5b505af11580156106b9573d6000803e3d6000fd5b505060405163f2fde38b60e01b81526001600160a01b0389811660048301528416925063f2fde38b9150602401600060405180830381600087803b15801561070057600080fd5b505af1158015610714573d6000803e3d6000fd5b50939d9c50505050505050505050505050565b6001546005805460009261074c926001600160a01b039091169190846103558361104d565b60ff8381166000908152602081815260409182902082516101008082018552825480871660808401908152828204881660a0850152620100008204881660c08501526301000000909104871660e0840152808352600184015496871694830185905295046001600160a01b039081168286018190526002909301548116606083018190529451636048211360e11b815296975090959087169463c09042269461080494309490939091908e908e908e906004016112b7565b600060405180830381600087803b15801561081e57600080fd5b505af1158015610832573d6000803e3d6000fd5b505060405163f2fde38b60e01b81523360048201526001600160a01b038516925063f2fde38b9150602401600060405180830381600087803b15801561087757600080fd5b505af115801561088b573d6000803e3d6000fd5b5050505050949350505050565b6108a0610a3b565b6001600160a01b0381166108ca57604051631e4fbdf760e01b8152600060048201526024016105b7565b6108d381610b3c565b50565b7ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a008054600160401b810460ff16159067ffffffffffffffff1660008115801561091c5750825b905060008267ffffffffffffffff1660011480156109395750303b155b905081158015610947575080155b156109655760405163f92ee8a960e01b815260040160405180910390fd5b845467ffffffffffffffff19166001178555831561098f57845460ff60401b1916600160401b1785555b610997610bad565b6109a033610bb5565b600180546001600160a01b03808c166001600160a01b031992831617909255600280548b8416908316179055600380548a841690831617905560048054928916929091169190911790558315610a3057845460ff60401b19168555604051600181527fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d29060200160405180910390a15b505050505050505050565b33610a6d7f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c199300546001600160a01b031690565b6001600160a01b0316146104725760405163118cdaa760e01b81523360048201526024016105b7565b6000604051733d602d80600a3d3981f3363d3d373d3d3d363d7360601b81528360601b60148201526e5af43d82803e903d91602b57fd5bf360881b6028820152826037826000f59150506001600160a01b038116610b365760405162461bcd60e51b815260206004820152601760248201527f455243313136373a2063726561746532206661696c656400000000000000000060448201526064016105b7565b92915050565b7f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c19930080546001600160a01b031981166001600160a01b03848116918217845560405192169182907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a3505050565b610472610bb9565b6108a05b7ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a0054600160401b900460ff1661047257604051631afcd79f60e31b815260040160405180910390fd5b803560ff81168114610c1357600080fd5b919050565b6040516080810167ffffffffffffffff81118282101715610c4957634e487b7160e01b600052604160045260246000fd5b60405290565b600060808284031215610c6157600080fd5b610c69610c18565b9050610c7482610c02565b8152610c8260208301610c02565b6020820152610c9360408301610c02565b6040820152610ca460608301610c02565b606082015292915050565b80356001600160a01b0381168114610c1357600080fd5b600080828403610100811215610cdb57600080fd5b610ce484610c02565b925060e0601f1982011215610cf857600080fd5b50610d01610c18565b610d0e8560208601610c4f565b8152610d1c60a08501610c02565b6020820152610d2d60c08501610caf565b6040820152610d3e60e08501610caf565b6060820152809150509250929050565b600060208284031215610d6057600080fd5b610d6982610c02565b9392505050565b60e08101610dab828760ff815116825260ff602082015116602083015260ff604082015116604083015260ff60608201511660608301525050565b60ff9490941660808201526001600160a01b0392831660a0820152911660c090910152919050565b803560028110610c1357600080fd5b600080600080600060a08688031215610dfa57600080fd5b610e0386610caf565b9450610e1160208701610caf565b9350610e1f60408701610caf565b9250610e2d60608701610caf565b9150610e3b60808701610dd3565b90509295509295909350565b60008060008060008060c08789031215610e6057600080fd5b610e6987610caf565b9550610e7760208801610caf565b9450610e8560408801610caf565b9350610e9360608801610caf565b9250610ea160808801610caf565b9150610eaf60a08801610dd3565b90509295509295509295565b600060408284031215610ecd57600080fd5b6040516040810181811067ffffffffffffffff82111715610efe57634e487b7160e01b600052604160045260246000fd5b604052823581526020928301359281019290925250919050565b6000806000806000806101608789031215610f3257600080fd5b86359550610f438860208901610ebb565b9450610f528860608901610c4f565b9350610f618860e08901610ebb565b9250610f706101208801610caf565b9150610eaf6101408801610caf565b60008060008060808587031215610f9557600080fd5b610f9e85610caf565b9350610fac60208601610caf565b9250610fba60408601610caf565b9150610fc860608601610c02565b905092959194509250565b600060208284031215610fe557600080fd5b610d6982610caf565b6000806000806080858703121561100457600080fd5b61100d85610caf565b935061101b60208601610caf565b925061102960408601610caf565b9150610fc860608601610caf565b634e487b7160e01b600052601160045260246000fd5b60006001820161105f5761105f611037565b5060010190565b6002811061108457634e487b7160e01b600052602160045260246000fd5b9052565b6001600160a01b038581168252848116602083015283166040820152608081016110b56060830184611066565b95945050505050565b600181815b808511156110f8578160ff048211156110de576110de611037565b808516156110eb57918102915b93841c93908002906110c3565b509250929050565b60008261110f57506001610b36565b8161111c57506000610b36565b8160018114611132576002811461113c5761116a565b6001915050610b36565b60ff84111561114d5761114d611037565b6001841b915060ff82111561116457611164611037565b50610b36565b5060208310610133831016604e8410600b841016171561119e575081810a60ff81111561119957611199611037565b610b36565b6111a883836110be565b8060ff048211156111bb576111bb611037565b029392505050565b6000610d6960ff841660ff8416611100565b6001600160a01b038681168252858116602083015284811660408301528316606082015260a0810161120a6080830184611066565b9695505050505050565b8581526101808101611233602083018780518252602090810151910152565b61126d606083018660ff815116825260ff602082015116602083015260ff604082015116604083015260ff60608201511660608301525050565b835160e0830152602084015161010083015282516001600160a01b039081166101208401526020840151811661014084015260409093015190921661016090910152949350505050565b6001600160a01b03898116825260ff8916602083015261016082019061130d604084018a60ff815116825260ff602082015116602083015260ff604082015116604083015260ff60608201511660608301525050565b96871660c083015294861660e082015292851661010084015290841661012083015290921661014090920191909152939250505056fea26469706673582212206f8e1f9d7b064b36d1d0daaf6818e66be51644b8679b38a684948db0553f83c064736f6c63430008140033";

type ClonableMACIFactoryConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ClonableMACIFactoryConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ClonableMACIFactory__factory extends ContractFactory {
  constructor(...args: ClonableMACIFactoryConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(overrides || {});
  }
  override deploy(overrides?: NonPayableOverrides & { from?: string }) {
    return super.deploy(overrides || {}) as Promise<
      ClonableMACIFactory & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(
    runner: ContractRunner | null
  ): ClonableMACIFactory__factory {
    return super.connect(runner) as ClonableMACIFactory__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ClonableMACIFactoryInterface {
    return new Interface(_abi) as ClonableMACIFactoryInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): ClonableMACIFactory {
    return new Contract(
      address,
      _abi,
      runner
    ) as unknown as ClonableMACIFactory;
  }
}
