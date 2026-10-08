// Hosn El Hal - lazy loaded, so its copy is registered here as the
// "hosnelhal" namespace instead of growing src/locales/*.json
import i18n from "i18next";

import en from "./locales/en.json";
import ar from "./locales/ar.json";

i18n.addResourceBundle("en", "hosnelhal", en, true, true);
i18n.addResourceBundle("ar", "hosnelhal", ar, true, true);

export { default } from "./HosnElHalRoutes";
