import { format, parse } from 'date-fns';
import { currentDateFnsLocale } from '@/plugins/i18n';

export const localizedFormat = (date, formatString) => {
  if (!date) {
    return '';
  }
  return format(date, formatString, {
    locale: currentDateFnsLocale,
  });
};

export const localizedParse = (
  dateString,
  formatString,
  referenceDate = new Date()
) => {
  if (!dateString) {
    return null;
  }
  return parse(dateString, formatString, referenceDate, {
    locale: currentDateFnsLocale,
  });
};

// Converts a value to a Date object using multiple formats and strategies. Returns null if parsing fails.
export function toDate(
  value,
  {
    primaryFormat = 'dd-MM-yyyy',
    isoFormat = 'yyyy-MM-dd',
    baseDate = new Date(),
    allowNativeISO = true,
  } = {}
) {
  if (!value) return null;

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  if (typeof value === 'string') {
    const raw = value.trim();
    if (!raw) return null;

    // 1) Try primary
    let d = localizedParse(raw, primaryFormat, baseDate);
    if (d instanceof Date && !Number.isNaN(d.getTime())) return d;

    // 2) Try ISO date (yyyy-MM-dd)
    d = localizedParse(raw, isoFormat, baseDate);
    if (d instanceof Date && !Number.isNaN(d.getTime())) return d;

    // 3) allow native parsing for ISO timestamps
    if (allowNativeISO) {
      const native = new Date(raw);
      if (!Number.isNaN(native.getTime())) return native;
    }
  }

  return null;
}

//Returns a function that formats a date or date range for display
export function makeDisplayDate({
  displayFormat = 'dd.MM.yyyy',
  primaryParseFormat = 'dd-MM-yyyy',
  rangeSeparator = ' – ',
  baseDate = new Date(),
} = {}) {
  return (value) => {
    if (Array.isArray(value)) {
      const parts = value
        .map((v) => {
          const d = toDate(v, { primaryFormat: primaryParseFormat, baseDate });
          return d ? localizedFormat(d, displayFormat) : '';
        })
        .filter(Boolean);

      return parts.join(rangeSeparator);
    }

    const d = toDate(value, { primaryFormat: primaryParseFormat, baseDate });
    return d ? localizedFormat(d, displayFormat) : '';
  };
}
