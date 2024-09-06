import * as Client from "@web3-storage/w3up-client";
import { StoreMemory } from "@web3-storage/w3up-client/stores/memory";
import * as Proof from "@web3-storage/w3up-client/proof";
import { Signer } from "@web3-storage/w3up-client/principal/ed25519";
import * as DID from "@ipld/dag-ucan/did";
import { config } from "dotenv";
config();

export default async function handler(req: any, res: any) {
  if (req.method === "GET") {
    try {
      const { did } = req.query;

      if (!did) {
        return res.status(400).json({ error: "DID is required" });
      }

      console.log("Creating delegation for DID:", did);

      // Load client with specific private key
      const principal = Signer.parse(process.env.KEY!);
      const store = new StoreMemory();
      const client = await Client.create({ principal, store });

      // Add proof that this agent has been delegated capabilities on the space
      const proof = await Proof.parse(process.env.PROOF!);
      const space = await client.addSpace(proof);
      await client.setCurrentSpace(space.did());

      // Create a delegation for the requested DID
      const audience = DID.parse(did);
      const abilities = [
        "space/blob/add",
        "space/index/add",
        "filecoin/offer",
        "upload/add",
      ];
      const expiration = Math.floor(Date.now() / 1000) + 60 * 60 * 24; // 24 hours from now
      const delegation = await client.createDelegation(audience, abilities, {
        expiration,
      });

      // Serialize the delegation and send it to the frontend
      const archive = await delegation.archive();
      const result = archive.ok;

      return res.status(200).json({ success: true, result });
    } catch (error) {
      console.error("Error in delegation creation:", error);
      return res.status(500).json({ success: false, error: error });
    }
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
