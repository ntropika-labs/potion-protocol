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

export function createCriteriaId(criteriaHash: Bytes): string {
  return criteriaHash.toHexString();
}

export function createCriteriaJoinedCriteriaSetId(
  criteriaHash: Bytes,
  criteriaSetHash: Bytes
): string {
  return criteriaHash.toHexString() + criteriaSetHash.toHexString();
}

/**
 * Called when a CriteriaAdded event is emitted. Creates a new criteria entity.
 * @param {CriteriaAdded} event Descriptor of the event emitted.
 */
export function handleCriteriaAdded(event: CriteriaAdded): void {
  const criteriaId = createCriteriaId(event.params.criteriaHash);
  let criteria = Criteria.load(criteriaId);
  if (criteria == null) {
    criteria = new Criteria(criteriaId);
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
      [criteriaId]
    );
  }
}

/**
 * Called when a CriteriaSetAdded event is emitted. Creates a new CriteriaSet entity.
 * @param {CriteriaSetAdded} event Descriptor of the event emitted.
 */
export function handleCriteriaSetAdded(event: CriteriaSetAdded): void {
  const criteriaSetId = event.params.criteriaSetHash.toHexString();
  const criteriaSet = new CriteriaSet(criteriaSetId);
  const criteriaHashArray = event.params.criteriaSet;

  for (let i = 0; i < criteriaHashArray.length; i++) {
    const criteriaHash: Bytes = criteriaHashArray[i];
    const criteriaId = createCriteriaId(criteriaHash as Bytes);

    const criteriaJoinedCriteriaSetId = createCriteriaJoinedCriteriaSetId(
      criteriaHash as Bytes,
      event.params.criteriaSetHash
    );
    const criteriaJoinedCriteriaSet = new CriteriaJoinedCriteriaSet(
      criteriaJoinedCriteriaSetId
    );

    criteriaJoinedCriteriaSet.criteria = criteriaId;
    criteriaJoinedCriteriaSet.criteriaSet = criteriaSetId;
    criteriaJoinedCriteriaSet.save();
  }

  criteriaSet.save();
}
