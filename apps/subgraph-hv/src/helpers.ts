import { BigInt } from "@graphprotocol/graph-ts";

// helper method to add a new item to an array
// mainly used to update array fields that can't be directly updated on the entity
function addItemToArray<T>(source: Array<T>, newItem: T): Array<T> {
  const newArray = source;
  newArray.push(newItem);
  return newArray;
}

// helper method to remove an item from an array
// mainly used to update array fields that can't be directly updated on the entity
function removeItemFromArray<T>(source: Array<T>, itemToRemove: T): Array<T> {
  const index = source.indexOf(itemToRemove);
  if (index > -1) {
    const newArray = source;
    newArray.splice(index, 1);
    return newArray;
  }
  return source;
}

// Because BigInt.pow() expects a exp parameter as u8 and it is almost impossible to downcast a BigInt, we simulate it using a loop of multiplications
function BigIntPow(value: BigInt, exp: BigInt): BigInt {
  let result = BigInt.fromI32(1);
  const expU32 = exp.toU32();
  // simulate an u8 to keep how this function works inline with BigInt.pow()
  if (expU32 > 255) {
    return BigInt.fromString((Number.MAX_SAFE_INTEGER as u64).toString());
  }
  for (let i: u32 = 0; i < expU32; i += 1) {
    result = result.times(value);
  }
  return result;
}

export { addItemToArray, removeItemFromArray, BigIntPow };
