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

// The homepage introduction video is the CMS video in this category (matched
// on the category's English name, case-insensitive). It is kept out of the
// competency microvideos collection.
export const PH_INTRO_VIDEO_CATEGORY = "p&h introduction";

// Facilitators network waiting list - hidden until the UNICEF team confirms
// it. Turning this on brings back the invitation card (Home, How to, About),
// its sign-up dialog and the "How do I join the facilitators network?" FAQ.
export const PH_SHOW_WAITLIST = false;

export const isPlayAndHeal = () => {
  if (typeof window === "undefined") return false;
  const subdomain = window.location.hostname.split(".")[0];
  return (
    subdomain === PH_SUBDOMAIN || localStorage.getItem("country") === PH_COUNTRY
  );
};
