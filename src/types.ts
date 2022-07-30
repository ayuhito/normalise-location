// http://www.geonames.org/statistics/total.html - lower index has higher precedence
export const acceptedFeatureCodes = ['ADM1', 'ADM2', 'ADM3', 'ADM4', 'ADM5', 'ADMD', 'PCLD', 'ZN', 'LTER', 'TERR', 'PPLC', 'PPLA', 'PPLA2', 'PPLA3', 'PPLA4', 'PPLA5', 'PPLG', 'PPLS', 'PPLX', 'PPLL', 'PPL'] as const;
export type FeatureCodes = typeof acceptedFeatureCodes[number];
export const isFeatureCode = (featureKey: string): featureKey is FeatureCodes => acceptedFeatureCodes.includes(featureKey as FeatureCodes);

export interface Locations {
  [preferredName: string]: {
    names: string[]
    preferredName: string
    geocode: string
    code: FeatureCodes
    population: number
  }
}

export interface LocationCountry {
  [countryCode: string]: Locations;
}

export interface NormaliseData {
  normalisedNames: string[];
  altNames: {
    [name: string]: number;
  }
}

export interface NormaliseCountryData {
  [countryCode: string]: NormaliseData;
}

