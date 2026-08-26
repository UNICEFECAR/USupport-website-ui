import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import hy from "./locales/hy.json";
import en from "./locales/en.json";
import kk from "./locales/kk.json";
import pl from "./locales/pl.json";
import ro from "./locales/ro.json";
import ru from "./locales/ru.json";
import uk from "./locales/uk.json";
import ar from "./locales/ar.json";
import tr from "./locales/tr.json";
import el from "./locales/el.json";

const resources = {
  hy,
  en,
  kk,
  pl,
  ro,
  ru,
  uk,
  ar,
  tr,
  el,
};

i18n.use(initReactI18next).init({
  resources,
  fallbackLng: "en",
  lng: "en",
});

export default i18n;
