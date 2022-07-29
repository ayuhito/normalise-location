import consola from 'consola';
import stringify from 'json-stringify-pretty-compact';
import fs from 'node:fs';
import * as path from 'pathe';

import altNamesCountryImport from '../data/alternateNamesCountry.json';
import type { LocationCountry, NormaliseCountryData } from '../src/types';

const altNamesCountry = altNamesCountryImport as LocationCountry;

const createDataCountry = () => {
  consola.info('Creating src data for countries...');
  const writeStream = fs.createWriteStream(path.join(process.cwd(), 'src/data/altNamesCountry.json'), { encoding: 'utf8' });
  const normalisedData: NormaliseCountryData = {};

  for (const countryCode of Object.keys(altNamesCountry)) {
    normalisedData[countryCode] = normalisedData[countryCode] ?? {
      normalisedNames: [],
      altNames: {},
    };

    for (const name of Object.keys(altNamesCountry[countryCode])) {
      normalisedData[countryCode].normalisedNames.push(name);
      const index = normalisedData[countryCode].normalisedNames.length - 1; // Faster than running indexOf everytime
      for (const altName of altNamesCountry[countryCode][name].names) {
        const nameKey = altName.toLowerCase();
        normalisedData[countryCode].altNames[nameKey] = index;
      }
    }
  }
  writeStream.write(stringify(normalisedData));
  writeStream.end();
  consola.success('Finished creating src data for countries.');
};

createDataCountry();
