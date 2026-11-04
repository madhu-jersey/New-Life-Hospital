import { HOSPITAL_ADDRESS_DISPLAY, HOSPITAL_INFO } from './hospital';
import type { Lang } from './translations';

// Privacy policy for the website. Describes what the site actually does: it stores nothing on a server,
// the booking form only fills in a WhatsApp message, and the map, 360° views and fonts load from Google.
// Update PRIVACY_UPDATED whenever the text changes.
export const PRIVACY_UPDATED = '2026-11-04';

type Section = { heading: string; body: string[] };
type PrivacyText = { title: string; updated: (date: string) => string; intro: string; sections: Section[]; back: string; contactHeading: string };

const contact = `${HOSPITAL_INFO.phone} · ${HOSPITAL_INFO.landline} · ${HOSPITAL_INFO.email}`;

const en: PrivacyText = {
  title: 'Privacy policy',
  updated: (date) => `Last updated ${date}`,
  intro: `This page explains what information ${HOSPITAL_INFO.name}, ${HOSPITAL_INFO.nearbyCity} receives through this website and how it is used.`,
  sections: [
    {
      heading: 'What this website collects',
      body: [
        'This website does not have accounts, does not run advertising or visitor tracking, and does not store your personal details on any server.',
        'The only thing saved on your device is your language choice (English or Telugu), kept in your browser so the site opens in the same language next time.',
      ],
    },
    {
      heading: 'Appointment requests on WhatsApp',
      body: [
        'When you fill in the booking form, the details you type (patient name, mobile number, doctor, date, time and the reason for the visit, if given) are placed into a WhatsApp message on your own phone or computer. Nothing is sent until you press send in WhatsApp yourself.',
        'Once you send it, the message reaches the hospital’s WhatsApp number. The hospital uses these details only to call you back, confirm your appointment and look after your visit. They are not sold, and they are not shared with anyone for marketing.',
        'WhatsApp delivers the message under its own privacy policy.',
      ],
    },
    {
      heading: 'Services from other companies',
      body: [
        'The map, the 360° views of the hospital and the links to reviews come from Google Maps, and the fonts come from Google Fonts. When these load, Google receives your device’s IP address and may set its own cookies, under Google’s privacy policy.',
        'The website is hosted on Vercel, which keeps standard server logs (such as IP address and browser type) for security and to keep the site running.',
      ],
    },
    {
      heading: 'How long details are kept',
      body: [
        'Appointment messages are kept by the hospital only as long as needed to arrange your care and to meet medical record-keeping requirements under Indian law.',
      ],
    },
    {
      heading: 'Your choices and rights',
      body: [
        'You can call the hospital instead of using the form. Under the Digital Personal Data Protection Act, 2023, you can ask the hospital what details it holds about you, ask for them to be corrected or deleted, or raise a concern. For a child, a parent or guardian should send the request.',
      ],
    },
  ],
  contactHeading: 'Contact the hospital',
  back: 'Back to the home page',
};

const te: PrivacyText = {
  title: 'గోప్యతా విధానం',
  updated: (date) => `చివరిగా నవీకరించినది ${date}`,
  intro: `ఈ వెబ్‌సైట్ ద్వారా ${HOSPITAL_INFO.teluguName}, తణుకుకు ఏ సమాచారం అందుతుందో, దాన్ని ఎలా ఉపయోగిస్తారో ఈ పేజీ వివరిస్తుంది.`,
  sections: [
    {
      heading: 'ఈ వెబ్‌సైట్ ఏమి సేకరిస్తుంది',
      body: [
        'ఈ వెబ్‌సైట్‌లో ఖాతాలు లేవు, ప్రకటనలు లేదా సందర్శకుల ట్రాకింగ్ లేదు, మీ వ్యక్తిగత వివరాలను ఏ సర్వర్‌లోనూ నిల్వ చేయదు.',
        'మీ పరికరంలో నిల్వ అయ్యేది మీరు ఎంచుకున్న భాష (ఇంగ్లీష్ లేదా తెలుగు) మాత్రమే, తదుపరిసారి సైట్ అదే భాషలో తెరుచుకోవడానికి.',
      ],
    },
    {
      heading: 'వాట్సాప్‌లో అపాయింట్‌మెంట్ అభ్యర్థనలు',
      body: [
        'బుకింగ్ ఫారంలో మీరు నింపే వివరాలు (రోగి పేరు, మొబైల్ నంబర్, డాక్టర్, తేదీ, సమయం, ఇచ్చినట్లయితే రావడానికి కారణం) మీ ఫోన్ లేదా కంప్యూటర్‌లోనే ఒక వాట్సాప్ సందేశంగా తయారవుతాయి. మీరు వాట్సాప్‌లో పంపండి నొక్కే వరకు ఏదీ పంపబడదు.',
        'మీరు పంపిన తర్వాత ఆ సందేశం హాస్పిటల్ వాట్సాప్ నంబర్‌కు చేరుతుంది. మీకు తిరిగి కాల్ చేయడానికి, అపాయింట్‌మెంట్ నిర్ధారించడానికి, మీ సందర్శనకు మాత్రమే హాస్పిటల్ ఈ వివరాలను ఉపయోగిస్తుంది. వీటిని అమ్మరు, మార్కెటింగ్ కోసం ఎవరితోనూ పంచుకోరు.',
        'వాట్సాప్ తన సొంత గోప్యతా విధానం ప్రకారం సందేశాన్ని అందిస్తుంది.',
      ],
    },
    {
      heading: 'ఇతర సంస్థల సేవలు',
      body: [
        'మ్యాప్, హాస్పిటల్ 360° వ్యూలు, రివ్యూల లింకులు గూగుల్ మ్యాప్స్ నుండి, ఫాంట్‌లు గూగుల్ ఫాంట్స్ నుండి వస్తాయి. ఇవి లోడ్ అయినప్పుడు గూగుల్‌కు మీ పరికరం IP చిరునామా అందుతుంది, గూగుల్ తన గోప్యతా విధానం ప్రకారం కుకీలు పెట్టవచ్చు.',
        'ఈ వెబ్‌సైట్ Vercel లో హోస్ట్ చేయబడింది; భద్రత కోసం, సైట్ నడవడం కోసం అది సాధారణ సర్వర్ లాగ్‌లు (IP చిరునామా, బ్రౌజర్ రకం వంటివి) ఉంచుతుంది.',
      ],
    },
    {
      heading: 'వివరాలు ఎంతకాలం ఉంచుతారు',
      body: [
        'మీ వైద్యం ఏర్పాటు చేయడానికి, భారతీయ చట్టం ప్రకారం వైద్య రికార్డుల అవసరాలకు ఎంతకాలం అవసరమో అంతకాలం మాత్రమే హాస్పిటల్ అపాయింట్‌మెంట్ సందేశాలను ఉంచుతుంది.',
      ],
    },
    {
      heading: 'మీ ఎంపికలు, హక్కులు',
      body: [
        'ఫారం బదులు మీరు హాస్పిటల్‌కు నేరుగా కాల్ చేయవచ్చు. డిజిటల్ పర్సనల్ డేటా ప్రొటెక్షన్ చట్టం, 2023 ప్రకారం, మీ గురించి హాస్పిటల్ దగ్గర ఉన్న వివరాలు ఏమిటో అడగవచ్చు, వాటిని సరిచేయమని లేదా తొలగించమని కోరవచ్చు, లేదా ఫిర్యాదు చేయవచ్చు. పిల్లల విషయంలో తల్లిదండ్రులు లేదా సంరక్షకులు అభ్యర్థన పంపాలి.',
      ],
    },
  ],
  contactHeading: 'హాస్పిటల్‌ను సంప్రదించండి',
  back: 'హోమ్ పేజీకి తిరిగి వెళ్ళండి',
};

export const PRIVACY: Record<Lang, PrivacyText> = { en, te };
export const PRIVACY_CONTACT = { line: contact, address: HOSPITAL_ADDRESS_DISPLAY };
