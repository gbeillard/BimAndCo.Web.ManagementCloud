import { LanguageCode } from '../../../Reducers/app/types';

export type MetabaseDashboard = {
  Id: number;
};

export type MetabaseData = {
  Dashboard: MetabaseDashboard;
  LanguageCode: LanguageCode;
  resources: any;
};

export type MetabasePayload = {
  resource: { [key: string]: MetabaseDashboard['Id'] };
  params: { [key: string]: number | string };
};
