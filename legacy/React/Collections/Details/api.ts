import { CollectionDetailsViewModelV10 } from "@bim-co/platformtypeandfixture";
import { API_URL } from "../../../Api/constants";
import { RequestOptions, request } from "../../../Api/utils";

export const getCollection = (
  languageCode: string,
  onflyId: number,
  collectionId: number
): Promise<CollectionDetailsViewModelV10> => {
  const url = `${API_URL}/api/v10/onfly/${onflyId}/collections/${collectionId}`;
  const options: RequestOptions = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Accept-Language': languageCode,
    },
  };

  return request(url, options);
};
