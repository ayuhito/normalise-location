import consola from 'consola';
import { parse } from 'csv-parse';
import stringify from 'json-stringify-pretty-compact';
import * as fs from 'node:fs';
import * as path from 'pathe';

import altNamesV2 from '../data/geocodeNames.json';
import type { AltFinalLocation } from './types';


/* The main 'geoname' table has the following fields :
---------------------------------------------------
geonameid         : integer id of record in geonames database
name              : name of geographical point (utf8) varchar(200)
asciiname         : name of geographical point in plain ascii characters, varchar(200)
alternatenames    : alternatenames, comma separated, ascii names automatically transliterated, convenience attribute from alternatename table, varchar(10000)
latitude          : latitude in decimal degrees (wgs84)
longitude         : longitude in decimal degrees (wgs84)
feature class     : see http://www.geonames.org/export/codes.html, char(1)
feature code      : see http://www.geonames.org/export/codes.html, varchar(10)
country code      : ISO-3166 2-letter country code, 2 characters
cc2               : alternate country codes, comma separated, ISO-3166 2-letter country code, 200 characters
admin1 code       : fipscode (subject to change to iso code), see exceptions below, see file admin1Codes.txt for display names of this code; varchar(20)
admin2 code       : code for the second administrative division, a county in the US, see file admin2Codes.txt; varchar(80)
admin3 code       : code for third level administrative division, varchar(20)
admin4 code       : code for fourth level administrative division, varchar(20)
population        : bigint (8 byte int)
elevation         : in meters, integer
dem               : digital elevation model, srtm3 or gtopo30, average elevation of 3''x3'' (ca 90mx90m) or 30''x30'' (ca 900mx900m) area in meters, integer. srtm processed by cgiar/ciat.
timezone          : the iana timezone id (see file timeZone.txt) varchar(40)
modification date : date of last modification in yyyy-MM-dd format

Strip everything asciiname and alternatenames, but skip any feature classes we don't need below.
awk -v lineNo='1500000' 'NR > lineNo{exit};1' allCountries.txt > allCountriesSubset.txt

Feature Classes
A: country, state, region,...
H: stream, lake, ...
L: parks,area, ...
P: city, village,...
R: road, railroad
S: spot, building, farm
T: mountain,hill,rock,...
U: undersea
V: forest,heath,...

We only want to keep A and P. Remove all others. */

type FeatureClasses = 'A' | 'H' | 'L' | 'P' | 'R' | 'S' | 'T' | 'U' | 'V';
type Record = [GeonameId: string, Name: string, AsciiName: string, AlternateNames: string, Latitude: string, Longitude: string, FeatureClass: FeatureClasses, FeatureCode: string, CountryCode: string, CC2: string, Admin1Code: string, Admin2Code: string, Admin3Code: string, Admin4Code: string, Population: string, Elevation: string, Dem: string, Timezone: string, ModificationDate: string];

const readStream = fs.createReadStream(path.join(process.cwd(), 'dump/raw/allCountriesSubset.txt'), { encoding: 'utf8' });
const writeStream = fs.createWriteStream(path.join(process.cwd(), 'data/alternateNames.json'), { encoding: 'utf8' });
const writeStreamCountry = fs.createWriteStream(path.join(process.cwd(), 'data/alternateNamesCountry.json'), { encoding: 'utf8' });
const altNames = altNamesV2 as AltFinalLocation;

interface Locations {
  [preferredName: string]: {
    names: string[]
    preferredName: string
    // class: FeatureClasses
    population: number
  }
}
const records: Locations = {};

interface LocationCountry {
  [countryCode: string]: Locations;
}
const recordsCountry: LocationCountry = {};

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
    if (record[6] === 'A' || record[6] === 'P') {
      const preferredName = altNames[record[0]] ?? record[1];
      // Use set to get rid of duplicates
      const names = record[3] === '' ? new Set([]) : new Set(record[3].split(','));
      // Just in case preferred name doesn't exist
      names.add(preferredName);

      const recordObj = {
        names: [...names],
        preferredName,
        // class: record[6],
        population: Number(record[14])
      };

      records[preferredName] = recordObj;
      // Also add to country records
      const countryCode = record[8];
      recordsCountry[countryCode] = recordsCountry[countryCode] ?? {};
      recordsCountry[countryCode][preferredName] = recordObj;
    }
  }
});
// Catch any error
parser.on('error', (err) => {
  consola.error(err.message);
});

interface FinalExport {
  [name: string]: string[]
}

parser.on('end', () => {
  consola.success('Finished parsing.');
  const writeStream2 = fs.createWriteStream(path.join(process.cwd(), 'data/alternateNames2.json'), { encoding: 'utf8' });
  writeStream2.write(stringify(records));
  writeStreamCountry.write(stringify(recordsCountry));

  // Filter out all alt name conflicts with preferred names, every name has to be unique
  for (const preferredName of Object.keys(records)) {
    const record = records[preferredName];
    // Note that we delete duplicate records, so object keys can be undefined
    if (record) {

      // Check if any alt names exist in existing records
      let altFlag = false;
      for (const altName of record.names) {
        // Only keep the record with the higher population
        if (records[altName] && record.population > records[altName].population) {
          consola.info(`Replaced ${altName} ${records[altName].population} with ${record.preferredName} ${record.population}`);
          altFlag = true;
          delete records[altName];
          records[record.preferredName] = {
            preferredName: record.preferredName,
            names: record.names,
            population: record.population
          };
        }
      }

      // If no alt name replacement occurred, just add the record
      if (altFlag === false && !records[record.preferredName]) {
        records[record.preferredName] = {
          preferredName: record.preferredName,
          names: record.names,
          population: record.population
        };
      }

    }
  }
  consola.success('Finished cleaning out alt name duplicates.');

  // Convert to final export data
  const finalExport: FinalExport = {};
  for (const preferredName of Object.keys(records)) {
    const record = records[preferredName];
    finalExport[preferredName] = record.names;
  }
  consola.success('Finished cleaning records for export.');

  writeStream.write(stringify(finalExport));
  consola.success('Finished writing.');
  writeStream.end();
});

readStream.pipe(parser);
