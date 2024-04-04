export type Settings = {
    EnableDocuments: boolean;
    EnableContentRequests: boolean;
    MaxGroupNumber: number;
    MaxSpaceNumber: number;
    EnableBugtrack: boolean;
    EnableDictionary: boolean;
    EnableAutomaticTranslation: boolean;
    EnableMappingBox: boolean;
    EnableMetabaseDashboards: boolean;
    EnableSetsManagement: boolean;
    EnableClassificationManagement: boolean;
    EnableFileSearch: boolean;
    EnableUseApiDoc: boolean;
    EnableSpaces: boolean;
    EnableSynchroRevit: boolean;
    EnableObjectTemplate: boolean;
    EnableExportCao: boolean;
  }

export const getShouldShowMonitoring = (settings: Settings) => settings.EnableSynchroRevit || settings.EnableObjectTemplate || settings.EnableExportCao;

