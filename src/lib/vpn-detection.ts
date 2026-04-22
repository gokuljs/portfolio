/**
 * Timezone-based VPN detection.
 *
 * Vercel geo headers tell us which country an IP belongs to.
 * The browser's Intl API tells us the user's actual system timezone.
 * If someone in "US" has timezone "Asia/Kolkata", they're on a VPN.
 */

const COUNTRY_TIMEZONES: Record<string, string[]> = {
  IN: ['Asia/Kolkata', 'Asia/Calcutta', 'Asia/Colombo'],
  US: [
    'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
    'America/Anchorage', 'America/Adak', 'America/Phoenix', 'America/Boise',
    'America/Indiana/Indianapolis', 'America/Indiana/Knox', 'America/Indiana/Marengo',
    'America/Indiana/Petersburg', 'America/Indiana/Tell_City', 'America/Indiana/Vevay',
    'America/Indiana/Vincennes', 'America/Indiana/Winamac', 'America/Kentucky/Louisville',
    'America/Kentucky/Monticello', 'America/Menominee', 'America/Nome',
    'America/North_Dakota/Beulah', 'America/North_Dakota/Center',
    'America/North_Dakota/New_Salem', 'America/Sitka', 'America/Yakutat',
    'America/Detroit', 'America/Juneau', 'Pacific/Honolulu',
  ],
  GB: ['Europe/London'],
  DE: ['Europe/Berlin'],
  FR: ['Europe/Paris'],
  NL: ['Europe/Amsterdam'],
  CA: [
    'America/Toronto', 'America/Vancouver', 'America/Edmonton', 'America/Winnipeg',
    'America/Halifax', 'America/St_Johns', 'America/Regina', 'America/Yellowknife',
    'America/Iqaluit', 'America/Moncton', 'America/Whitehorse',
  ],
  AU: [
    'Australia/Sydney', 'Australia/Melbourne', 'Australia/Brisbane',
    'Australia/Perth', 'Australia/Adelaide', 'Australia/Hobart',
    'Australia/Darwin', 'Australia/Lord_Howe',
  ],
  JP: ['Asia/Tokyo'],
  SG: ['Asia/Singapore'],
  AE: ['Asia/Dubai'],
  BR: [
    'America/Sao_Paulo', 'America/Fortaleza', 'America/Recife',
    'America/Bahia', 'America/Manaus', 'America/Belem',
    'America/Cuiaba', 'America/Porto_Velho', 'America/Rio_Branco',
  ],
  KR: ['Asia/Seoul'],
  RU: [
    'Europe/Moscow', 'Europe/Kaliningrad', 'Europe/Samara',
    'Asia/Yekaterinburg', 'Asia/Novosibirsk', 'Asia/Krasnoyarsk',
    'Asia/Irkutsk', 'Asia/Yakutsk', 'Asia/Vladivostok',
    'Asia/Magadan', 'Asia/Kamchatka',
  ],
  CN: ['Asia/Shanghai', 'Asia/Urumqi'],
  HK: ['Asia/Hong_Kong'],
  TW: ['Asia/Taipei'],
  ID: ['Asia/Jakarta', 'Asia/Makassar', 'Asia/Jayapura'],
  TH: ['Asia/Bangkok'],
  PH: ['Asia/Manila'],
  MY: ['Asia/Kuala_Lumpur'],
  VN: ['Asia/Ho_Chi_Minh'],
  NZ: ['Pacific/Auckland', 'Pacific/Chatham'],
  ZA: ['Africa/Johannesburg'],
  MX: ['America/Mexico_City', 'America/Cancun', 'America/Monterrey', 'America/Tijuana'],
  IT: ['Europe/Rome'],
  ES: ['Europe/Madrid', 'Atlantic/Canary'],
  SE: ['Europe/Stockholm'],
  NO: ['Europe/Oslo'],
  DK: ['Europe/Copenhagen'],
  FI: ['Europe/Helsinki'],
  PL: ['Europe/Warsaw'],
  CH: ['Europe/Zurich'],
  AT: ['Europe/Vienna'],
  BE: ['Europe/Brussels'],
  IE: ['Europe/Dublin'],
  PT: ['Europe/Lisbon', 'Atlantic/Azores'],
  IL: ['Asia/Jerusalem'],
  TR: ['Europe/Istanbul'],
  SA: ['Asia/Riyadh'],
  QA: ['Asia/Qatar'],
  KW: ['Asia/Kuwait'],
  EG: ['Africa/Cairo'],
  NG: ['Africa/Lagos'],
  KE: ['Africa/Nairobi'],
  AR: ['America/Argentina/Buenos_Aires'],
  CL: ['America/Santiago'],
  CO: ['America/Bogota'],
  PE: ['America/Lima'],
};

const INDIAN_TIMEZONES = new Set(['Asia/Kolkata', 'Asia/Calcutta']);

export function isTimezoneMismatch(geoCountry: string, browserTimezone: string): boolean {
  if (!geoCountry || !browserTimezone) return false;

  // Primary check: geo says non-India but browser timezone is Indian
  if (geoCountry !== 'IN' && INDIAN_TIMEZONES.has(browserTimezone)) {
    return true;
  }

  // General mismatch: if we know the country's timezones, check if browser TZ fits
  const expectedZones = COUNTRY_TIMEZONES[geoCountry];
  if (expectedZones && !expectedZones.includes(browserTimezone)) {
    // Only flag if the browser TZ belongs to a *different* mapped country
    for (const [, zones] of Object.entries(COUNTRY_TIMEZONES)) {
      if (zones.includes(browserTimezone) && zones !== expectedZones) {
        return true;
      }
    }
  }

  return false;
}
