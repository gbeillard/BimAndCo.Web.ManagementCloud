import { METABASE_SITE_URL } from '../../../Api/constants';
import { GetMetabaseJwtToken } from './api';
import { MetabaseData, MetabasePayload } from './types';

const GetUrl = async (onflyId: number, payload: MetabasePayload): Promise<string> => {
  const token = await GetMetabaseJwtToken(onflyId, payload);
  return `${METABASE_SITE_URL}/embed/dashboard/${token}#bordered=false&titled=false`;
};

export const GetUrlByDashboardIdAndOnflyId = async (dashboardId: number, onflyId: number): Promise<string> => {
  const payload: MetabasePayload = {
    resource: { dashboard: dashboardId },
    params: {
      onfly_id_filter: onflyId,
    },
  };

  return await GetUrl(onflyId, payload);
};

export const GetUrlFromMetabaseData = async (onflyId: number, data: MetabaseData): Promise<string> => {
  const url = window.location.host;
  const parts = url.split('.');
  const subDomain = parts[0];

  const payload: MetabasePayload = {
    resource: { dashboard: data.Dashboard.Id },
    params: {
      onfly_s_lectionn_: subDomain,
      langue: data.LanguageCode,
    },
  };

  return await GetUrl(onflyId, payload);
};
