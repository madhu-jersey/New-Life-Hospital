// Doctor portraits dropped into src/assets/doctors/ (venkatesh.jpg, vandana.jpg, ...) are picked up here.
// Vite fingerprints and serves them; until a file exists the cards show their department illustration.
const files = import.meta.glob<string>('../assets/doctors/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', {
  eager: true,
  query: '?url',
  import: 'default',
});

const byName = new Map(
  Object.entries(files).map(([path, url]) => [path.split('/').pop()!.replace(/\.[^.]+$/, '').toLowerCase(), url]),
);

// Smaller copies in src/assets/doctors/sizes/ (<name>-160.webp for the round avatar, <name>-640.webp for the card).
const sizedFiles = import.meta.glob<string>('../assets/doctors/sizes/*.webp', { eager: true, query: '?url', import: 'default' });
const sizedByName = new Map(Object.entries(sizedFiles).map(([path, url]) => [path.split('/').pop()!.replace(/\.webp$/, '').toLowerCase(), url]));

export function doctorPhoto(key: string): string | undefined {
  return byName.get(key.toLowerCase());
}

// The best copy for the size it is shown at, falling back to the original.
export function doctorPhotoSized(key: string, width: 160 | 640): string | undefined {
  return sizedByName.get(`${key.toLowerCase()}-${width}`) ?? doctorPhoto(key);
}
