import altNamesCountryImport from './data/altNamesCountry.json';
import type { NormaliseCountryData } from './types';

// Using direct import means the whole file will be 'rolled up' into JS for better memory usage
const altNamesCountry = altNamesCountryImport as NormaliseCountryData;

type Options = { country: string };

const normaliseLocation = (location: string, opts: Options): string => {
  if (altNamesCountry[opts.country] === undefined)
    throw new Error(`No country code!`);

  const countryNames = altNamesCountry[opts.country].altNames;
  const loc = location.toLowerCase();

  const index = countryNames[loc] || countryNames[loc.replace(/(?:\s+|^)(?:the|city|district)(?:\s+|$)/gi, '').replace(/[.,:()]/g, "").replace(/[-]/g, " ").replace(/s{2,}/g, " ").trim()];
  return index ? altNamesCountry[opts.country].normalisedNames[index] : location;
};

export { normaliseLocation };
