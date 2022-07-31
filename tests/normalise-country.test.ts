import { expect } from 'chai';
import { describe, it } from 'mocha';

import { normaliseLocation } from '../src/normalise-country';

// Just test edge cases
describe('normalise location countries', () => {
  it('Sao Paulo BR', () => {
    expect(normaliseLocation('Sao Paulo', { country: 'BR' })).to.equal('São Paulo');
    expect(normaliseLocation('São Paulo', { country: 'BR' })).to.equal('São Paulo');
    expect(normaliseLocation('San Paulo', { country: 'BR' })).to.equal('São Paulo');
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

  it('Frankfurt DE', () => {
    expect(normaliseLocation('Frankfurt', { country: 'DE' })).to.equal('Frankfurt');
    expect(normaliseLocation('Frankfurt am Main', { country: 'DE' })).to.equal('Frankfurt');
    expect(normaliseLocation('Frankfort', { country: 'DE' })).to.equal('Frankfurt');
  });

  it('Petah Tikva IL', () => {
    expect(normaliseLocation('Petah Tikva', { country: 'IL' })).to.equal('Petah Tikva');
    expect(normaliseLocation('Petaẖ Tiqva', { country: 'IL' })).to.equal('Petah Tikva');
    expect(normaliseLocation('Petah Tikwah', { country: 'IL' })).to.equal('Petah Tikva');
  });

  it('Hong Kong HK', () => {
    expect(normaliseLocation('Hong Kong', { country: 'HK' })).to.equal('Hong Kong');
    expect(normaliseLocation('Hongkong', { country: 'HK' })).to.equal('Hong Kong');
    expect(normaliseLocation('Honkong', { country: 'HK' })).to.equal('Hong Kong');
  });

  it('Bahçelievler TR', () => {
    expect(normaliseLocation('Bahçelievler', { country: 'TR' })).to.equal('Bahçelievler');
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

  it('New York US', () => {
    expect(normaliseLocation('New York', { country: 'US' })).to.equal('New York');
    expect(normaliseLocation('New York City', { country: 'US' })).to.equal('New York');
    expect(normaliseLocation('New York State', { country: 'US' })).to.equal('New York');
  });

  it('Staten Island US', () => {
    expect(normaliseLocation('Staten Island', { country: 'US' })).to.equal('Staten Island');
    expect(normaliseLocation('Borough of Staten Island', { country: 'US' })).to.equal('Staten Island');
  });
});

