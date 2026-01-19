import { format, parse } from 'date-fns';

class EmployeeData {
  constructor(data = {}) {
    this.id = data.id || '';
    this.first_name = data.first_name || '';
    this.last_name = data.last_name || '';
    this.form_of_address = data.form_of_address || '';
    this.gender = data.gender || '';
    this.date_of_birth = data.date_of_birth
      ? new Date(data.date_of_birth)
      : null;
    this.city_of_birth = data.city_of_birth || '';
    this.address = data.address || '';
    this.postal_code = data.postal_code || '';
    this.married = data.married ?? false;
    this.nationality = data.nationality || '';
    this.telephone_number = data.telephone_number || '';
    this.health_insurance = data.health_insurance || '';
    this.iban = data.iban || '';
    this.previous_employment = data.previous_employment ?? false;

    // prev_emp_duration should be an array of Date objects for the v-date-input (range)
    this.prev_emp_duration = data.prev_emp_duration || null;
  }
  // Parses backend response data and returns an EmployeeData instance that conforms the frontend model
  static fromBackendResponse(data) {
    const modelData = { ...data };
    // Handle parsing of previous employment duration string to a Date array
    if (
      typeof modelData.prev_emp_duration === 'string' &&
      modelData.prev_emp_duration.includes(' – ')
    ) {
      const dates = modelData.prev_emp_duration.split(' – ');
      try {
        // Parse from "DD.MM.YYYY" format
        modelData.prev_emp_duration = [
          parse(dates[0], 'dd.MM.yyyy', new Date()),
          parse(dates[1], 'dd.MM.yyyy', new Date()),
        ];
        // Ensure previous_employment is true if duration was successfully parsed
        modelData.previous_employment = true;
      } catch {
        // If parsing fails, reset
        modelData.prev_emp_duration = null;
        modelData.previous_employment = false;
      }
    } else if (!modelData.prev_emp_duration) {
      modelData.previous_employment = false;
    }

    return new EmployeeData(modelData);
  }

  /**
   * Returns a copy of the EmployeeData object with its fields formatted
   * to conform with the backend's expected format.
   */
  toBackendFormat() {
    const formattedData = { ...this };

    if (formattedData.date_of_birth) {
      formattedData.date_of_birth = format(
        new Date(formattedData.date_of_birth),
        'yyyy-MM-dd'
      );
    }

    // Format prev_emp_duration array to string "DD.MM.YYYY – DD.MM.YYYY"
    if (
      formattedData.previous_employment &&
      Array.isArray(formattedData.prev_emp_duration) &&
      formattedData.prev_emp_duration.length >= 2
    ) {
      // Get the start and end dates of the range
      const startDate = formattedData.prev_emp_duration[0];
      const endDate =
        formattedData.prev_emp_duration[
          formattedData.prev_emp_duration.length - 1
        ];

      if (startDate && endDate) {
        formattedData.prev_emp_duration = `${format(new Date(startDate), 'dd.MM.yyyy')} – ${format(new Date(endDate), 'dd.MM.yyyy')}`;
      } else {
        formattedData.prev_emp_duration = null;
        formattedData.previous_employment = false;
      }
    } else {
      // If previous_employment is false or duration is invalid/empty, reset duration field
      formattedData.prev_emp_duration = null;
      formattedData.previous_employment = false;
    }

    return formattedData;
  }
}

export default EmployeeData;
