// Hosn El Hal - lazy loaded, so its copy is registered here as the
// "hosnelhal" namespace instead of growing src/locales/*.json
import i18n from "i18next";

import en from "./locales/en.json";
import ar from "./locales/ar.json";

const registerHosnLocales = (enBundle = en, arBundle = ar) => {
  i18n.addResourceBundle("en", "hosnelhal", enBundle, true, true);
  i18n.addResourceBundle("ar", "hosnelhal", arBundle, true, true);
};

registerHosnLocales();

if (import.meta.hot) {
  import.meta.hot.accept(
    ["./locales/en.json", "./locales/ar.json"],
    ([enMod, arMod]) => {
      registerHosnLocales(
        enMod?.default ?? enMod ?? en,
        arMod?.default ?? arMod ?? ar
      );
    }
  );
}

export { default } from "./HosnElHalRoutes";
