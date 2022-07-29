import { expect } from 'chai'
import {describe, it} from 'mocha'

import { normaliseLocation } from '../src/normalise-country';

// Just test edge cases
describe('normalise location countries', () => {
  it('Geneva CH', () => {
    expect(normaliseLocation('Geneva', { country: 'CH' })).to.equal('Geneva');
    expect(normaliseLocation('Genève', { country: 'CH' })).to.equal('Geneva');
  });

  it('St Petersburg', () => {
    expect(normaliseLocation('St Petersburg', { country: 'RU' })).to.equal('St Petersburg');
    expect(normaliseLocation('St.-Petersburg', { country: 'RU' })).to.equal('St Petersburg');
    expect(normaliseLocation('Saint Petersburg', { country: 'RU' })).to.equal('St Petersburg');
    expect(normaliseLocation('Sankt-Peterburg', { country: 'RU' })).to.equal('St Petersburg');
  });

  it('Ceske Budejovice', () => {
    expect(normaliseLocation('Ceske Budejovice', { country: 'CZ' })).to.equal('Ceske Budejovice');
    expect(normaliseLocation('České Budějovice', { country: 'CZ' })).to.equal('Ceske Budejovice');
  });
});

