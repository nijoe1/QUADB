import { expect, use } from "chai";
import chaiJsonSchema from "chai-json-schema";

use(chaiJsonSchema);

import { decryptApiKey } from "../src/index.js";


describe("decryptApiKey", () => {
  it("should decrypt API key successfully", async () => {
    const result = await decryptApiKey();

    console.log("And the result of the decryptApiKey is", result);
    // expect(result).to.be.jsonSchema(expectedSchema);
  }).timeout(100_000);
});
