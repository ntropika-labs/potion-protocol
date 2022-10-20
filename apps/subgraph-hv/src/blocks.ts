import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import { Block } from "../generated/schema";

export function createBlock(
  hash: Bytes,
  number: BigInt,
  timestamp: BigInt
): Block {
  const block = new Block(hash);
  block.number = number;
  block.timestamp = timestamp;
  block.save();
  return block;
}
