import { stringifyStream } from '@discoveryjs/json-ext';
import consola from 'consola';
import { parse } from 'csv-parse';
import * as fs from 'node:fs';
import * as path from 'pathe';

import geocodesImport from '../data/geocodes.json';
import type { AltFinalLocation } from './types';

/*
The table 'alternate names' :
-----------------------------
alternateNameId   : the id of this alternate name, int
geonameid         : geonameId referring to id in table 'geoname', int
isolanguage       : iso 639 language code 2- or 3-characters; 4-characters 'post' for postal codes and 'iata','icao' and faac for airport codes, fr_1793 for French Revolution names,  abbr for abbreviation, link to a website (mostly to wikipedia), wkdt for the wikidataid, varchar(7)
alternate name    : alternate name or name variant, varchar(400)
isPreferredName   : '1', if this alternate name is an official/preferred name
isShortName       : '1', if this is a short name like 'California' for 'State of California'
isColloquial      : '1', if this alternate name is a colloquial or slang term. Example: 'Big Apple' for 'New York'.
isHistoric        : '1', if this alternate name is historic and was used in the past. Example 'Bombay' for 'Mumbai'.
from		  : from period when the name was used
to		  : to period when the name was used

Strip everything except geonameId, alternateName
Only select 'en' isoLanguage options,
isShortName takes precedence, if none, isPreferredName takes precedence, else skip */

type Record = [alternateNameid: string, geonameid: string, isolanguage: string, alternateName: string, isPreferredName: string, isShortName: string, isColloquial: string, isHistoric: string, from: string, to: string];

const readStream = fs.createReadStream(path.join(process.cwd(), 'dump/raw/alternateNamesV2.txt'), { encoding: 'utf8' });
const writeStream = fs.createWriteStream(path.join(process.cwd(), 'data/geocodeNames.json'), { encoding: 'utf8' });
const usableGeocodes = new Set(geocodesImport as string[]);

type LocationRecord = [alternateName: string, isPreferredName: number, isShortName: number, iso: string]
interface Locations {
  [geonameid: string]: LocationRecord;
}
const records: Locations = {};
// Initialize the parser
const parser = parse({
  delimiter: '\t',
  encoding: 'utf8',
  relax_quotes: true,
});


const updateRecord = (oldRecord: LocationRecord, newRecord: LocationRecord): LocationRecord => {
  const isEn = [oldRecord[3] === 'en', newRecord[3] === 'en'];
  const isShort = [oldRecord[2] === 1, newRecord[2] === 1];
  const isPreferred = [oldRecord[1] === 1, newRecord[1] === 1];
  const isShortPreferred = [isShort[0] && isPreferred[0], isShort[1] && isPreferred[1]];

  // If new record short name and preferred and English, highest priority
  if (isShortPreferred[1] && isEn[1])
    return newRecord;

  // If new record short and English, and old record is not short
  if (isShort[1] && isEn[1] && !isShort[0])
    return newRecord;

  // If new is preferred and English and old is not preferred or short
  if (isPreferred[1] && isEn[1] && !isPreferred[0] && !isShort[0])
    return newRecord;

  // If new is short and preferred and and old is not short or preferred or English
  /* if (!isShortPreferred[0] && isShortPreferred[1] && !isEn[0])
    return newRecord; */

  // If new is short and not short
  // if (!isShort[0] && isShort[1] && !isEn[0])
  // return newRecord;

  // If old record isn't english, short and preferred and new record is english
  if (!isEn[0] && isEn[1])
    return newRecord;

  return oldRecord;
};

parser.on('readable', () => {
  let record: Record;
  // eslint-disable-next-line no-cond-assign
  while ((record = parser.read()) !== null) {
    const geonameId = record[1];
    const iso = record[2];
    // Only refer to iso country codes or undefined, skip post or links, or historical or colloquial
    if (usableGeocodes.has(geonameId) && iso.length <= 3 && record[6] !== '1' && record[7] !== '1') {
      // Remove city, town, the names .replace(/[(),.:]/g, '').replace(/-/g, ' ').replace(/s{2,}/g, ' ')
      const alternateName = record[3].replace(/(?:\s+|^)(?:the|city|district)(?:\s+|$)/gi, '').trim();
      const isPreferredName = record[4] === '' ? 0 : 1;
      const isShortName = record[5] === '' ? 0 : 1;
      const newRecord: LocationRecord = [alternateName, isPreferredName, isShortName, iso];

      // If record doesn't exist, just add any option
      if (!records[geonameId]) {
        records[geonameId] = newRecord;
      } else {
        records[geonameId] = updateRecord(records[geonameId], newRecord);
      }
    }
  }
});
// Catch any error
parser.on('error', (err) => {
  consola.error(err.message);
});

parser.on('end', async () => {
  consola.success('Finished parsing.');
  const newRecords: AltFinalLocation = {};
  for (const geonameId of Object.keys(records)) {
    const altName = records[geonameId][0];
    newRecords[geonameId] = altName;
  }
  consola.success('Finished cleaning records.');
  const write = new Promise((resolve, reject) => {
    stringifyStream(newRecords, undefined, 2)
      .on('error', reject)
      .pipe(writeStream)
      .on('error', reject)
      .on('finish', resolve);
  });
  await write;
  writeStream.end();
  consola.success('Finished writing.');
});

consola.info('Generating preferred names...');
readStream.pipe(parser);

