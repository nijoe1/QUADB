// the Lit nodes inject ethers for us, so this fixes SIWE so that it uses the built in ethers provided by the Lit nodes.
globalThis.require = (name) => {
  if (name === "ethers") {
    return ethers;
  }
  throw new Error("unknown module " + name);
};

import * as W3Name from "w3name";
globalThis.W3Name = W3Name;

import { Buffer } from "buffer";
globalThis.Buffer = Buffer;

