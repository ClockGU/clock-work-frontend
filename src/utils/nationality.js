import nationalities from 'i18n-nationality';
import en from 'i18n-nationality/langs/en.json';
import de from 'i18n-nationality/langs/de.json';

nationalities.registerLocale(en);
nationalities.registerLocale(de);

const NATIONALITY_CODE_ALIASES = {
  EL: 'GR',
};

const VISA_FREE_LONG_STAY_COUNTRY_CODES = new Set([
  'AT',
  'BE',
  'BG',
  'HR',
  'CY',
  'CZ',
  'DK',
  'EE',
  'FI',
  'FR',
  'DE',
  'GR',
  'HU',
  'IE',
  'IT',
  'LV',
  'LT',
  'LU',
  'MT',
  'NL',
  'PL',
  'PT',
  'RO',
  'SK',
  'SI',
  'ES',
  'SE',
  'IS',
  'LI',
  'NO',
  'CH',
]);

const normalizeLanguage = (language) =>
  String(language || 'en').toLowerCase().startsWith('de') ? 'de' : 'en';

const normalizeCodeAlias = (code) => {
  const upperCode = String(code || '').toUpperCase();
  return NATIONALITY_CODE_ALIASES[upperCode] || upperCode;
};

export const normalizeNationality = (value) => {
  if (!value) return '';

  const normalizedValue = String(value).trim();

  if (!normalizedValue) return '';

  if (/^[A-Za-z]{2}$/.test(normalizedValue)) {
    return normalizeCodeAlias(normalizedValue);
  }

  const alpha2Code =
    nationalities.getAlpha2Code(normalizedValue, 'en') ||
    nationalities.getAlpha2Code(normalizedValue, 'de') ||
    '';

  return alpha2Code ? normalizeCodeAlias(alpha2Code) : '';
};

export const getNationalityLabel = (value, language = 'en') => {
  const normalizedCode = normalizeNationality(value);

  if (!normalizedCode) return '';

  const normalizedLanguage = normalizeLanguage(language);
  const localizedNames = nationalities.getNames(normalizedLanguage) || {};
  const englishNames = nationalities.getNames('en') || {};

  return localizedNames[normalizedCode] || englishNames[normalizedCode] || normalizedCode;
};

export const getNationalityOptions = (language = 'en') => {
  const normalizedLanguage = normalizeLanguage(language);
  const localizedNames = nationalities.getNames(normalizedLanguage) || {};

  return Object.entries(localizedNames)
    .map(([code, label]) => ({
      code: normalizeCodeAlias(code),
      label,
    }))
    .sort((a, b) => a.label.localeCompare(b.label, normalizedLanguage));
};

export const isVisaUploadRequired = (value) => {
  const normalizedCode = normalizeNationality(value);

  if (!normalizedCode) return false;

  return !VISA_FREE_LONG_STAY_COUNTRY_CODES.has(normalizedCode);
};

export { VISA_FREE_LONG_STAY_COUNTRY_CODES };