import React from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import { RoutePaths } from '../../Sidebar/RoutePaths';

// Views
import ManageUsers from '../../Users/ManageUsers';
import Editor from '../../ObjectEditor/Editor';
import PropertiesManager from '../../ObjectEditor/Steps/Properties/Manager';
import ManageClassificationDetails from '../../Classifications/Details';
import UserAccount from '../../UserAccount/UserAccount';
import ContentRequests from '../../ContentRequests/ContentRequests';
import CreateContentRequests from '../../ContentRequests/CreateContentRequests';
import Suppliers from '../../Suppliers/SuppliersList';
import Groups from '../../Groups/GroupsList';
import PrettyMessagesComponent from '../../Messages/PrettyMessagesComponent';
import PublishingControl from '../../PublishingControl';
import DictionaryMapping from '../../Dictionary/Mapping';
import DictionaryProperties from '../../Dictionary/DictionaryProperties';
import UploadComponent from '../../Plugin/Upload/UploadComponent';
import UserNotifications from '../../UserAccount/UserNotifications';
import ClassificationsHome from '../../Classifications/Home';
import { MetabaseOnflyClientDashboard, MetabaseAsyncLogsDashboard } from '../../MetabaseDashboards';
import PropertiesSets from '../../PropertiesSets';
import PropertiesSetDetail from '../../PropertiesSets/Details';

import Collections from '../../Collections';
import CollectionDetails from '../../Collections/Details';
import PropertyRequests from '../../Dictionary/PropertyRequests';
import { Preferences } from '../../Preferences';
import { Files, Objects } from '../../Search';
import Tags from '../../Tags/Tags';
import DefaultMapping from '../../Dictionary/DefaultMapping';
import { ContentManager } from '../../ContentManager';
import { ContentManagerFiles } from '../../ContentManagerFiles';
import Spaces from '../../Spaces';
import PageContainer from '../../PageContainer/PageContainer';
import { plugin } from './plugin';
import Auth from '../Auth';
import BoostGuard from '../../PageContainer/BoostGuard';
import IndexRedirect from '../../PageContainer/IndexRedirect';
import ObjectDetails from '../../Search/Objects/ObjectDetails';
import FileDetail from '../../Plugin/Upload/SummaryUpload/file/FileDetail';
import { DictionnariesValues } from '../../Dictionary/Values/Value';
import { Properties } from '../../Dictionary/Properties/Properties';
import styled from '@emotion/styled';
import AsyncGuard from '../../PageContainer/AsyncGuard';

export const auth: RouteObject = {
  element: <Auth />,
  children: [
    {
      index: true,
      element: <IndexRedirect />,
    },
    {
      path: 'bimobjects',
      element: (
        <BoostGuard>
          <PageContainer
            roleAccess={['member', 'admin', 'object_creator', 'validator', 'public_creator']}
            titleZone="ContentManagement"
            titleKey="MenuItemObjects"
          >
            <Objects />
          </PageContainer>
        </BoostGuard>
      ),
    },
    {
      path: 'files',
      element: (
        <PageContainer
          roleAccess={['member', 'admin', 'object_creator', 'validator', 'public_creator']}
          titleZone="ContentManagement"
          titleKey="MenuItemFiles"
        >
          <Files />
        </PageContainer>
      ),
    },
    {
      path: 'collections',
      element: (
        <PageContainer
          roleAccess={['member', 'admin', 'object_creator', 'validator', 'public_creator']}
          titleZone="ContentManagementCollections"
          titleKey="MenuItemLabel"
        >
          <Collections />
        </PageContainer>
      ),
    },
    {
      path: 'collections/:collectionId',
      element: (
        <PageContainer
          roleAccess={['member', 'admin', 'object_creator', 'validator', 'public_creator']}
        >
          <CollectionDetails />
        </PageContainer>
      ),
    },
    {
      path: 'manage-users',
      element: (
        <PageContainer
          roleAccess={['admin']}
          titleZone="ContentManagement"
          titleKey="MenuItemUsers"
          isOld
        >
          <ManageUsers />
        </PageContainer>
      ),
    },
    {
      path: 'tags',
      element: (
        <PageContainer roleAccess={['admin']} titleZone="ContentManagement" titleKey="MenuItemTags">
          <Tags />
        </PageContainer>
      ),
    },
    {
      path: RoutePaths.ManageClassifications,
      element: (
        <PageContainer
          roleAccess={['admin']}
          titleZone="ContentManagement"
          titleKey="ManageClassificationHeadTitle"
        >
          <ClassificationsHome />
        </PageContainer>
      ),
    },
    {
      path: `${RoutePaths.ManageClassifications}/:classificationId`,
      element: (
        <PageContainer
          roleAccess={['admin']}
          titleZone="ContentManagement"
          titleKey="ManageClassificationHeadTitle"
        >
          <ManageClassificationDetails />
        </PageContainer>
      ),
    },
    {
      path: 'manage-suppliers',
      element: (
        <PageContainer
          roleAccess={['admin']}
          titleZone="ContentManagement"
          titleKey="SuppliersLabelTitle"
          isOld
        >
          <Suppliers />
        </PageContainer>
      ),
    },
    {
      path: RoutePaths.ManageContents,
      element: (
        <PageContainer
          roleAccess={['admin', 'object_creator', 'validator']}
          titleZone="ContentManagement"
          titleKey="MenuItemManageContents"
        >
          <ContentManager />
        </PageContainer>
      ),
    },
    {
      path: RoutePaths.ManageContentsFiles,
      element: (
        <PageContainer
          roleAccess={['admin', 'object_creator', 'validator']}
          titleZone="ContentManagement"
          titleKey="MenuItemManageContentsFiles"
        >
          <ContentManagerFiles />
        </PageContainer>
      ),
    },
    {
      path: 'publishing-control',
      element: (
        <PageContainer
          roleAccess={['admin']}
          titleZone="ContentManagement"
          titleKey="MenuItemPublishingControl"
          isOld
        >
          <PublishingControl />
        </PageContainer>
      ),
    },
    {
      path: 'content-requests',
      element: (
        <PageContainer
          roleAccess={['member', 'admin', 'object_creator', 'validator']}
          titleZone="ContentManagement"
          titleKey="ContentRequestLabelTitle"
          isOld
        >
          <ContentRequests />
        </PageContainer>
      ),
    },
    {
      path: 'create-content-request',
      element: (
        <PageContainer
          roleAccess={['member', 'admin', 'object_creator', 'validator']}
          titleZone="ContentManagement"
          titleKey="CreateContentRequestLabelTitle"
          isOld
        >
          <CreateContentRequests />
        </PageContainer>
      ),
    },
    {
      path: 'messages/:talkId',
      element: (
        <PageContainer titleZone="ContentManagement" titleKey="MenuItemMessages" isOld>
          <PrettyMessagesComponent />
        </PageContainer>
      ),
    },
    {
      path: 'messages',
      element: (
        <PageContainer titleZone="ContentManagement" titleKey="MenuItemMessages" isOld>
          <PrettyMessagesComponent />
        </PageContainer>
      ),
    },
    {
      path: 'bimobject/:bimobjectId/details',
      element: (
        <PageContainer titleZone="ContentManagement" titleKey="BimObjectDetailsTitle">
          <ObjectDetails />
        </PageContainer>
      ),
    },
    {
      path: 'file/:mediaType/:fileId/detail',
      element: (
        <PageContainer titleZone="FileDetails" titleKey="Title" sideBar={false}>
          <FileDetail />
        </PageContainer>
      ),
    },
    {
      path: RoutePaths.Spaces,
      element: (
        <PageContainer titleZone="Spaces" titleKey="MenuItemLabel">
          <Spaces />
        </PageContainer>
      ),
    },
    {
      path: 'preferences',
      element: (
        <PageContainer roleAccess={['admin']} titleZone="Preferences" titleKey="PageTitle">
          <Preferences />
        </PageContainer>
      ),
    },
    /* Editeur */
    {
      path: 'bimobject/:bimobjectId/edit',
      children: [
        {
          index: true,
          element: <Navigate to="informations" replace />,
        },
        {
          path: 'informations',
          element: (
            <PageContainer
              roleAccess={['admin', 'object_creator', 'validator', 'public_creator']}
              isOld
            >
              <Editor contextEditor="informations" />
            </PageContainer>
          ),
        },
        {
          path: 'photos',
          element: (
            <PageContainer
              roleAccess={['admin', 'object_creator', 'validator', 'public_creator']}
              isOld
            >
              <Editor contextEditor="photos" />
            </PageContainer>
          ),
        },
        {
          path: 'classifications',
          element: (
            <PageContainer
              roleAccess={['admin', 'object_creator', 'validator', 'public_creator']}
              isOld
            >
              <Editor contextEditor="classifications" />
            </PageContainer>
          ),
        },
        {
          path: 'properties',
          element: (
            <PageContainer
              roleAccess={['admin', 'object_creator', 'validator', 'public_creator']}
              isOld
            >
              <Editor contextEditor="properties" />
            </PageContainer>
          ),
        },
        {
          path: 'properties/manager',
          element: (
            <PageContainer roleAccess={['admin', 'object_creator', 'validator', 'public_creator']}>
              <PropertiesManager />
            </PageContainer>
          ),
        },
        {
          path: 'models',
          element: (
            <PageContainer
              roleAccess={['admin', 'object_creator', 'validator', 'public_creator']}
              isOld
            >
              <Editor contextEditor="models" />
            </PageContainer>
          ),
        },
        {
          path: 'documents',
          element: (
            <PageContainer roleAccess={['admin', 'object_creator', 'validator', 'public_creator']}>
              <Editor contextEditor="documents" />
            </PageContainer>
          ),
        },
        {
          path: 'publication',
          element: (
            <PageContainer
              roleAccess={['admin', 'object_creator', 'validator', 'public_creator']}
              isOld
            >
              <Editor contextEditor="publication" />
            </PageContainer>
          ),
        },
      ],
    },
    {
      path: 'bimobject/create',
      element: (
        <PageContainer
          roleAccess={['admin', 'object_creator', 'validator', 'public_creator']}
          isOld
        >
          <Editor contextEditor="create" />
        </PageContainer>
      ),
    },
    {
      path: 'user-account',
      element: (
        <PageContainer titleZone="UserAccount" titleKey="EditUserProfile" isOld>
          <UserAccount />
        </PageContainer>
      ),
    },
    {
      path: 'user-notifications',
      element: (
        <PageContainer titleZone="UserAccount" titleKey="EditUserNotifications" isOld>
          <UserNotifications />
        </PageContainer>
      ),
    },
    {
      path: 'groups',
      element: (
        <PageContainer titleZone="ContentManagement" titleKey="GroupsLabelTitle" isOld>
          <Groups />
        </PageContainer>
      ),
    },
    {
      path: 'metabase/onfly-client-dashboard',
      element: (
        <PageContainer titleZone="Metabase" titleKey="Dashboard" roleAccess={['admin']}>
          <MetabaseOnflyClientDashboard />
        </PageContainer>
      ),
    },
    {
      path: 'metabase/async-logs-dashboard',
      element: (
        <AsyncGuard>
          <PageContainer titleZone="AsyncLogs" titleKey="Dashboard" roleAccess={['admin']}>
            <MetabaseAsyncLogsDashboard />
          </PageContainer>
        </AsyncGuard>
      ),
    },
    /* dictionnary */
    {
      path: 'dictionary/requests',
      element: (
        <PageContainer
          titleZone="ContentManagement"
          titleKey="DictionaryRequestMenuLabel"
          roleAccess={['admin', 'object_creator', 'validator']}
          isOld
        >
          <PropertyRequests />
        </PageContainer>
      ),
    },
    {
      path: 'dictionary/equivalences',
      element: (
        <PageContainer
          titleZone="ContentManagement"
          titleKey="PropertiesDetailsButton"
          roleAccess={['admin']}
          isOld
        >
          <DictionaryMapping mode="NAMING_CONVENTION" />
        </PageContainer>
      ),
    },
    {
      path: 'dictionary/translations',
      element: (
        <PageContainer
          titleZone="ContentManagement"
          titleKey="DictionaryEquivalencesMenuLabel"
          roleAccess={['admin']}
          isOld
        >
          <DictionaryMapping mode="MAPPING_BOX" />
        </PageContainer>
      ),
    },
    {
      path: 'dictionary/mappingbox',
      element: (
        <PageContainer
          titleZone="ContentManagement"
          titleKey="DictionaryEquivalencesMenuLabel"
          roleAccess={['admin']}
          isOld
        >
          <DictionaryMapping mode="MAPPING_BOX" />
        </PageContainer>
      ),
    },
    {
      path: 'dictionary/default-mapping',
      element: (
        <PageContainer
          titleZone="ContentManagement"
          titleKey="DefaultMappingMenuLabel"
          roleAccess={['admin']}
          isOld
        >
          <DefaultMapping mode="NAMING_CONVENTION" isDefault />
        </PageContainer>
      ),
    },
    {
      path: 'dictionary/mapping',
      element: (
        <PageContainer
          titleZone="ContentManagement"
          titleKey="DictionaryTranslationsMenuLabel"
          roleAccess={['admin']}
          isOld
        >
          <DictionaryMapping mode="NAMING_CONVENTION" />
        </PageContainer>
      ),
    },
    {
      path: 'dictionary/mapping/:configurationId',
      element: (
        <PageContainer
          titleZone="ContentManagement"
          titleKey="DictionaryTranslationsMenuLabel"
          roleAccess={['admin']}
          isOld
        >
          <DictionaryMapping mode="NAMING_CONVENTION" />
        </PageContainer>
      ),
    },
    {
      path: 'dictionary/mapping/:configurationId/:configurationLanguage',
      element: (
        <PageContainer
          titleZone="ContentManagement"
          titleKey="DictionaryTranslationsMenuLabel"
          roleAccess={['admin']}
          isOld
        >
          <DictionaryMapping mode="NAMING_CONVENTION" />
        </PageContainer>
      ),
    },
    {
      path: 'dictionary/properties',
      element: (
        <PageContainer
          titleZone="ContentManagement"
          titleKey="PropertiesDictionary"
          roleAccess={['admin']}
          isOld
        >
          <DictionaryProperties />
        </PageContainer>
      ),
    },
    {
      path: 'dictionary/value',
      element: (
        <PageContainer titleZone="Dictionaries" titleKey="ValuePageTitle">
          <DictionnariesValues />
        </PageContainer>
      ),
    },
    {
      path: 'dictionary/properties/:propertyId',
      element: (
        <PageContainer titleZone="Dictionaries" titleKey="Properties">
          <Properties />
        </PageContainer>
      ),
    },
    {
      path: 'properties-dictionary',
      element: (
        <PageContainer
          titleZone="ContentManagement"
          roleAccess={['admin']}
          titleKey="PropertiesDictionary"
          isOld
        >
          <DictionaryProperties />
        </PageContainer>
      ),
    },
    /* properties sets */
    {
      path: 'dictionary/sets',
      element: (
        <PageContainer roleAccess={['admin']}>
          <PropertiesSets />
        </PageContainer>
      ),
    },
    {
      path: 'dictionary/sets/:setId',
      element: (
        <PageContainer roleAccess={['admin']}>
          <PropertiesSetDetail />
        </PageContainer>
      ),
    },
    {
      path: 'group/:groupId',
      children: [
        {
          index: true,
          element: <Navigate to="bimobjects" replace />,
        },
        {
          path: 'bimobjects',
          element: (
            <PageContainer titleZone="ContentManagement" titleKey="MenuItemGroupObjects">
              <Objects />
            </PageContainer>
          ),
        },
        {
          path: 'manage-users',
          element: (
            <PageContainer
              roleAccess={['admin']}
              titleZone="ContentManagement"
              titleKey="MenuItemUsers"
              isOld
            >
              <ManageUsers />
            </PageContainer>
          ),
        },
        {
          path: 'messages',
          element: (
            <PageContainer titleZone="ContentManagement" titleKey="MenuItemMessages" isOld>
              <PrettyMessagesComponent />
            </PageContainer>
          ),
        },
        {
          path: 'messages/:talkId',
          element: (
            <PageContainer titleZone="ContentManagement" titleKey="MenuItemMessages" isOld>
              <PrettyMessagesComponent />
            </PageContainer>
          ),
        },
      ],
    },
    {
      path: 'upload-object',
      children: [
        {
          index: true,
          element: <Navigate to="mapping" replace />,
        },
        {
          path: 'mapping',
          element: (
            <PageContainer sideBar={false} isOld>
              <UploadComponent />
            </PageContainer>
          ),
        },
      ],
    },
    plugin,
  ],
};

