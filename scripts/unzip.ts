import ADMZip from 'adm-zip';
import consola from 'consola';
import * as path from 'pathe';

const zip = new ADMZip(path.join(process.cwd(), './dump/allCountries.zip'));
zip.extractAllTo(path.join(process.cwd(), './dump/allCountries'), true);
consola.success('Unzipped allCountries.zip');
