
export default {
    namespaced: true,
    state: {
        employeeData: {
            first_name: '',
            last_name: '',
            form_of_address: '',
            gender: '',
            date_of_birth: '',
            city_of_birth: '',
            address: '',
            postal_code: '',
            married: false,
            nationality: '',
            telephone_number: '',
            health_insurance: '',
            previous_employment: false,
            prev_emp_duration: '',
            iban: '',
            elstam: null,
            studienbescheinigung: null,
            versicherungsbescheinigung: null,
        }
    },
    actions: {
        setEmployeeData({ commit }, employeeData) {
            commit("setEmployeeData", employeeData);
        }

    },
    mutations: {
        setEmployeeData(state, employeeData) {
            state.employeeData = employeeData;
        }

    },
    getters: {
      employeeData: state => state.employeeData
    }
  };
  