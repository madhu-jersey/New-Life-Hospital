# New Hospital Details: fill this in

Fill in everything after the `:` or under each heading, save the file, then tell Claude:
**"I filled HOSPITAL-DETAILS.md, build the website."**

The design, animations, effects, layout, and English/Telugu language switch stay exactly the same as the Aarogya website. Only the content below changes.
Leave a line blank if you don't have it yet; it will be marked TODO. Write `SAME` to keep the Aarogya value, or `REMOVE` to drop that item.
The example values shown in ( ) are what the Aarogya site uses now.

---

## 1. Basic info

- Hospital name (English): (Aarogya Multi Speciality Hospital)
- Hospital name (Telugu): (ఆరోగ్య మల్టీ స్పెషాలిటీ హాస్పిటల్) *(leave blank and Claude will translate it)*
- Short brand word shown big in the hero: (AAROGYA) e.g. NEW LIFE
- Second line under the brand word: (Multi Speciality Hospital)
- Year founded: (2021)
- Tagline / slogan: (Corporate-level medical care for everyone, provided by specialist doctors.)
- Keep the Telugu language option? (yes / no): yes

## 2. Contact

- Main phone (shown everywhere, used for "Call now"): (+91 76749 61013)
- Alternate phone: (+91 99661 93444)
- Email (optional):
- WhatsApp number (optional):

## 3. Address and location

- Full street address: (Back Side of Padhma sri Function Hall, 34-10-4, Somanchi Vari street, opp. Lions Club of Sajjapuram, near Venkateswara Theatre, Venkatarayapuram)
- Locality / area: (Sajjapuram)
- Town / city: (Tanuku)
- District: (West Godavari)
- State: (Andhra Pradesh)
- PIN code: (534211)
- Google Maps link of the hospital (open the hospital on Google Maps → Share → Copy link):
- Latitude, longitude (optional, Claude can read them from the Maps link): (16.7545944, 81.6809747)
- Nearby areas you serve (for Google search): (Tanuku, Sajjapuram, Venkatarayapuram, West Godavari)

## 4. Social media and website

- Website domain (if purchased, e.g. newlifehospital.in):
- Instagram link:
- Instagram handle (e.g. @newlifehospital):
- Facebook link:
- Google reviews link (Maps listing → Reviews → Share):

## 5. Timings

- Emergency: (24 hours, 7 days)
- OP timings, slot 1: (Daily, 9:00 AM to 2:00 PM)
- OP timings, slot 2: (Daily, 6:00 PM to 9:00 PM)
- Any special OPD to show in the hours card (department, doctor, time): (Urology OPD, Dr. V.D. Prasad Muthyala, 5:00 PM to 8:00 PM daily)

## 6. Doctors

Copy the block once per doctor (any number of doctors is fine).

### Doctor 1
- Name: (Dr. R.K. Naidu Puppala)
- Department: (Pulmonology)
- Qualification: (M.B.B.S., M.D., Pulmonology.)
- Treats / areas of care: (Lungs and respiratory diseases.)
- Timings: (Daily, 9:00 AM to 2:00 PM; Daily, 6:00 PM to 9:00 PM)
- Photo file name (put the photo in the `new-photos/doctors` folder):

### Doctor 2
- Name:
- Department:
- Qualification:
- Treats / areas of care:
- Timings:
- Photo file name:

### Doctor 3
- Name:
- Department:
- Qualification:
- Treats / areas of care:
- Timings:
- Photo file name:

### Doctor 4
- Name:
- Department:
- Qualification:
- Treats / areas of care:
- Timings:
- Photo file name:

## 7. Services

The site shows three service cards. List one service per line.

### Card 1 title: (Medical and surgical care)
- (General medicine)
- (Pulmonology)
- ...

### Card 2 title: (Women's and pregnancy care)
- (Obstetrics and gynaecology)
- (Normal delivery)
- ...

### Card 3 title: (Facilities and support)
- (2D Echo)
- (Ventilator facility)
- ...

## 8. Highlights strip (6 short items under the hero)

(24/7 emergency services · 24/7 ambulance · 24/7 pharmacy · 24/7 laboratory · ICU and HDU · Advanced operation theatres)

1.
2.
3.
4.
5.
6.

## 9. About and "Our story"

- About paragraph (2–3 lines, or leave blank and Claude will write it from your services):
- How the hospital started (1–2 lines):
- Highlight patient quote (optional, from a real Google review):
- Who said it:

## 10. Why choose us (4 reasons, title + one line each)

1. (24/7 emergency care: Emergency services run around the clock, with 24/7 ambulance support.)
2.
3.
4.

## 11. Google reviews

Only real reviews from your Google listing. Do not make up reviews or ratings.

- Google rating: (4.9)
- Total number of reviews: (114)
- Review 1 (name, how long ago, review text):
- Review 2:
- Review 3:
- Review 4:

## 12. FAQ (questions and answers)

1. Q: (Is the hospital open 24 hours?)  A:
2. Q: (Is there an ambulance service?)  A:
3. Q: (Which departments are available?)  A:
4. Q: (How do I book an appointment?)  A:
5. Q: (Where is the hospital?)  A:

## 13. Photos and logo

Create a folder named `new-photos` next to this file and put these inside:

| Put this file in `new-photos/` | What it replaces |
|---|---|
| `logo.png` (square, transparent background is best) | Logo in header, hero badge, footer, browser tab |
| `wordmark.png` (hospital name as styled text, transparent background), optional | Big "AAROGYA" heading image. If missing, Claude renders the name as styled text. |
| `hero.jpg` (front of the hospital building) | Main hero photo |
| `doctors/` folder, one photo per doctor (portrait, plain background) | Doctor cards |
| `gallery/` folder: exterior, reception, pharmacy, rooms, etc. | Gallery section |

Any size is fine; Claude will resize and convert them to fast WebP versions like the original.

## 14. Colours (optional)

- Keep the Aarogya colours (magenta #A8195F + teal #0E7C7B)? yes / no:
- If no, main brand colour (from your logo):
- Second colour:
