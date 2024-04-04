import { BIMANDCO_ONFLY_ID } from './constants';
import { history } from '../../history';
import { RoutePaths } from '../Sidebar/RoutePaths';

export const isDisableCriticalFeatures = (classification, isBoostOffer, onflyId, user) => {
  const isPublicClassification = !classification?.IsPrivate;
  const isBimAndCoOnfly = onflyId === BIMANDCO_ONFLY_ID;
  const { isBimAndCoAdmin } = user;
  const classificationOwner = classification?.OwnerId;
  const isClassicationCurrentOnfly = classificationOwner === onflyId;

  return (
    (isPublicClassification || isBoostOffer || !isClassicationCurrentOnfly) &&
    (!isBimAndCoOnfly || !isBimAndCoAdmin)
  );
};

export const redirectToClassificationDetails = (
  classificationId,
  language: string,
  automaticTranslation = false
) => {
  const path = `/${language}/${RoutePaths.ManageClassifications}/${classificationId}`;

  if (automaticTranslation) {
    history.push(path, { translationInProgress: true });
  } else {
    history.push(path);
  }
};
