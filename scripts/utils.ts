import { acceptedFeatureCodes, LocationObj } from '../src/types';

export const updateRecord = (oldRecord: LocationObj | undefined, newRecord: LocationObj): [LocationObj, boolean] => {
  if (oldRecord === undefined)
    return [newRecord, true];

  if (acceptedFeatureCodes.indexOf(newRecord.code) < acceptedFeatureCodes.indexOf(oldRecord.code)) {
    newRecord.names = [...oldRecord.names, ...newRecord.names];
    return [newRecord, true];
  }

  // Sometimes you can have same feature codes with matching names, take population as priority
  if (newRecord.code === oldRecord.code && newRecord.population > oldRecord.population) {
    newRecord.names = [...oldRecord.names, ...newRecord.names];
    return [newRecord, true];
  }

  return [oldRecord, false];
};
