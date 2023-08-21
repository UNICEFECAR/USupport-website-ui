import { useInfiniteQuery } from "@tanstack/react-query";
import { providerSvc } from "@USupport-components-library/services";

/**
 * Reuseable hook to get and transform the client data in a desired format
 */
export default function useGetProvidersData(random = false, limit = 3, width) {
  const fetchProvidersData = async ({ pageParam = 1 }) => {
    let response;
    if (!random) {
      response = await providerSvc.getAllProviders({
        limit: width >= 1366 ? 12 : 10,
        offset: pageParam,
      });
    } else {
      response = await providerSvc.getRandomProviders(limit);
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
    ["providers-data"],
    fetchProvidersData,
    {
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

export { useGetProvidersData };
