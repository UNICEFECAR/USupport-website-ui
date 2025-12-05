import { useInfiniteQuery } from "@tanstack/react-query";
import { providerSvc } from "@USupport-components-library/services";

/**
 * Reuseable hook to get and transform the client data in a desired format
 */
export default function useGetProvidersData({
  random = false,
  limit = 3,
  width,
  enabled = true,
  isInGlobalCountry,
}) {
  const fetchProvidersData = async ({ pageParam = 1 }) => {
    let response;
    if (!isInGlobalCountry) {
      if (!random) {
        response = await providerSvc.getAllProviders({
          limit: width >= 1366 ? 12 : 10,
          offset: pageParam,
          onlyAvailable: false,
        });
      } else {
        response = await providerSvc.getRandomProviders(limit);
      }
    } else {
      response = { data: staticProvidersData };
    }
    const { data } = response;
    const formattedData = [];
    for (let i = 0; i < data.length; i++) {
      const providerData = data[i];
      const formattedProvider = {
        providerDetailId: providerData.provider_detail_id || "",
        name: providerData.name || "",
        patronym: providerData.patronym || "",
        surname: providerData.surname || "",
        nickname: providerData.nickname || "",
        image: providerData.image || "default",
        specializations: providerData.specializations || [],
        education: providerData.education || [],
        sex: providerData.sex || "",
        consultationPrice: providerData.consultation_price || 0,
        description: providerData.description || "",
        languages: providerData.languages || [],
        workWith: providerData.work_with || [],
        totalConsultations: providerData.total_consultations || 0,
        earliestAvailableSlot: providerData.earliest_available_slot || "",
      };
      formattedData.push(formattedProvider);
    }
    return formattedData;
  };

  const providersDataQuery = useInfiniteQuery(
    ["providers-data", isInGlobalCountry],
    fetchProvidersData,
    {
      enabled,
      getNextPageParam: (lastPage, pages) => {
        if (lastPage.length === 0) {
          return undefined;
        }
        return pages.length + 1;
      },
      onError: (err) => console.log(err, "err"),
    }
  );

  return providersDataQuery;
}

export const staticProvidersData = [
  {
    provider_detail_id: "uuid-1",
    name: "John",
    patronym: "A.",
    surname: "Doe",
    nickname: "johnd",
    image: "default",
    specializations: ["psychiatrist"],
    education: ["Harvard University"],
    sex: "male",
    consultation_price: 100,
    description: "Helping clients with emotional resilience and trauma.",
    status: "active",
    work_with: [{ topic: "stress", work_with_id: "uuid-work-1" }],
    languages: [
      {
        language_id: "uuid-lang-1",
        name: "English",
        alpha2: "en",
        local_name: "English",
      },
    ],
    availability: [
      {
        slots: ["2025-05-01T10:00:00+00:00"],
        start_date: "2025-05-01T00:00:00+00:00",
        availability_id: "uuid-avail-1",
      },
    ],
    total_consultations: "10",
  },
  {
    provider_detail_id: "uuid-2",
    name: "Elena",
    patronym: "",
    surname: "Ivanova",
    nickname: "ellie",
    image: "default",
    specializations: ["psychologist", "psychiatrist"],
    education: ["Stanford University"],
    sex: "female",
    consultation_price: 80,
    description: "Helping clients with emotional resilience and trauma.",
    status: "active",
    work_with: [
      { topic: "depression", work_with_id: "uuid-work-3" },
      { topic: "grief", work_with_id: "uuid-work-4" },
    ],
    languages: [
      {
        language_id: "uuid-lang-2",
        name: "Russian",
        alpha2: "ru",
        local_name: "Русский",
      },
    ],
    availability: [
      {
        slots: ["2025-05-03T15:00:00+00:00"],
        start_date: "2025-05-03T00:00:00+00:00",
        availability_id: "uuid-avail-2",
      },
    ],
    total_consultations: "5",
  },
];

export { useGetProvidersData };
