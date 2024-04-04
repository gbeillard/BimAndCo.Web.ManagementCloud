import toastr from 'toastr';
import { API_URL } from '../../../Api/constants';
import { request, RequestOptions, generateRequest } from '../../../Api/utils';
import { MetabaseData, MetabasePayload } from './types';

export const GetMetabaseDashboardData = (
  onflyId: number,
  languageCode: string
): Promise<MetabaseData> => {
  const url = `${API_URL}/api/v10/onfly/${onflyId}/dashboards`;
  const options: RequestOptions = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Accept-Language': `${languageCode}`,
    },
  };
  return request(url, options);
};

export const GetMetabaseJwtToken = (
  onflyId: number,
  payload: MetabasePayload
): Promise<string> => {
  const url = `${API_URL}/api/v10/onfly/${onflyId}/metabase/jwttoken`;
  const options: RequestOptions = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  };
  return request(url, options);
};

export const GetMetabaseDashboardDataExport = (
  onflyId: number,
  languageCode,
  resources = null
): void => {
  const url = `${API_URL}/api/v10/onfly/${onflyId}/statistics`;

  const options: RequestOptions = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Accept-Language': `${languageCode}`,
    },
  };

  generateRequest(url, options).then((response) => {
    if (response.status === 200) {
      if (resources != null) {
        toastr.success(resources.Metabase.DataExportSuccess);
      }
    } else if (resources != null) {
      toastr.error(resources.Metabase.DataExportFail);
    }
  });
};
