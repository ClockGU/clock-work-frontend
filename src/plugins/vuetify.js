/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import { mdi, aliases } from "vuetify/iconsets/mdi-svg";

// Composables
import { createVuetify } from "vuetify";

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi
    }
  },
  theme: {
    defaultTheme: "light",
    variations: {
      colors: ["primary"],
      darken: 4,
      lighten: 4
    },
    themes: {
      light: {
        dark: false,
        colors: {
          accent: "#82B1FF",
          error: "#C62828", //red-darken-3
          info: "#1565C0", //blue-darken-3
          primary: "#1976D2",
          secondary: "#424242",
          success: "#2E7D32", //green-darken-3
          warning: "#FF9800",//amber-accent-4
          footerPrimary: "#0064BAFF",
          footerSecondary: "#51B0FFFF"
        }
      }
    }
  }
});
