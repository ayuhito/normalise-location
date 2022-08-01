import { expect } from 'chai';
import { describe, it } from 'mocha';

import { normaliseLocation } from '../src/normalise-country';

// Just test edge cases
describe('normalise location countries', () => {
  it('Sydney AU', () => {
    expect(normaliseLocation('Sydney', { country: 'AU' })).to.equal('Sydney');
  });

  it('Brussels BE', () => {
    expect(normaliseLocation('Brussels', { country: 'BE' })).to.equal('Brussels');
    expect(normaliseLocation('Brussel', { country: 'BE' })).to.equal('Brussels');
  });

  it('Sofia BG', () => {
    expect(normaliseLocation('Sofia', { country: 'BG' })).to.equal('Sofia');
  });

  it('Sao Paulo BR', () => {
    expect(normaliseLocation('Sao Paulo', { country: 'BR' })).to.equal('São Paulo');
    expect(normaliseLocation('São Paulo', { country: 'BR' })).to.equal('São Paulo');
    expect(normaliseLocation('San Paulo', { country: 'BR' })).to.equal('São Paulo');
  });

  it('Montreal CA', () => {
    expect(normaliseLocation('Montreal', { country: 'CA' })).to.equal('Montreal');
    expect(normaliseLocation('Montréal', { country: 'CA' })).to.equal('Montreal');
  });

  it('Toronto CA', () => {
    expect(normaliseLocation('Toronto', { country: 'CA' })).to.equal('Toronto');
    expect(normaliseLocation('Comté de Toronto', { country: 'CA' })).to.equal('Toronto');
  });

  it('Andelfingen CH', () => {
    expect(normaliseLocation('Andelfingen', { country: 'CH' })).to.equal('Andelfingen');
    expect(normaliseLocation('Andelfingen District', { country: 'CH' })).to.equal('Andelfingen');
    expect(normaliseLocation('Bezirk Andelfingen', { country: 'CH' })).to.equal('Andelfingen');
  });

  it('Geneva CH', () => {
    expect(normaliseLocation('Geneva', { country: 'CH' })).to.equal('Geneva');
    expect(normaliseLocation('Genève', { country: 'CH' })).to.equal('Geneva');
    expect(normaliseLocation('Canton of Geneva', { country: 'CH' })).to.equal('Geneva');
    expect(normaliseLocation('Canton de Genève', { country: 'CH' })).to.equal('Geneva');
    expect(normaliseLocation('CH013', { country: 'CH' })).to.equal('Geneva');
  });

  it('Ceske Budejovice CZ', () => {
    expect(normaliseLocation('Ceske Budejovice', { country: 'CZ' })).to.equal('České Budějovice');
    expect(normaliseLocation('České Budějovice', { country: 'CZ' })).to.equal('České Budějovice');
    expect(normaliseLocation('Okres České Budějovice', { country: 'CZ' })).to.equal('České Budějovice');
    expect(normaliseLocation('Ceske Budejovice District', { country: 'CZ' })).to.equal('České Budějovice');
  });

  it('Dusseldorf DE', () => {
    expect(normaliseLocation('Dusseldorf', { country: 'DE' })).to.equal('Düsseldorf');
    expect(normaliseLocation('Düsseldorf', { country: 'DE' })).to.equal('Düsseldorf');
  });

  it('Frankfurt DE', () => {
    expect(normaliseLocation('Frankfurt', { country: 'DE' })).to.equal('Frankfurt');
    expect(normaliseLocation('Frankfurt am Main', { country: 'DE' })).to.equal('Frankfurt');
    expect(normaliseLocation('Frankfort', { country: 'DE' })).to.equal('Frankfurt');
  });

  it('Madrid ES', () => {
    expect(normaliseLocation('Madrid', { country: 'ES' })).to.equal('Madrid');
    expect(normaliseLocation('Comunidad de Madrid', { country: 'ES' })).to.equal('Madrid');
    expect(normaliseLocation('Comunidad Autónoma de Madrid', { country: 'ES' })).to.equal('Madrid');
  });

  it('Paris FR', () => {
    expect(normaliseLocation('Paris', { country: 'FR' })).to.equal('Paris');
  });

  it('London GB', () => {
    expect(normaliseLocation('London', { country: 'GB' })).to.equal('London');
  });

  it('Hong Kong HK', () => {
    expect(normaliseLocation('Hong Kong', { country: 'HK' })).to.equal('Hong Kong');
    expect(normaliseLocation('Hongkong', { country: 'HK' })).to.equal('Hong Kong');
    expect(normaliseLocation('Honkong', { country: 'HK' })).to.equal('Hong Kong');
  });

  it('Dublin IE', () => {
    expect(normaliseLocation('Dublin', { country: 'IE' })).to.equal('Dublin');
    expect(normaliseLocation('Dublin City', { country: 'IE' })).to.equal('Dublin');
  });

  it('Petah Tikva IL', () => {
    expect(normaliseLocation('Petah Tikva', { country: 'IL' })).to.equal('Petah Tikva');
    expect(normaliseLocation('Petaẖ Tiqva', { country: 'IL' })).to.equal('Petah Tikva');
    expect(normaliseLocation('Petah Tikwah', { country: 'IL' })).to.equal('Petah Tikva');
  });

  it('New Delhi IN', () => {
    expect(normaliseLocation('New Delhi', { country: 'IN' })).to.equal('New Delhi');
  });

  it('Seoul KR', () => {
    expect(normaliseLocation('Seoul', { country: 'KR' })).to.equal('Seoul');
    expect(normaliseLocation('Seoul-si', { country: 'KR' })).to.equal('Seoul');
  });

  it('Mexico City MX', () => {
    expect(normaliseLocation('Mexico City', { country: 'MX' })).to.equal('Mexico');
    expect(normaliseLocation('Ciudad de México', { country: 'MX' })).to.equal('Mexico');
    expect(normaliseLocation('Mexico', { country: 'MX' })).to.equal('Mexico');
    expect(normaliseLocation('Ciudad de México', { country: 'MX' })).to.equal('Mexico');
  });

  it('Tokyo JP', () => {
    expect(normaliseLocation('Tokyo', { country: 'JP' })).to.equal('Tokyo');
    expect(normaliseLocation('Tokyo Prefecture', { country: 'JP' })).to.equal('Tokyo');
    expect(normaliseLocation('東京', { country: 'JP' })).to.equal('Tokyo');
    expect(normaliseLocation('東京都', { country: 'JP' })).to.equal('Tokyo');
  });

  it('Ōsaka JP', () => {
    expect(normaliseLocation('Ōsaka', { country: 'JP' })).to.equal('Ōsaka');
    expect(normaliseLocation('Osaka', { country: 'JP' })).to.equal('Ōsaka');
    expect(normaliseLocation('Ōsaka Prefecture', { country: 'JP' })).to.equal('Ōsaka');
    expect(normaliseLocation('Osaka Prefecture', { country: 'JP' })).to.equal('Ōsaka');
  });

  it('Almaty KZ', () => {
    expect(normaliseLocation('Almaty', { country: 'KZ' })).to.equal('Almaty');
    expect(normaliseLocation('Алматы', { country: 'KZ' })).to.equal('Almaty');
  });

  it('Amsterdam NL', () => {
    expect(normaliseLocation('Amsterdam', { country: 'NL' })).to.equal('Amsterdam');
  });

  it('Krakow PL', () => {
    expect(normaliseLocation('Krakow', { country: 'PL' })).to.equal('Krakow');
    expect(normaliseLocation('Kraków', { country: 'PL' })).to.equal('Krakow');
  });

  it('Bahçelievler TR', () => {
    expect(normaliseLocation('Bahçelievler', { country: 'TR' })).to.equal('Bahçelievler');
  });

  it('Belgrade RS', () => {
    expect(normaliseLocation('Belgrade', { country: 'RS' })).to.equal('Belgrade');
    expect(normaliseLocation('Beograd', { country: 'RS' })).to.equal('Belgrade');
    expect(normaliseLocation('Belgrád', { country: 'RS' })).to.equal('Belgrade');
  });

  it('Moscow RU', () => {
    expect(normaliseLocation('Moscow', { country: 'RU' })).to.equal('Moscow');
    expect(normaliseLocation('Moskva', { country: 'RU' })).to.equal('Moscow');
    expect(normaliseLocation('Москва', { country: 'RU' })).to.equal('Moscow');
    expect(normaliseLocation('Moscow Oblast', { country: 'RU' })).to.equal('Moscow');
  });

  it('St Petersburg RU', () => {
    expect(normaliseLocation('St Petersburg', { country: 'RU' })).to.equal('St Petersburg');
    expect(normaliseLocation('St.-Petersburg', { country: 'RU' })).to.equal('St Petersburg');
    expect(normaliseLocation('Saint Petersburg', { country: 'RU' })).to.equal('St Petersburg');
    expect(normaliseLocation('Sankt-Peterburg', { country: 'RU' })).to.equal('St Petersburg');
  });

  it('Taipei TW', () => {
    expect(normaliseLocation('Taipei', { country: 'TW' })).to.equal('Taipei');
    expect(normaliseLocation('台北', { country: 'TW' })).to.equal('Taipei');
    expect(normaliseLocation('台北市', { country: 'TW' })).to.equal('Taipei');
    expect(normaliseLocation('Taipei City', { country: 'TW' })).to.equal('Taipei');
  });

  it('Chelsea US', () => {
    expect(normaliseLocation('Chelsea', { country: 'US' })).to.equal('Chelsea');
  });

  it('Newark US', () => {
    expect(normaliseLocation('Newark', { country: 'US' })).to.equal('Newark');
  });

  it('New York US', () => {
    expect(normaliseLocation('New York', { country: 'US' })).to.equal('New York');
    expect(normaliseLocation('New York City', { country: 'US' })).to.equal('New York');
    expect(normaliseLocation('New York State', { country: 'US' })).to.equal('New York');
  });

  it('Staten Island US', () => {
    expect(normaliseLocation('Staten Island', { country: 'US' })).to.equal('Staten Island');
    expect(normaliseLocation('Borough of Staten Island', { country: 'US' })).to.equal('Staten Island');
  });

  it('Tampah US', () => {
    expect(normaliseLocation('Tampah', { country: 'US' })).to.equal('Tampah');
  });
});

