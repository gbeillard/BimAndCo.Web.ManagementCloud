import { LibrarySettings } from '@bim-co/onfly-connect/Search';
import { createLibrary } from '../React/Search/utils';
import { ContentManagementLibrary } from '../Reducers/BimObject/types';
import { RoleKey } from '../Reducers/Roles/types';

export const getLibrariesSettings = (roleKey: RoleKey): LibrarySettings[] => {
  if (roleKey === RoleKey.public_creator) {
    return [
      { Name: ContentManagementLibrary.Onfly, IsVisible: false },
      { Name: ContentManagementLibrary.Entity, IsVisible: false },
      { Name: ContentManagementLibrary.Platform, IsVisible: true },
      { Name: ContentManagementLibrary.User, IsVisible: true },
      { Name: ContentManagementLibrary.Spaces, IsVisible: true },
    ];
  }
  return [
    { Name: ContentManagementLibrary.Onfly, IsVisible: true },
    { Name: ContentManagementLibrary.Entity, IsVisible: true },
    { Name: ContentManagementLibrary.Platform, IsVisible: true },
    { Name: ContentManagementLibrary.User, IsVisible: false },
    { Name: ContentManagementLibrary.Spaces, IsVisible: true },
  ];
};

const isVisibleLibrary = (libraries: [{ Name: string }], librariesSettings: LibrarySettings[]) =>
  libraries?.filter(
    (library) =>
      librariesSettings.find((librarySettings) => librarySettings.Name === library.Name)?.IsVisible
  );

export const getDefaultLibraries = (enableWhiteLabelSite: boolean, roleKey: string) => {
  const storedLibraries = JSON.parse(sessionStorage.getItem('searchLibraries'));

  if (roleKey === RoleKey.public_creator) {
    const defaultLibraries = [createLibrary(ContentManagementLibrary.Platform)];
    const visibleLibraries = isVisibleLibrary(storedLibraries, getLibrariesSettings(roleKey));
    const libraries = visibleLibraries?.length ? visibleLibraries : defaultLibraries;

    sessionStorage.setItem('searchLibraries', JSON.stringify(libraries));
    return libraries;
  }

  if (enableWhiteLabelSite) {
    const libraries = storedLibraries?.length
      ? storedLibraries
      : [createLibrary(ContentManagementLibrary.Onfly)];

    sessionStorage.setItem('searchLibraries', JSON.stringify(libraries));
    return libraries;
  }

  const libraries = storedLibraries?.length
    ? storedLibraries
    : [createLibrary(ContentManagementLibrary.Onfly), createLibrary(ContentManagementLibrary.User)];

  sessionStorage.setItem('searchLibraries', JSON.stringify(libraries));
  return libraries;
};
