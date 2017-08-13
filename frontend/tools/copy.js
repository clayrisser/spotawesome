import fs from 'fs-extra-promise';
import path from 'path';

export default async function copy() {
  var root = path.resolve(__dirname, '../');
  await Promise.all([
    fs.copy(`${root}/src/public/`, `${root}/dist/public/`)
  ]);
  return 'copied';
}
