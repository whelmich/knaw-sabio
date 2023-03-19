import { ResultObject } from '../interfaces/Result';

export const getMaxAttributeValue = (
  objects: ResultObject[],
  attribute: number
) => {
  if (objects.length === 0) {
    return '';
  }
  let value = objects[0].values[attribute];
  objects.forEach((object) => {
    if (object.values[attribute] > value) {
      value = object.values[attribute];
    }
  });
  return value;
};

export const getMinAttributeValue = (
  objects: ResultObject[],
  attribute: number
) => {
  if (objects.length === 0) {
    return '';
  }
  let value = objects[0].values[attribute];
  objects.forEach((object) => {
    if (object.values[attribute] < value) {
      value = object.values[attribute];
    }
  });
  return value;
};
