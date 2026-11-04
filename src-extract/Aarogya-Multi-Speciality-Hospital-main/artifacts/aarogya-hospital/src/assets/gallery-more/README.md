# Gallery photos

Every image in this folder appears in the hospital gallery. The first four fill the main grid: the 1st is the large tile and the 4th is a wide tile, so use landscape photos there. The rest sit behind the **View more photos** button. Captions for each photo, in order, are in `gallery.captions` in `src/lib/translations.ts` (English and Telugu).

- Supported: `.jpg`, `.jpeg`, `.png`, `.webp`, `.avif`, `.svg`.
- Order follows the file name, so name them `01.jpg`, `02.jpg`, … to control it. Real photos sort before the `demo-` placeholders.
- `demo-*.svg` files are "Photo coming soon" placeholders. They show only while `DEMO_CONTENT` is `true` in `src/lib/hospital.ts`; delete them once real photos are in.
- The Gallery section is hidden while this folder has no photos.
- Use only real photos of this hospital, and keep each one small (about 1600 px wide, WebP or JPEG under 300 KB).
