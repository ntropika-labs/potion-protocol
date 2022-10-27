// helper method to add a new item to an array
// mainly used to update array fields that cam't be directly updated on the entity
function addItemToArray<T>(source: Array<T>, newItem: T): Array<T> {
  const newArray = source;
  newArray.push(newItem);
  return newArray;
}

function removeItemFromArray<T>(source: Array<T>, itemToRemove: T): Array<T> {
  const index = source.indexOf(itemToRemove);
  if (index > -1) {
    const newArray = source;
    newArray.splice(index, 1);
    return newArray;
  }
  return source;
}

export { addItemToArray, removeItemFromArray };
