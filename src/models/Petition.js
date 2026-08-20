import { localizedFormat } from '@/utils/date';
import { parse, isValid } from 'date-fns';

const DATE_KEYS = [
  'start_date',
  'end_date',
  // 'time_exce_start',
  // 'time_exce_end',
  'duration_exce_start',
  'duration_exce_end',
];

class Petition {
  constructor(data = {}) {
    this.id = data.id || '';
    this.user_account = data.user_account || '';
    this.supervisor_mail = data.supervisor_mail || '';
    this.student_mail = data.student_mail || '';
    this.student_username = data.student_username || '';
    this.org_unit = data.org_unit || '';
    this.eos_number = data.eos_number || '';
    this.minutes = data.minutes ? Number(data.minutes) / 60 : 0;
    this.ba_degree = data.ba_degree ?? false;
    this.status = data.status || '';

    this.time_exce_student = data.time_exce_student ?? false;
    this.time_exce_course = data.time_exce_course ?? false;
    this.time_exce_time = data.time_exce_time || '';
    this.time_exce_name = data.time_exce_name || '';

    this.duration_exce_student = data.duration_exce_student ?? false;
    this.duration_exce_course = data.duration_exce_course ?? false;
    this.duration_exce_name = data.duration_exce_name || '';
    this.duration_exce_start = data.duration_exce_start || undefined;
    this.duration_exce_end = data.duration_exce_end || undefined;

    this.budget_positions = data.budget_positions || [
      {
        id: '',
        budget_position: '',
        budget_approver: '',
        budget_position_approved: false,
        percentage: 0,
      },
    ];

    DATE_KEYS.forEach((key) => {
      if (data[key]) {
        const d = this.parseDate(data[key]);
        this[key] = d ? localizedFormat(d, 'dd.MM.yyyy') : null;
      } else {
        this[key] = null;
      }
    });
  }

  parseDate(value) {
    if (!value) return null;
    if (value instanceof Date) return isValid(value) ? value : null;

    const s = String(value).trim();
    // Return the first valid date found from our supported formats
    return (
      [
        parse(s, 'yyyy-MM-dd', new Date()),
        parse(s, 'dd.MM.yyyy', new Date()),
      ].find(isValid) || null
    );
  }

  static fromBackendResponse(data) {
    return new Petition(data);
  }

  toBackendFormat() {
    const formattedData = { ...this };

    // Frontend uses hours in 'minutes' field; convert to total minutes for backend
    if (formattedData.minutes) {
      formattedData.minutes = Math.round(
        parseFloat(formattedData.minutes) * 60
      );
    }

    DATE_KEYS.forEach((key) => {
      const d = this.parseDate(formattedData[key]);
      formattedData[key] = d ? localizedFormat(d, 'yyyy-MM-dd') : null;
    });

    // Exclude 'status' and any empty or null fields
    const filteredFormData = Object.fromEntries(
      Object.entries(formattedData).filter(
        ([key, value]) => key !== 'status' && value !== '' && value !== null
      )
    );

    return filteredFormData;
  }
}

export default Petition;
