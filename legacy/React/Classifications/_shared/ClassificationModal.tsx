import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  Button,
  colors,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  H4,
  space,
  Stack,
  TextField,
  Toggle,
  Tooltip,
  Dropdown,
} from '@bim-co/componentui-foundation';
import { createStructuredSelector } from 'reselect';
import styled from '@emotion/styled';
import { IClassification, ITranlation, StatusType } from '../../../Reducers/classifications/types';
import {
  selectLanguageCode,
  selectTranslatedResources,
  selectRole,
  selectIsBimAndCoOnfly,
} from '../../../Reducers/app/selectors';
import { RoleKey } from '../../../Reducers/Roles/types';
import { selectLanguage } from '../../../Reducers/classifications/selectors';
import { LanguageCode } from '../../../Reducers/app/types';
import { replaceStringByComponent } from '../../../Utils/utilsResources';

import LanguagesMenu from '../../CommonsElements/LanguagesMenu';
import PropertiesDropdown from './PropertiesDropdown';
import {
  addTranslation,
  getClassificationStatusLabels,
  getClassificationStatusLabel,
  getKeyOf,
  getTranslation,
  isRequiredName,
  updateTranslation,
  deleteTranslation,
} from './utils';
import { defaultClassification, getDefaultTranslation } from './DefaultValues';

type Props = {
  // from parent component
  classification?: IClassification;
  isOpen: boolean;
  onCancel: () => void;
  onSubmit: (currentClassification: IClassification, currentLanguage: LanguageCode) => void;
  disableCriticalFeatures?: boolean;
  // mapStateToProps
  isBimAndCoOnfly: boolean;
  languageCode: LanguageCode;
  resources: any;
  role: any;
};

const ClassificationModal: React.FC<Props> = ({
  classification = defaultClassification,
  isOpen,
  onCancel,
  onSubmit,
  disableCriticalFeatures,
  // mapStateToProps
  isBimAndCoOnfly,
  languageCode,
  resources,
  role,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [currentLanguage, setCurrentLanguage] = useState(languageCode);
  const [currentClassification, setCurrentClassification] = useState<IClassification>(null);

  useEffect(() => {
    if (isOpen) {
      setCurrentClassification(classification);

      const language = classification?.Id ? classification?.LanguageCode : languageCode;
      setCurrentLanguage(language);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const currentTranslation = getTranslation(currentClassification?.Translations, currentLanguage);

  // Errors handling
  const nameValidation = (value: string) => !value?.trim() && resources.MetaResource.Required;

  const validate = {
    Translations: (translations: ITranlation[]) => {
      const translation = getTranslation(translations, currentLanguage);

      if (isRequiredName(currentClassification, translation)) {
        return nameValidation(translation?.Name);
      }

      return null;
    },
  };

  const checkField = (field: string, value) => {
    const validation = validate[field];
    return validation && validation(value);
  };

  const getNewErrors = (currentErrors, field: string, value) => {
    const error = checkField(field, value);

    const newErrors = { ...currentErrors };
    if (!error) {
      delete newErrors[field];
    } else {
      newErrors[field] = error;
    }

    return newErrors;
  };

  const checkForm = () => {
    const newErrors = Object.keys(currentClassification ?? {}).reduce(
      (currentErrors, field) => getNewErrors(currentErrors, field, currentClassification[field]),
      {}
    );

    setErrors(newErrors);

    return newErrors;
  };

  const isValidForm = () => {
    const newErrors: { [s: string]: unknown } = checkForm();
    return !Object.values(newErrors ?? {}).length;
  };

  const handleTranslationChange = (e) => {
    const { name, value } = e.currentTarget;

    const defaultTranslation = getDefaultTranslation(currentLanguage);

    let updatedTranslations = currentClassification.Translations;

    if (!currentTranslation) {
      updatedTranslations = addTranslation(updatedTranslations, defaultTranslation);
    }

    const updatedTranslation = {
      ...(currentTranslation ?? defaultTranslation),
      [name]: value,
    };

    if (!updatedTranslation.Id && !updatedTranslation.Name && !updatedTranslation.Description) {
      updatedTranslations = deleteTranslation(updatedTranslations, updatedTranslation.LanguageCode);
    } else {
      updatedTranslations = updateTranslation(updatedTranslations, updatedTranslation);
    }

    setCurrentClassification({
      ...currentClassification,
      Translations: updatedTranslations,
    });

    setErrors(getNewErrors(errors, getKeyOf<IClassification>('Translations'), updatedTranslations));
  };

  // Handle text fields
  const handleChangeTextField: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (
    event
  ) => {
    const { name, value } = event.currentTarget;
    setCurrentClassification({
      ...currentClassification,
      [name]: value,
    });
    setErrors(getNewErrors(errors, name, value));
  };
  const onLanguageChange = (languageCodeValue) => {
    isValidForm() && setCurrentLanguage(languageCodeValue);
  };
  const onMandatoryChange = (value) => {
    setCurrentClassification({ ...currentClassification, IsMandatory: value });
  };
  const onStatusChange = (option) => {
    const statusOption = getDropdownStatusValue(option?.value);

    // If the status exist
    if (statusOption) {
      setCurrentClassification({ ...currentClassification, Status: option?.value });
    }
  };

  // Button Actions
  const onSaveHandler = async () => {
    setIsLoading(true);

    onSubmit(currentClassification, currentLanguage);

    setIsLoading(false);
    onCancel();
  };
  const handleOnClickSubmit = () => isValidForm() && onSaveHandler();
  const onCloseHandler = () => {
    onCancel();
    setErrors({});
  };

  // Handle PropertyDropdown
  const handleSelectPropertyName = (property) => {
    setCurrentClassification({ ...currentClassification, NameProperty: property });
  };
  const handleSelectPropertyCode = (property) => {
    setCurrentClassification({ ...currentClassification, CodeProperty: property });
  };
  const handleDeletePropertyName = () => {
    setCurrentClassification({ ...currentClassification, NameProperty: null });
  };
  const handleDeletePropertyCode = () => {
    setCurrentClassification({ ...currentClassification, CodeProperty: null });
  };

  const getDropdownStatusOptions = useCallback(() => {
    const classificationStatusLabels = getClassificationStatusLabels(resources);
    return Object.keys(classificationStatusLabels)?.map((classificationStatus) => ({
      value: classificationStatus,
      label: classificationStatusLabels[classificationStatus],
      isReadOnly: true,
    }));
  }, [resources]);

  const getDropdownStatusValue = (status: StatusType) =>
    getDropdownStatusOptions()?.find((dropdownOption) => dropdownOption?.value === status);

  const isDisabledStatus = !isBimAndCoOnfly;

  const getStatusTooltip = () =>
    isDisabledStatus
      ? resources.ContentManagementClassif.ClassificationStatusTooltip
      : getClassificationStatusLabel(resources, currentClassification?.Status);

  const getModalTitle = useCallback(() => {
    // Creation
    if (!classification?.Id) {
      return resources.ContentManagement.CreateNewClassification;
    }

    // Edition
    const title: string = resources.ContentManagement.EditClassification;
    return replaceStringByComponent(
      title,
      '[ClassificationName]',
      <strong>{classification?.Name}</strong>
    );
  }, [resources, classification]);

  return (
    <Dialog isOpen={isOpen} onClose={onCloseHandler}>
      <DialogTitle>{getModalTitle()}</DialogTitle>
      <DialogContent>
        <Stack space={space[100]}>
          <GroupWrapper space={space[100]}>
            <LanguageDropdownWrapper>
              <LanguagesMenu
                value={currentLanguage}
                onChange={onLanguageChange}
                menuOptions={{ placement: 'bottom-end' }}
                isDisabled={!classification?.Id}
              />
            </LanguageDropdownWrapper>
            <TextField
              name="Name" // for checkForm & handleTranslationChange
              label={resources.ContentManagement.ClassificationName}
              value={currentTranslation?.Name}
              onChange={handleTranslationChange}
              placeholder={resources.ContentManagement.ClassificationNamePlaceholder}
              isDisabled={disableCriticalFeatures}
              maxLength={200}
              isRequired={isRequiredName(currentClassification, currentTranslation)}
              isError={errors?.Translations}
              helperText={errors?.Translations}
            />
            <TextField
              value={currentTranslation?.Description}
              name="Description"
              label={resources.ContentManagement.ClassificationDescription}
              onChange={handleTranslationChange}
              placeholder={resources.ContentManagement.ClassificationDescriptionPlaceholder}
              maxLength={4000}
              isDisabled={disableCriticalFeatures}
              isMultiline
              rows={2}
            />
          </GroupWrapper>
          <Wrapper>
            <TextField
              name="Version"
              label={resources.ContentManagement.ClassificationVersion}
              value={currentClassification?.Version}
              onChange={handleChangeTextField}
              placeholder={resources.ContentManagement.ClassificationVersionPlaceholder}
              isDisabled={disableCriticalFeatures}
            />
            <ToggleWrapper>
              <Toggle
                label={resources.ContentManagementClassif.ClassificationMandatory}
                checked={currentClassification?.IsMandatory}
                onChange={onMandatoryChange}
                disabled={role.key !== RoleKey.admin}
              />
            </ToggleWrapper>
          </Wrapper>
          <Tooltip
            renderValue={() => <TooltipText>{getStatusTooltip()}</TooltipText>}
            placement="top-start"
          >
            <Dropdown
              labelText={resources.ContentManagementClassif.ClassificationStatusLabel}
              placeholderInside={resources.ContentManagementClassif.ClassificationStatusPlaceholder}
              noOptionsMessage={() => resources.ContentManagementClassif.NoOptionStatusMessage}
              options={getDropdownStatusOptions()}
              value={getDropdownStatusValue(currentClassification?.Status)}
              onChange={onStatusChange}
              isDisabled={isDisabledStatus}
              isClearable={false}
              noMargin
            />
          </Tooltip>
        </Stack>
        <GroupWrapper space={space[75]}>
          <H4 color={colors.NEUTRAL[60]}>
            {resources.ContentManagementClassif.SelectionPropertyTitle}
          </H4>
          <PropertiesDropdown
            selectedProperty={currentClassification?.NameProperty}
            placeholder={resources.ContentManagement.ClassificationPropertyName}
            onSelectProperty={handleSelectPropertyName}
            onDeleteProperty={handleDeletePropertyName}
          />
          <PropertiesDropdown
            selectedProperty={currentClassification?.CodeProperty}
            placeholder={resources.ContentManagement.ClassificationPropertyCode}
            onSelectProperty={handleSelectPropertyCode}
            onDeleteProperty={handleDeletePropertyCode}
          />
        </GroupWrapper>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCloseHandler}>{resources.MetaResource.Cancel}</Button>
        <Button variant="primary" onClick={handleOnClickSubmit} isLoading={isLoading}>
          {resources.MetaResource.Save}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const LanguageDropdownWrapper = styled.div({ textAlign: 'end' });

const Wrapper = styled.div({
  display: 'flex',
  width: '100%',
  justifyContent: 'space-between',
  gap: '20px',
});

const ToggleWrapper = styled.div({
  width: '150%',
  alignSelf: 'end',
  marginBottom: space[62],
});

const GroupWrapper = styled(Stack)({
  marginTop: space[100],
  padding: space[100],
  backgroundColor: colors.NEUTRAL[10],
});

const TooltipText = styled.div({
  padding: space[100],
  maxWidth: '320px',
});

const mapStateToProps = createStructuredSelector({
  isBimAndCoOnfly: selectIsBimAndCoOnfly,
  languageCode: selectLanguageCode,
  resources: selectTranslatedResources,
  role: selectRole,
  languageCodeClassification: selectLanguage,
});

export default connect(mapStateToProps, null)(ClassificationModal);
