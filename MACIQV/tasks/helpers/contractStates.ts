import { Signer } from "ethers";
import { Deployments } from "./deployments";
import { HardhatRuntimeEnvironment } from "hardhat/types";

class ContractStates {
  private chainID: string;
  private roundID: string;
  private signer: Signer;
  private hre: HardhatRuntimeEnvironment;

  constructor(
    chainID: number,
    roundID: number,
    signer: Signer,
    hre: HardhatRuntimeEnvironment
  ) {
    this.chainID = chainID.toString();
    this.roundID = roundID.toString();
    this.signer = signer;
    this.hre = hre;
  }

  public async getAlloContract() {
    const deployments = new Deployments(parseInt(this.chainID), "allo");
    const alloAddress = deployments.getAllo();
    if (alloAddress === "") {
      throw new Error("Allo address not found in deployments");
    }
    return await this.hre.ethers.getContractAt(
      "Allo",
      alloAddress,
      this.signer
    );
  }

  public async getMACIQVStrategy() {
    const alloContract = await this.getAlloContract();
    const strategyAddress = (await alloContract.getPool(this.roundID)).strategy;
    return await this.hre.ethers.getContractAt(
      "MACIQV",
      strategyAddress,
      this.signer
    );
  }

  public async getVoteOptionTreeDepth() {
    const MACIQVStrategy = await this.getMACIQVStrategy();
    const pollContracts = await MACIQVStrategy.pollContracts();
    const PollContract = await this.hre.ethers.getContractAt(
      "ClonablePoll",
      pollContracts.poll,
      this.signer
    );
    const voteOptionTreeDepth = (await PollContract.treeDepths())
      .voteOptionTreeDepth;
    return voteOptionTreeDepth;
  }

  public async getMACIQVToken() {
    const alloContract = await this.getAlloContract();
    const token = (await alloContract.getPool(this.roundID)).token;
    return token;
  }
}

export default ContractStates;
