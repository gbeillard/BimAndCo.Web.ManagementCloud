import { IClassification, ITranlation, Status } from '../../../Reducers/classifications/types';
import { LanguageCode } from '../../../Reducers/app/types';

export const getTranslation = (
  translations: ITranlation[],
  languageCode: LanguageCode
): ITranlation => {
  if (!Array.isArray(translations) || translations.length === 0) {
    return null; // or throw an error if appropriate
  }
  return translations.find((t) => t?.LanguageCode === languageCode);
};

export const hasTranslation = (translations: ITranlation[], languageCode: LanguageCode): boolean =>
  translations?.some((t) => t?.LanguageCode === languageCode);

export const addTranslation = (
  translations: ITranlation[],
  translation: ITranlation
): ITranlation[] => {
  // Check if a translation with the same language code already exists in the array
  if (translations && !hasTranslation(translations, translation?.LanguageCode)) {
    // If not, add the new translation to the array
    return [...translations, translation];
  }
  // If already exists, return the original array
  return translations;
};

export const updateTranslation = (
  translations: ITranlation[],
  translation: ITranlation
): ITranlation[] => {
  // Find the index of the translation with the same language code as the updated translation
  const index = translations.findIndex((t) => t?.LanguageCode === translation?.LanguageCode);
  const newTranslations = [...translations];

  // update
  if (index >= 0) {
    newTranslations[index] = {
      ...newTranslations[index],
      ...translation,
    };
  }

  return newTranslations;
};

export const getClassificationStatusLabels = (resources: any) => ({
  [Status.Private]: resources.ContentManagementClassif.ClassificationStatusPrivate,
  [Status.Public]: resources.ContentManagementClassif.ClassificationStatusPublic,
});

export const getStatusTooltipLabels = (resources: any) => ({
  [Status.Private]: resources.ContentManagementClassif.ClassificationStatusTooltipPrivate,
  [Status.Public]: resources.ContentManagementClassif.ClassificationStatusTooltipPublic,
});

export const getClassificationStatusLabel = (resources: any, status: Status) =>
  getStatusTooltipLabels(resources)[status];

/**
 * Return the translations without empty objects.
 * @param translations Translations of Classification
 * @description If the translation doesn't exist, and name is empty then delete it.
 * @returns Translations array
 */
export const deleteTranslation = (translations: ITranlation[], languageCode): ITranlation[] =>
  [...translations].filter((translation) => translation.LanguageCode !== languageCode);

/**
 * Return the key of type.
 * @param name Name of key
 * @description If the key is not in the type, you get an typescript error.
 * @returns Name of key
 */
export const getKeyOf = <T>(name: keyof T) => name;

/**
 * Si la traduction existe déjà
 * OU si on a renseigné une description
 * on doit obligatoirement renseigner le nom
 * @param translation
 * @returns
 */
export const isRequiredName = (classification: IClassification, translation: ITranlation) =>
  !classification?.Id || translation?.Id || translation?.Description?.trim();

export const getClassificationName = (
  classification: IClassification,
  language: LanguageCode
): string => {
  const translation = classification?.Translations?.find((t) => t?.LanguageCode === language);
  if (translation?.Name) {
    return translation?.Name;
  }
  return classification?.Name;
};
