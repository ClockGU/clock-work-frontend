import { formatISO } from 'date-fns';

const DATE_KEYS = [
  'start_date',
  'end_date',
  'time_exce_start',
  'time_exce_end',
  'duration_exce_start',
  'duration_exce_end',
];

class Petition {
  constructor(data = {}) {
    this.id = data.id || '';
    this.user_account = data.user_account || '';
    this.supervisor_mail = data.supervisor_mail || '';
    this.student_mail = data.student_mail || '';
    this.org_unit = data.org_unit || '';
    this.eos_number = data.eos_number || '';
    this.minutes = data.minutes || 0;
    this.ba_degree = data.ba_degree ?? false;
    this.status = data.status || '';
    this.time_exce_student = data.time_exce_student ?? false;
    this.time_exce_course = data.time_exce_course ?? false;
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

    // Convert date strings (from API: YYYY-MM-DD) to Date objects (for v-date-input)
    DATE_KEYS.forEach((key) => {
      if (data[key]) {
        this[key] = new Date(data[key]);
      } else {
        this[key] = '';
      }
    });
  }

  /**
   * Static method to map raw API data (with ISO date strings) into a Petition instance
   * where date fields are Date objects for use in the frontend forms.
   */
  static fromBackendResponse(data) {
    return new Petition(data);
  }

  /**
   * Method to prepare the current model data for submission (POST/PATCH) to the backend API.
   */
  toBackendFormat() {
    const formattedData = { ...this };

    // Format all relevant date fields to ISO date string (YYYY-MM-DD)
    DATE_KEYS.forEach((key) => {
      if (formattedData[key]) {
        // Ensure date is a Date object before formatting
        formattedData[key] = formatISO(new Date(formattedData[key]), {
          representation: 'date',
        });
      } else {
        formattedData[key] = '';
      }
    });
    // Filter out properties that are empty strings or null values before submission
    const filteredFormData = Object.fromEntries(
      Object.entries(formattedData).filter(
        ([, value]) => value !== '' && value !== null
      )
    );

    return filteredFormData;
  }
}

export default Petition;
