import { parse, format, isValid } from 'date-fns';

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
    this.student_username = data.student_username || '';
    this.org_unit = data.org_unit || '';
    this.eos_number = data.eos_number || '';
    this.minutes = data.minutes || 0;
    this.ba_degree = data.ba_degree ?? false;
    this.status = data.status || '';
    this.time_exce_student = data.time_exce_student ?? false;
    this.time_exce_course = data.time_exce_course ?? false;
    this.time_exce_time = data.time_exce_time || '';
    this.duration_exce_course = data.duration_exce_course ?? false;
    this.time_exce_name = data.time_exce_name || '';
    this.duration_exce_name = data.duration_exce_name || '';
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
        this[key] = this.parseDate(data[key]);
      } else {
        this[key] = null;
      }
    });
  }

  parseDate(dateValue) {
    if (!dateValue) return null;

    if (dateValue instanceof Date && isValid(dateValue)) {
      return dateValue;
    }
    if (typeof dateValue === 'string') {
      const dateObj = new Date(dateValue);
      if (isValid(dateObj)) return dateObj;

      const parsedDate = parse(dateValue, 'dd.MM.yyyy', new Date());
      if (isValid(parsedDate)) return parsedDate;
    }

    return null;
  }

  static fromBackendResponse(data) {
    return new Petition(data);
  }

  toBackendFormat() {
    const formattedData = { ...this };

    DATE_KEYS.forEach((key) => {
      if (formattedData[key] && isValid(formattedData[key])) {
        formattedData[key] = format(formattedData[key], 'yyyy-MM-dd');
      } else {
        formattedData[key] = null;
      }
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
