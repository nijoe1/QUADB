import { JSONFile } from "./JSONFile";
import { getTalyFilePath } from "./misc";
import { genTreeCommitment as genTallyResultCommitment } from "maci-crypto";

import { Signer } from "ethers";
import { MACIQV } from "../../typechain-types";

export const finalize = async ({
  MACIQVStrategy,
  Coordinator,
  voteOptionTreeDepth,
  outputDir,
}: {
  MACIQVStrategy: MACIQV;
  Coordinator: Signer;
  voteOptionTreeDepth: number;
  outputDir: string;
}) => {
  const tallyFile = getTalyFilePath(outputDir);

  const tally = (await JSONFile.read(tallyFile)) as any;

  const recipientTreeDepth = voteOptionTreeDepth;

  const newResultCommitment = genTallyResultCommitment(
    tally.results.tally.map((x: string) => BigInt(x)),
    BigInt(tally.results.salt),
    recipientTreeDepth
  );

  const perVOSpentVoiceCreditsCommitment = genTallyResultCommitment(
    tally.perVOSpentVoiceCredits.tally.map((x: string) => BigInt(x)),
    BigInt(tally.perVOSpentVoiceCredits.salt),
    recipientTreeDepth
  );

  console.log("Finalizing Round");
  try {
    // Finalize round
    let finalize = await MACIQVStrategy.connect(Coordinator).finalize(
      tally.totalSpentVoiceCredits.spent,
      tally.totalSpentVoiceCredits.salt,
      newResultCommitment.toString(),
      perVOSpentVoiceCreditsCommitment.toString()
    );

    const reciept = await finalize.wait();

    console.log(reciept);
  } catch (e) {
    console.log(e);
  }

  // Add a 4sec timeout to make sure state is updated on-chain
  await new Promise((r) => setTimeout(r, 4000));

  let isFinalized = await MACIQVStrategy.isFinalized();

  return isFinalized;
};
