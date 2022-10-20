import { Address, BigInt, log } from "@graphprotocol/graph-ts";
import { Token } from "../generated/schema";
import { ERC20 } from "../generated/InvestmentVault/ERC20";

function createToken(id: Address): Token {
  const contract = ERC20.bind(id);
  const token = new Token(id);
  token.name = contract.name();
  token.symbol = contract.symbol();
  token.decimals = BigInt.fromI32(contract.decimals());
  token.save();
  log.info(
    "Token has been created for address {}, name {}, symbol {}, decimals {}",
    [id.toHexString(), token.name, token.symbol, token.decimals.toString()]
  );
  return token;
}

export function getOrCreateToken(id: Address): Token {
  const token = Token.load(id);
  if (token == null) {
    return createToken(id);
  }
  return token;
}
