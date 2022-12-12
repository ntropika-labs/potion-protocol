import {
  CollateralWhitelisted,
  ProductWhitelisted,
} from "../generated/Whitelist/Whitelist";
import {
  BigInt,
  Address,
  BigDecimal,
  Bytes,
  log,
} from "@graphprotocol/graph-ts";
import { Token, Product } from "../generated/schema";
import { getTokenDecimals, getTokenName, getTokenSymbol } from "./tokenHelpers";
import { bigIntToDecimal } from "./helpers";
import { TokenType } from "./enums";

export function collateralToDecimals(value: BigInt): BigDecimal {
  // WORKAROUND: the current version of the potion protocol always use USDC as a collateral that has decimals
  //   if in the future a new version of the protocol will allow to use different collaterals with different decimals
  //   we will ever need to support collaterals with a different number of decimals
  //   we will also need as a param the token address to load the correct number of digits
  const decimals = 6;
  return bigIntToDecimal(value, decimals as i32);
}

export function createProductId(
  underlying: Bytes,
  strike: Bytes,
  collateral: Bytes
): Bytes {
  return underlying.concat(strike).concat(collateral);
}

function createToken(address: Address, tokenType: TokenType): void {
  let token = Token.load(address);

  if (token == null) {
    log.info("Creating new {} token for address {}", [
      tokenType,
      address.toHexString(),
    ]);
    token = new Token(address);
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
  createToken(event.params.underlying, TokenType.UNDERLYING);

  const productID = createProductId(
    event.params.underlying,
    event.params.strike,
    event.params.collateral
  );
  const product = new Product(productID);
  product.underlying = event.params.underlying;
  product.strike = event.params.strike;
  product.collateral = event.params.collateral;
  product.isPut = event.params.isPut;
  product.isWhitelisted = true;
  product.save();
}

export function handleCollateralWhitelist(event: CollateralWhitelisted): void {
  // Create an entity for a collateral that is whitelisted (if it does not exist already).
  createToken(event.params.collateral, TokenType.COLLATERAL);
}
