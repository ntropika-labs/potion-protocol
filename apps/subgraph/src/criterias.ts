import { Bytes, log } from "@graphprotocol/graph-ts";
import {
  CriteriaAdded,
  CriteriaSetAdded,
} from "../generated/CriteriaManager/CriteriaManager";
import {
  Criteria,
  CriteriaSet,
  CriteriaJoinedCriteriaSet,
} from "../generated/schema";

export function createCriteriaJoinedCriteriaSetId(
  criteriaHash: Bytes,
  criteriaSetHash: Bytes
): Bytes {
  return criteriaHash.concat(criteriaSetHash);
}

/**
 * Called when a CriteriaAdded event is emitted. Creates a new criteria entity.
 * @param {CriteriaAdded} event Descriptor of the event emitted.
 */
export function handleCriteriaAdded(event: CriteriaAdded): void {
  let criteria = Criteria.load(event.params.criteriaHash);
  if (criteria == null) {
    criteria = new Criteria(event.params.criteriaHash);
    criteria.underlyingAsset = event.params.criteria.underlyingAsset;
    criteria.strikeAsset = event.params.criteria.strikeAsset;
    criteria.isPut = event.params.criteria.isPut;
    criteria.maxStrikePercent =
      event.params.criteria.maxStrikePercent.toBigDecimal();
    criteria.maxDurationInDays = event.params.criteria.maxDurationInDays;
    criteria.save();
  } else {
    log.warning(
      "Tried to save the same criteria multiple times, criteriaId is {}",
      [event.params.criteriaHash.toHexString()]
    );
  }
}

/**
 * Called when a CriteriaSetAdded event is emitted. Creates a new CriteriaSet entity.
 * @param {CriteriaSetAdded} event Descriptor of the event emitted.
 */
export function handleCriteriaSetAdded(event: CriteriaSetAdded): void {
  const criteriaSet = new CriteriaSet(event.params.criteriaSetHash);
  const criteriaHashArray = event.params.criteriaSet;

  for (let i = 0; i < criteriaHashArray.length; i++) {
    const criteriaHash = criteriaHashArray[i];

    const criteriaJoinedCriteriaSetId = createCriteriaJoinedCriteriaSetId(
      criteriaHash,
      event.params.criteriaSetHash
    );
    const criteriaJoinedCriteriaSet = new CriteriaJoinedCriteriaSet(
      criteriaJoinedCriteriaSetId
    );

    criteriaJoinedCriteriaSet.criteria = criteriaHash;
    criteriaJoinedCriteriaSet.criteriaSet = event.params.criteriaSetHash;
    criteriaJoinedCriteriaSet.save();
  }

  criteriaSet.save();
}
