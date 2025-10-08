// Map resourceName -> API function
import { getPartnerInfo } from '../service/requestAPI';
import { BOResourceName } from '../features/boResources';
import { useFetchResources } from '../views/Component/Resources';
import { useCallback } from 'react';

const resourceMap = {
    [BOResourceName.PARTNER_INFO]: getPartnerInfo,
    // [BOResourceName.USER_LIST]: getUserList,
    // [BOResourceName.ORDER_LIST]: getOrderList,
};

export function useResource(resourceName, params, deps = [], caching = {}) {
    const apiFn = resourceMap[resourceName];
    if (!apiFn) {
        throw new Error(`No API mapping found for resource: ${resourceName}`);
    }

    const fetcher = useCallback(apiFn.bind(null, params), deps);

    return useFetchResources(fetcher, 0, { name: resourceName, ...caching });
}
