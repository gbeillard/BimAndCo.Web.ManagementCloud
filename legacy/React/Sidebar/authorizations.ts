export type Authorizations = {
  enableSpace: boolean;
  enableGroupObjects: boolean;
  enableContentRequests: boolean;
  enableMessages: boolean;
  enableGroups: boolean;
  search: {
    enableSearch: boolean;
    enableObjects: boolean;
  };
  contents: {
    enableManageContents: boolean;
    enableCollections: boolean;
    enableManageContentsFiles: boolean;
  };
  dictionary: {
    enableValues: boolean;
    enableProperties: boolean;
    enableMappings: boolean;
    enableEquivalences: boolean;
    enableRequests: boolean;
    enablePropertiesSets: boolean;
  };
  contactUs: {
    enableApiDoc: boolean;
  };
  settings: {
    enableUsers: boolean;
    enablePins: boolean;
    enableSuppliers: boolean;
    enableClassifications: boolean;
    enablePublishingControl: boolean;
    enableOnflyClientDashboard: boolean;
    enablePreferences: boolean;
    enableAsyncLogsDashboard: boolean;
  };
};

export const globalAuthorizations: {
  admin: Authorizations;
  object_creator: Authorizations;
  validator: Authorizations;
  member: Authorizations;
  partner: Authorizations;
  public_creator: Authorizations;
} = {
  admin: {
    enableSpace: true,
    enableGroupObjects: true,
    enableContentRequests: true,
    enableMessages: true,
    enableGroups: true,
    search: {
      enableObjects: true,
      enableSearch: true,
    },
    contents: {
      enableManageContents: true,
      enableCollections: true,
      enableManageContentsFiles: true,
    },
    dictionary: {
      enableValues: true,
      enableProperties: true,
      enableMappings: true,
      enableEquivalences: true,
      enableRequests: true,
      enablePropertiesSets: true,
    },
    contactUs: {
      enableApiDoc: true,
    },
    settings: {
      enableUsers: true,
      enablePins: true,
      enableSuppliers: true,
      enableClassifications: true,
      enablePublishingControl: true,
      enableOnflyClientDashboard: true,
      enablePreferences: true,
      enableAsyncLogsDashboard: true,
    },
  },
  object_creator: {
    enableSpace: true,
    enableGroupObjects: true,
    enableContentRequests: true,
    enableMessages: true,
    enableGroups: true,
    search: {
      enableObjects: true,
      enableSearch: true,
    },
    contents: {
      enableManageContents: true,
      enableCollections: true,
      enableManageContentsFiles: true,
    },
    dictionary: {
      enableValues: false,
      enableProperties: false,
      enableMappings: false,
      enableEquivalences: false,
      enableRequests: true,
      enablePropertiesSets: false,
    },
    contactUs: {
      enableApiDoc: false,
    },
    settings: {
      enableUsers: false,
      enablePins: false,
      enableSuppliers: false,
      enableClassifications: false,
      enablePublishingControl: false,
      enableOnflyClientDashboard: false,
      enablePreferences: false,
      enableAsyncLogsDashboard: false,
    },
  },
  validator: {
    enableSpace: true,
    enableGroupObjects: true,
    enableContentRequests: true,
    enableMessages: true,
    enableGroups: true,
    search: {
      enableObjects: true,
      enableSearch: true,
    },
    contents: {
      enableManageContents: true,
      enableCollections: true,
      enableManageContentsFiles: true,
    },
    dictionary: {
      enableValues: false,
      enableProperties: false,
      enableMappings: false,
      enableEquivalences: false,
      enableRequests: true,
      enablePropertiesSets: false,
    },
    contactUs: {
      enableApiDoc: false,
    },
    settings: {
      enableUsers: false,
      enablePins: false,
      enableSuppliers: false,
      enableClassifications: false,
      enablePublishingControl: false,
      enableOnflyClientDashboard: false,
      enablePreferences: false,
      enableAsyncLogsDashboard: false,
    },
  },
  member: {
    enableSpace: true,
    enableGroupObjects: true,
    enableContentRequests: true,
    enableMessages: true,
    enableGroups: true,
    search: {
      enableObjects: true,
      enableSearch: true,
    },
    contents: {
      enableManageContents: false,
      enableCollections: true,
      enableManageContentsFiles: false,
    },
    dictionary: {
      enableValues: false,
      enableProperties: false,
      enableMappings: false,
      enableEquivalences: false,
      enableRequests: false,
      enablePropertiesSets: false,
    },
    contactUs: {
      enableApiDoc: false,
    },
    settings: {
      enableUsers: false,
      enablePins: false,
      enableSuppliers: false,
      enableClassifications: false,
      enablePublishingControl: false,
      enableOnflyClientDashboard: false,
      enablePreferences: false,
      enableAsyncLogsDashboard: false,
    },
  },
  partner: {
    enableSpace: false,
    enableGroupObjects: true,
    enableContentRequests: false,
    enableMessages: true,
    enableGroups: true,
    search: {
      enableObjects: false,
      enableSearch: false,
    },
    contents: {
      enableManageContents: false,
      enableCollections: false,
      enableManageContentsFiles: false,
    },
    dictionary: {
      enableValues: false,
      enableProperties: false,
      enableMappings: false,
      enableEquivalences: false,
      enableRequests: false,
      enablePropertiesSets: false,
    },
    contactUs: {
      enableApiDoc: false,
    },
    settings: {
      enableUsers: false,
      enablePins: false,
      enableSuppliers: false,
      enableClassifications: false,
      enablePublishingControl: false,
      enableOnflyClientDashboard: false,
      enablePreferences: false,
      enableAsyncLogsDashboard: false,
    },
  },
  public_creator: {
    enableSpace: false,
    enableGroupObjects: false,
    enableContentRequests: false,
    enableMessages: false,
    enableGroups: false,
    search: {
      enableObjects: true,
      enableSearch: false,
    },
    contents: {
      enableManageContents: false,
      enableCollections: true,
      enableManageContentsFiles: false,
    },
    dictionary: {
      enableValues: false,
      enableProperties: false,
      enableMappings: false,
      enableEquivalences: false,
      enableRequests: false,
      enablePropertiesSets: false,
    },
    contactUs: {
      enableApiDoc: false,
    },
    settings: {
      enableUsers: false,
      enablePins: false,
      enableSuppliers: false,
      enableClassifications: false,
      enablePublishingControl: false,
      enableOnflyClientDashboard: false,
      enablePreferences: false,
      enableAsyncLogsDashboard: false,
    },
  },
};
