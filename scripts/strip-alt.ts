import consola from 'consola';
import { parse } from 'csv-parse';
import stringify from 'json-stringify-pretty-compact';
import * as fs from 'node:fs';
import * as path from 'pathe';

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

type LocationRecord = [alternateName: string, isPreferredName: number, isShortName: number]
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
// Use the readable stream api to consume records
parser.on('readable', () => {
  let record: Record;
  // eslint-disable-next-line no-cond-assign
  while ((record = parser.read()) !== null) {
    // We only want English names of places as the normalised form
    if (record[2] === 'en') {
      const geonameId = record[1];
      const alternateName = record[3];
      const isPreferredName = record[4] === '' ? 0 : 1;
      const isShortName = record[5] === '' ? 0 : 1;

      // If record doesn't exist, just add any option
      if (!records[geonameId]) {
        records[geonameId] = [alternateName, isPreferredName, isShortName];
        // Highest precedence is both preferred and short name
      } else if (isPreferredName === 1 && isShortName === 1) {
        records[geonameId] = [alternateName, isPreferredName, isShortName];
        // If isShort but the existing records is NOT isPreferred AND isShortName, replace it
      } else if (isShortName === 1 && !(records[geonameId][1] === 1 && records[geonameId][2] === 1)) {
        records[geonameId] = [alternateName, isPreferredName, isShortName];
        // If isPreferred but the existing records is NOT isShort replace it
      } else if (isPreferredName === 1 && records[geonameId][2] !== 1) {
        records[geonameId] = [alternateName, isPreferredName, isShortName];
      } // Otherwise skip reassignment
    }
  }
});
// Catch any error
parser.on('error', (err) => {
  consola.error(err.message);
});

parser.on('end', () => {
  consola.success('Finished parsing.');
  const newRecords: AltFinalLocation = {};
  for (const geonameId of Object.keys(records)) {
    const altName = records[geonameId][0];
    newRecords[geonameId] = altName;
  }
  consola.success('Finished cleaning records.');
  writeStream.write(stringify(newRecords));
  consola.success('Finished writing.');
  writeStream.end();
});

readStream.pipe(parser);
