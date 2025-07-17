import { useQuery } from "@tanstack/react-query";

import { clientSvc } from "@USupport-components-library/services";

export default function useGetOrganizationById(organizationId) {
  const fetchOrganization = async () => {
    const { data } = await clientSvc.getOrganizationById(organizationId);
    return {
      organizationId: data.organization_id,
      name: data.name,
      unitName: data?.unit_name,
      websiteUrl: data?.website_url,
      address: data?.address,
      phone: data?.phone,
      email: data?.email,
      description: data?.description,
      location: {
        longitude: data?.longitude,
        latitude: data?.latitude,
      },
      district: {
        id: data?.district_id,
        name: data?.district,
      },
      paymentMethod: {
        id: data?.payment_method_id,
        name: data?.payment_method,
      },
      userInteraction: {
        id: data?.user_interaction_id,
        name: data?.user_interaction,
      },
      workWith: data?.work_with || [],
      providers: data?.providers || [],
      createdBy: data?.created_by,
      createdAt: data?.created_at,
      specialisations: data?.specialisations || [],
    };
  };

  return useQuery({
    queryKey: ["organization", organizationId],
    queryFn: fetchOrganization,
    enabled: !!organizationId,
  });
}

export { useGetOrganizationById };
