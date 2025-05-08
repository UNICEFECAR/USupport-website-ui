import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { providerSvc } from "@USupport-components-library/services";

import { staticProvidersData } from "./useGetProvidersData";

/**
 * Reuseable hook to get and transform the provider data in a desired format
 */
export default function useGetProviderData(id = null) {
  //   const queryClient = useQueryClient();
  const [providersData, setProvidersData] = useState();
  const fetchProvidersData = async () => {
    let data;

    if (staticProvidersData.map((x) => x.provider_detail_id).includes(id)) {
      data = staticProvidersData.find((x) => x.provider_detail_id === id);
    }

    if (!data) {
      if (id) {
        const response = await providerSvc.getProviderById(id);
        data = response.data;
      } else {
        const response = await providerSvc.getProviderData();
        data = response.data;
      }
    }

    const formattedData = {
      providerDetailId: data.provider_detail_id || "",
      name: data.name || "",
      patronym: data.patronym || "",
      surname: data.surname || "",
      nickname: data.nickname || "",
      image: data.image || "default",
      specializations: data.specializations || [],
      education: data.education || [],
      sex: data.sex || "",
      consultationPrice: data.consultation_price || 0,
      description: data.description || "",
      languages: data.languages || [],
      workWith: data.work_with || [],
      totalConsultations: data.total_consultations || 0,
      earliestAvailableSlot: data.earliest_available_slot || "",
      videoLink: data.video_link || "",
    };
    return formattedData;
  };

  const providersDataQuery = useQuery(["provider-data"], fetchProvidersData, {
    onSuccess: (data) => {
      const dataCopy = JSON.parse(JSON.stringify(data));
      setProvidersData({ ...dataCopy });
    },
    onError: (err) => console.log(err, "err"),
    notifyOnChangeProps: ["data"],
  });

  return [providersDataQuery, providersData, setProvidersData];
}

export { useGetProviderData };
