import { Principal, Proof } from "@web3-storage/w3up-client/principal/ed25519";

import {
  CARHeaderInfo,
  CARMetadata,
  InvocationConfig,
} from "@web3-storage/upload-client/types";
import { sha256 } from "multiformats/hashes/sha2";
import * as PieceHasher from "@web3-storage/data-segment/multihash";
import * as Blob from "@/app/api/storacha/lib/blob/index.js";
import * as Link from "multiformats/link";
import * as CAR from "@/app/api/storacha/lib/car";
import * as raw from "multiformats/codecs/raw";

import { createFileEncoderStream } from "@/app/api/storacha/lib/unixfs";

import { ShardingStream } from "@/app/api/storacha/lib/sharding";
import { SharedSpace } from "@web3-storage/w3up-client/space";
export const getPieceMetadata = async (
  file: File,
  principal: Principal,
  space: SharedSpace,
  proof: Proof
) => {
  const pieceHasher = PieceHasher;
  const configure = () => {
    return {
      issuer: principal,
      with: space.did(),
      proofs: [proof],
    } as InvocationConfig;
  };
  let metadata: any = {};
  const shardIndexes = [];
  /** @type {import('./types.js').CARLink[]} */
  const shards = [];
  /** @type {import('./types.js').AnyLink?} */
  let root: any;
  await createFileEncoderStream(file)
    .pipeThrough(new ShardingStream())
    .pipeThrough(
      /** @type {TransformStream<import('./types.js').IndexedCARFile, import('./types.js').CARMetadata>} */
      new TransformStream({
        async transform(car, controller) {
          const bytes = new Uint8Array(await car.arrayBuffer());
          const digest = await sha256.digest(bytes);
          const conf = configure();
          // Invoke blob/add and write bytes to write target
          await Blob.add(conf, digest, bytes);
          const cid = Link.create(CAR.code, digest);

          let piece;
          if (pieceHasher) {
            const multihashDigest = pieceHasher.digest(bytes);
            /** @type {import('@web3-storage/capabilities/types').PieceLink} */
            piece = Link.create(raw.code, multihashDigest);
          }
          const { version, roots, size, slices } = car;

          metadata = { version, roots, size, cid, piece, slices };

          controller.enqueue(metadata);
        },
      })
    )
    .pipeTo(
      new WritableStream({
        write(meta) {
          root = root || meta.roots[0];
          shards.push(meta.cid);

          // add the CAR shard itself to the slices
          meta.slices.set(meta.cid.multihash, [0, meta.size]);
          shardIndexes.push(meta.slices);
        },
      })
    );

  /* c8 ignore next */
  if (!root) throw new Error("missing root CID");

  return metadata as CARMetadata & CARHeaderInfo;
};

export const getParsedMetadata = (metadata: CARMetadata & CARHeaderInfo) => {
  return {
    version: metadata.version,
    roots: metadata.roots.map((root) => root.toString()),
    size: metadata.size,
    cid: metadata.cid.toString(),
    piece: metadata.piece?.toString(),
    slices: metadata.slices,
  };
};
