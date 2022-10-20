import {
  NextRound,
  DepositWithReceipt,
  RedeemReceipt,
  WithdrawExchangeAsset,
  WithdrawExchangeAssetBatch,
  RoundsInputVault,
} from "../generated/RoundsInputVault/RoundsInputVault";
import { getOrCreateRound } from "./rounds";
import { Address, log } from "@graphprotocol/graph-ts";
import { setCurrentRound } from "./investmentVault";

function getVaultAddress(address: Address): Address {
  const contract = RoundsInputVault.bind(address);
  return contract.vault();
}

function handleNextRound(event: NextRound): void {
  const vaultAddress = getVaultAddress(event.address);
  getOrCreateRound(event.params.newRoundNumber, vaultAddress);
  setCurrentRound(vaultAddress, event.params.newRoundNumber);
  log.info("NextRound {} for InputVault {}", [
    event.params.newRoundNumber.toString(),
    event.address.toHexString(),
  ]);
}

function handleDepositWithReceipt(event: DepositWithReceipt): void {
  log.info("caller {}, owner {}, id {}, assets {}", [
    event.params.caller.toHexString(),
    event.params.owner.toHexString(),
    event.params.id.toString(),
    event.params.assets.toString(),
  ]);
}
function handleRedeemReceipt(event: RedeemReceipt): void {
  log.info("caller {}, owner {}, receiver {}, id {}, amount {}", [
    event.params.caller.toHexString(),
    event.params.owner.toHexString(),
    event.params.receiver.toHexString(),
    event.params.id.toString(),
    event.params.amount.toString(),
  ]);
}
function handleWithdrawExchangeAsset(event: WithdrawExchangeAsset): void {
  log.info(
    "caller {}, owner {}, receiver {}, sharesId {}, sharesAmount {}, assets {}",
    [
      event.params.caller.toHexString(),
      event.params.owner.toHexString(),
      event.params.receiver.toHexString(),
      event.params.sharesId.toString(),
      event.params.sharesAmount.toString(),
      event.params.assets.toString(),
    ]
  );
}
function handleWithdrawExchangeAssetBatch(
  event: WithdrawExchangeAssetBatch
): void {
  log.info(
    "caller {}, owner {}, receiver {}, sharesIds {}, sharesAmounts {}, assets {}",
    [
      event.params.caller.toHexString(),
      event.params.owner.toHexString(),
      event.params.receiver.toHexString(),
      event.params.sharesIds.toString(),
      event.params.sharesAmounts.toString(),
      event.params.assets.toString(),
    ]
  );
}

export {
  handleNextRound,
  handleDepositWithReceipt,
  handleRedeemReceipt,
  handleWithdrawExchangeAsset,
  handleWithdrawExchangeAssetBatch,
};
