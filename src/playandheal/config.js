// Play and Heal configuration

export const PH_COUNTRY = "PS";
export const PH_SUBDOMAIN = "playandheal";

// Languages the Play and Heal site is designed for
export const PH_LANGUAGES = [
  { value: "en", label: "EN", name: "English", dir: "ltr" },
  { value: "ar", label: "AR", name: "العربية", dir: "rtl" },
];

export const PH_RTL_LANGUAGES = ["ar"];

// Toolkit collections. Articles are assigned to a collection by the English
// name of their CMS category, so the mapping works for every locale.
export const PH_COLLECTIONS = {
  booklet: {
    slug: "booklet",
    contentType: "article",
    categoryMatchers: ["booklet"],
    tone: "lavender",
    icon: "book",
  },
  cards: {
    slug: "activity-cards",
    contentType: "article",
    categoryMatchers: ["activity", "card"],
    tone: "mint",
    icon: "cards",
  },
  videos: {
    slug: "microvideos",
    contentType: "video",
    tone: "sand",
    icon: "play",
  },
};

// The final introductory film is still pending from the client. Until it is
// delivered, the homepage plays the first competency video (the introduction).
// Set this to a CMS video id to use a specific video instead.
export const PH_INTRO_VIDEO_ID = null;

export const isPlayAndHeal = () => {
  if (typeof window === "undefined") return false;
  const subdomain = window.location.hostname.split(".")[0];
  return (
    subdomain === PH_SUBDOMAIN || localStorage.getItem("country") === PH_COUNTRY
  );
};
