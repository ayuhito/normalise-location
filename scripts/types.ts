export type FeatureClasses = 'A' | 'H' | 'L' | 'P' | 'R' | 'S' | 'T' | 'U' | 'V';
export type GeocodeRecord = [GeonameId: string, Name: string, AsciiName: string, AlternateNames: string, Latitude: string, Longitude: string, FeatureClass: FeatureClasses, FeatureCode: string, CountryCode: string, CC2: string, Admin1Code: string, Admin2Code: string, Admin3Code: string, Admin4Code: string, Population: string, Elevation: string, Dem: string, Timezone: string, ModificationDate: string];

export interface AltFinalLocation {
  [geonameid: string]: string;
}

