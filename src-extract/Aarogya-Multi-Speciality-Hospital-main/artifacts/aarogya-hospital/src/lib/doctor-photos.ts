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

export function doctorPhoto(key: string): string | undefined {
  return byName.get(key.toLowerCase());
}
