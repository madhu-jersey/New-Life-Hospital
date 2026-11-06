# Weekly task: New Life Hospital Google review count

Schedule: every Monday at 9:00 AM (cron `0 9 * * 1`, local time). Runs while the Claude app is open on this PC;
if the app is closed at that time, it runs the next time the app opens.

Paste everything below the line as the task's instructions.

---

Weekly job for the New Life Hospital website (Tanuku). Keep the Google rating and review count shown on the site in step with the hospital's Google Maps listing. Change nothing else.

Website project folder:
C:\Users\madhu\OneDrive\Desktop\NEW-LIFE-HOSPITAL\src-extract\Aarogya-Multi-Speciality-Hospital-main\artifacts\aarogya-hospital
Monorepo root (one level above "artifacts"):
C:\Users\madhu\OneDrive\Desktop\NEW-LIFE-HOSPITAL\src-extract\Aarogya-Multi-Speciality-Hospital-main

STEP 1: Read the listing in the built-in browser (the mcp__Claude_Browser__* tools; load the anthropic-skills:built-in-browser skill first).
Open a new tab and go to this exact URL (the listing's Reviews tab):
https://www.google.com/maps/place/Newlife+hospital/@16.7578483,81.6808267,1050m/data=!3m1!1e3!4m16!1m7!3m6!1s0x3a37b7faedb6ac81:0x37b5a379caa9dce7!2sLIFE+HOSPITALS!8m2!3d16.7578432!4d81.6834016!16s%2Fg%2F11g9q8vgpy!3m7!1s0x3a37b76158b982f7:0x8282ab3c3935a0c9!8m2!3d16.7566922!4d81.6826178!9m1!1b1!16s%2Fg%2F11xg57sdl5?entry=ttu&g_ep=EgoyMDI2MTEwMi4wIKXMDSoASAFQAw%3D%3D
Make sure the open place is "Newlife hospital", not the nearby "LIFE HOSPITALS". Use the find tool with the query "stars," to read the five accessibility labels "5 stars, N reviews", "4 stars, N reviews" … "1 stars, N reviews", and find "stars" to get the overall rating (an image labelled like "4.1 stars"). The total ("N reviews") must equal the sum of the five star counts.
If a cookie or consent prompt appears, choose the option that rejects non-essential cookies. If Google shows a CAPTCHA, a sign-in wall, or anything you cannot read with confidence, STOP: do not edit any file, do not try to get around it, and report that the check could not be done this week. Close the tab when done.

STEP 2: Update the snapshot. In the website project folder, first note the current values of the lines `const GOOGLE_RATING_VALUE = …;` and `const STAR_COUNTS = […];` in src/lib/hospital.ts (you need them if step 3 fails). Then run:
node scripts/update-google-reviews.mjs --rating <rating> --stars <5-star>,<4-star>,<3-star>,<2-star>,<1-star>
Example: node scripts/update-google-reviews.mjs --rating 4.1 --stars 7,0,0,0,2
The script prints one line:
- "UNCHANGED …": nothing changed. Report the current count and rating and finish. Do not build or publish.
- "ERROR …": the numbers did not add up. Do not retry with guessed numbers; report the error and the numbers you read, and finish.
- "UPDATED old -> new …": continue to step 3.

STEP 3: Check the site still builds. In the website project folder run: pnpm run build
If the build fails, put the old numbers back by running the script again with the values you noted in step 2, report the build error, and stop without publishing.

STEP 4: Publish. The site is the Cloudflare Pages project "new-life-hospital", which publishes every push to main on GitHub.
From C:\Users\madhu\OneDrive\Desktop\NEW-LIFE-HOSPITAL run:
  git add src-extract/Aarogya-Multi-Speciality-Hospital-main/artifacts/aarogya-hospital/src/lib/hospital.ts
  git commit -m "Update Google review count"
  git push origin main
Stage only that one file. Never use --force, and never change Cloudflare settings. If the push fails, report the error and stop.
About two minutes later, open https://newlifehospitaltanuku.com and confirm the new count shows in the reviews section.

FINAL REPORT (short): the date, the counts read from Google (total, rating, and the five star counts), whether the site changed, and whether it was published (with the URL) or why not.
