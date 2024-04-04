export interface Classification {
  // duplicate
  Classification: number;
  ClassificationId: number;

  ClassificationDetails: Translation[];
  ManagementCloudId: string;
  Name: string;
  Description: string;
  IsMandatory: boolean;
  LanguageCode: string;
  CopyFrom: string;
  Template?: File;
  Version: string;
  IsEnabled: boolean;
  isDeletable: boolean;
  ObjectsCount: number;
  ObjectsTotal: number;
  PropertyName: string | null;
  PropertyCode: string | null;
  Status: string;
}

export interface Translation {
  ClassificationLangId: number;
  ClassificationLangCode: string;
  ClassificationName: string;
  ClassificationDescription: string;
}

export interface ClassificationResponse {
  Id: number;
}
