import fs from 'fs-extra-promise';

export default async function clean() {
  await fs.remove('./.tmp/');
  await fs.remove('./dist/');
  return 'cleaned';
}
