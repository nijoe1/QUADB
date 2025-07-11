import * as PieceHasher from "@web3-storage/data-segment/multihash";
import { CARHeaderInfo, CARMetadata } from "@web3-storage/upload-client/types";
import * as raw from "multiformats/codecs/raw";
import { sha256 } from "multiformats/hashes/sha2";
import * as Link from "multiformats/link";

import * as CAR from "@/app/api/storacha/lib/car";
import { ShardingStream } from "@/app/api/storacha/lib/sharding";
import { createFileEncoderStream } from "@/app/api/storacha/lib/unixfs";

export const getPieceMetadata = async (file: File) => {
  const pieceHasher = PieceHasher;

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
      }),
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
      }),
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
