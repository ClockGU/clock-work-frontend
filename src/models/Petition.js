import { localizedFormat, localizedParse } from '@/utils/date';

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
    this.minutes = data.minutes ? Number(data.minutes) / 60 : 0;
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
        const d = this.parseDate(data[key]);
        this[key] = d ? localizedFormat(d, 'dd.MM.yyyy') : null;
      } else {
        this[key] = null;
      }
    });
  }

  parseDate(value) {
    if (!value) return null;

    const isValidDate = (d) => d instanceof Date && !Number.isNaN(d.getTime());

    if (isValidDate(value)) return value;

    if (typeof value !== 'string') return null;

    const s = value.trim();
    if (!s) return null;

    const d1 = localizedParse(s, 'yyyy-MM-dd', new Date());
    if (isValidDate(d1)) return d1;

    const d2 = localizedParse(s, 'dd.MM.yyyy', new Date());
    if (isValidDate(d2)) return d2;

    return null;
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
