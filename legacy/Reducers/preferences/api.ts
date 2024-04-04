import { API_URL } from '../../Api/constants';
import {ManagementCloudV10Service,ManagementCloudPatchViewModelV10} from '@bim-co/platformtypeandfixture';
import { OpenAPI as OpenAPIPlatformTypeAndFixture } from '@bim-co/platformtypeandfixture/core/OpenAPI';


const initialize = () => {
  OpenAPIPlatformTypeAndFixture.BASE = `${API_URL}/api`;
  OpenAPIPlatformTypeAndFixture.TOKEN = sessionStorage.getItem('Temporary_token') || '';
  OpenAPIPlatformTypeAndFixture.HEADERS = {
    'Content-Type': 'application/json'
  }
}

const get = (onflyId: number) => {
  initialize();
  return ManagementCloudV10Service.managementCloudV10GetManagementCloud(onflyId);
};

const getSync = async (onflyId: number, apiKey: string, token: string) => {
  const response = await fetch(`${API_URL}/api/v10/onfly/${onflyId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Api-Key': apiKey,
      Authorization: `Bearer ${token}`,
    },
  });

  return response.json();
};

const update = (onflyId: number, preferences: ManagementCloudPatchViewModelV10) => {
  initialize();
  return ManagementCloudV10Service.managementCloudV10UpdateManagementCloudSettings(onflyId, preferences);
};

export default {
  get,
  getSync,
  update,
};
