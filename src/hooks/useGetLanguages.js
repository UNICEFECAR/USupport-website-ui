import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { useEventListener } from "#hooks";

import { languageSvc } from "@USupport-components-library/services";

export default function useGetLanguages() {
  const [country, setCountry] = useState(localStorage.getItem("country"));

  useEventListener("countryChanged", () => {
    const newCountry = localStorage.getItem("country");
    setCountry(newCountry);
  });

  const fetchLanguages = async () => {
    const languages = await languageSvc.getActiveLanguages();
    const languagesSorted = languages.data.sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    return languagesSorted;
  };
  const query = useQuery(["all-languages", country], fetchLanguages, {
    enabled: !!country,
  });

  return query;
}

export { useGetLanguages };
