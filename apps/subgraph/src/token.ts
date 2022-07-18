import {
  CollateralWhitelisted,
  ProductWhitelisted,
} from "../generated/Whitelist/Whitelist";
import { BigInt, Address, BigDecimal, log } from "@graphprotocol/graph-ts";
import { Token, Product } from "../generated/schema";
import { getTokenDecimals, getTokenName, getTokenSymbol } from "./tokenHelpers";
import { bigIntToDecimal } from "./helpers";
import { TokenType } from "./enums";

export function collateralToDecimals(value: BigInt): BigDecimal {
  // WORKAROUND: we use as collateral stable coins that always have 6 decimals
  // if in the future we will ever need to support collaterals with a different number of decimals
  //   we will also need as a param the token address to load the correct number of digits
  const decimals = 6;
  return bigIntToDecimal(value, decimals as i32);
}

export function createTokenId(address: Address): string {
  return address.toHexString();
}

function createToken(address: Address, tokenType: TokenType): void {
  const tokenId = createTokenId(address);
  let token = Token.load(tokenId);

  if (token == null) {
    log.info("Creating new {} token for address {}", [
      tokenType,
      address.toHexString(),
    ]);
    token = new Token(tokenId);
    token.address = address;
    token.decimals = getTokenDecimals(address);
    token.name = getTokenName(address);
    token.symbol = getTokenSymbol(address);
    token.tokenType = tokenType;
    token.save();
  }
}

export function handleProductWhitelist(event: ProductWhitelisted): void {
  log.info(
    "Creating new product for underlying {} with collateral {} and strike {}",
    [
      event.params.underlying.toHexString(),
      event.params.collateral.toHexString(),
      event.params.strike.toHexString(),
    ]
  );
  // Create an entity for the underlying of the product (if it does not exist already).
  createToken(event.params.underlying, TokenType.UNDERLYING);

  const productID =
    event.params.underlying.toHexString() +
    event.params.strike.toHexString() +
    event.params.collateral.toHexString();
  const product = new Product(productID);
  product.underlying = event.params.underlying.toHexString();
  product.strike = event.params.strike.toHexString();
  product.collateral = event.params.collateral.toHexString();
  product.isPut = event.params.isPut;
  product.isWhitelisted = true;
  product.save();
}

export function handleCollateralWhitelist(event: CollateralWhitelisted): void {
  // Create an entity for a collateral that is whitelisted (if it does not exist already).
  createToken(event.params.collateral, TokenType.COLLATERAL);
}
