import altNamesCountryImport from './data/altNamesCountry.json';
import type { NormaliseCountryData } from './types';

// Using direct import means the whole file will be 'rolled up' into JS for better memory usage
const altNamesCountry = altNamesCountryImport as NormaliseCountryData;

type Options = { country: string };

const normaliseLocation = (location: string, opts: Options): string => {
  if (altNamesCountry[opts.country] === undefined)
    throw new Error(`Invalid country code! ${opts.country}`);

  const countryNames = altNamesCountry[opts.country].altNames;
  const loc = location.toLowerCase();

  const index = countryNames[loc] || countryNames[loc.replace(/[.,:()]/g,"").replace("-", " ")];
  return altNamesCountry[opts.country].normalisedNames[index];
};

export { normaliseLocation };
