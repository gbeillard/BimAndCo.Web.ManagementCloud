import React from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import PluginDownloadProperties from '../../Plugin/DownloadProperties/PluginDownloadProperties.jsx';
import DownloadPropertiesSetsComponent from '../../Plugin/PropertiesSets/DownloadPropertiesSetsComponent';
import SummaryManagerObjects from '../../Plugin/Upload/SummaryUpload/object/SummaryManagerObjects';
import { Objects, Files } from '../../Search';

import PageContainer from '../../PageContainer/PageContainer';
import FilesList from '../../Plugin/Upload/SummaryUpload/file/SummaryManagerFiles';

export const plugin: RouteObject = {
  path: 'plugin',
  children: [
    {
      index: true,
      element: <Navigate to="download-properties" />,
    },
    {
      path: 'download-properties',
      element: (
        <PageContainer isStandAlone>
          <DownloadPropertiesSetsComponent view="properties" />
        </PageContainer>
      ),
    },
    {
      path: 'download-properties-old',
      element: (
        <PageContainer sideBar={false} isOld>
          <PluginDownloadProperties />
        </PageContainer>
      ),
    },
    {
      path: 'download-sets',
      element: (
        <PageContainer isStandAlone>
          <DownloadPropertiesSetsComponent view="sets" />
        </PageContainer>
      ),
    },
    {
      path: 'summary-upload',
      element: (
        <PageContainer sideBar={false} titleZone="ContentManagement" titleKey="MenuItemObjects">
          <SummaryManagerObjects />
        </PageContainer>
      ),
    },
    {
      path: 'summary-upload-files',
      element: (
        <PageContainer sideBar={false} titleZone="ContentManager" titleKey="Files">
          <FilesList />
        </PageContainer>
      ),
    },
    {
      path: 'download-objects',
      element: (
        <PageContainer
          roleAccess={['member', 'admin', 'object_creator', 'validator', 'public_creator']}
          titleZone="ContentManagement"
          titleKey="MenuItemObjects"
          sideBar={false}
        >
          <Objects />
        </PageContainer>
      ),
    },
    {
      path: 'download-files',
      element: (
        <PageContainer
          roleAccess={['member', 'admin', 'object_creator', 'validator', 'public_creator']}
          titleZone="ContentManagement"
          titleKey="MenuItemSearch"
          sideBar={false}
        >
          <Files />
        </PageContainer>
      ),
    },
  ],
};
