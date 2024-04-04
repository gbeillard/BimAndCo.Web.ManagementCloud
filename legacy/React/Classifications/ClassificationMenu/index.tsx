import React, { useState, createRef } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { DropzoneRef } from 'react-dropzone';
import toastr from 'toastr';
import { BadRequestError, BadRequestImportExcel } from 'Scripts/App/Api/types';
import API from '../../../Reducers/classifications/api';
import {
  selectIsBoostOffer,
  selectLanguageCode,
  selectManagementCloudId,
  selectTranslatedResources,
  selectUser,
} from '../../../Reducers/app/selectors';
import { IClassification, Status } from '../../../Reducers/classifications/types';
import { LanguageCode, User } from '../../../Reducers/app/types';
import Menu from './Menu';
import { isDisableCriticalFeatures, redirectToClassificationDetails } from '../utils';
import DeleteConfirm from '../../PropertiesSets/DeleteConfirm';
import { replaceStringByComponent } from '../../../Utils/utilsResources';
import {
  deleteClassification as deleteClassificationAction,
  updateClassification as updateClassificationAction,
} from '../../../Reducers/classifications/actions';
import ClassificationModal from '../_shared/ClassificationModal';
import Dropzone from '../../CommonsElements/Dropzone';
import ImportModal from '../_shared/ImportModal/ImportModal';
import CloneModal from '../_shared/CloneModal/CloneModal';
import { ClassificationResponse } from '../interfaces';

const DROPZONE_CONFIG = {
  accept: {
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  },
  maxSize: 31457280,
};

type Props = {
  // from parent component
  classification: IClassification;
  onflyId: number;
  languageCode: LanguageCode;
  isBoostOffer: boolean;
  user: User;
  resources: any;
  onClick?: () => void;
  onClose?: () => void;
  onImportCompleted?: () => void;
  onDelete?: () => void;
  deleteClassification?: (
    classification: IClassification,
    keepPropertiesWithValue: boolean
  ) => void;
  updateClassification?: (classification: IClassification) => void;
};

const ClassificationMenu: React.FC<Props> = ({
  classification,
  onClick,
  onClose,
  onImportCompleted,
  onDelete,
  // From mapStateToProps
  onflyId,
  languageCode,
  isBoostOffer,
  user,
  resources,
  // From mapDispatchToProps
  deleteClassification,
  updateClassification,
}) => {
  const [isCloneModalOpen, setIsCloneModalOpen] = useState(false);
  const [isCloneModalLoading, setIsCloneModalLoading] = useState(false);
  const [cloneErrors, setCloneErrors] = useState(null);
  const [clonedClassification, setClonedClassification] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isClassificationModalOpen, setIsClassificationModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isImportModalLoading, setIsImportModalLoading] = useState(false);
  const [importedFile, setImportFile] = useState<File>(null);
  const [importErrors, setImportErrors] = useState<BadRequestError[]>(null);
  const [isImportFatalError, setIsImportFatalError] = useState(false);
  const dropzoneRef = createRef<DropzoneRef>();

  if (!classification) {
    return null;
  }

  const disableCriticalFeatures = isDisableCriticalFeatures(
    classification,
    isBoostOffer,
    onflyId,
    user
  );

  const setToastrTimeOut = (timeout: number, extendedTimeOut: number) => {
    toastr.options.timeOut = timeout;
    toastr.options.extendedTimeOut = extendedTimeOut;
  };

  const setDefaultToastrTimeOut = () => {
    setToastrTimeOut(5000, 1000);
  };

  const onExport = () => {
    setToastrTimeOut(0, 0); // Disabled the timeouts
    toastr.info(resources.ClassificationExport.InProgressTitle);

    API.download(languageCode, onflyId, classification)
      .then(() => {
        toastr.clear();
        setDefaultToastrTimeOut();
      })
      .catch(() => {
        toastr.remove();
        setDefaultToastrTimeOut();
        toastr.error(resources.ClassificationExport.ErrorTitle);
      });
  };

  const onClone = () => {
    setIsCloneModalLoading(true);
    setIsCloneModalOpen(true);
    API.create(onflyId, {
      ...classification,
      Status: Status.Private,
      Clone: {
        Id: classification?.Id,
      },
    })
      .then((res: ClassificationResponse) => {
        setIsCloneModalLoading(false);
        setClonedClassification(res?.Id);
      })
      .catch((error) => {
        setIsCloneModalLoading(false);
        if (error) {
          setCloneErrors(error?.response);
        }
      });
  };

  const closeCloneModal = () => {
    setIsCloneModalOpen(false);
  };

  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDeleteModalSubmit = (keepPropertiesWithValue: boolean) => {
    deleteClassification(classification, keepPropertiesWithValue);
    closeDeleteModal();
    onDelete?.();
  };

  const openEditClassification = () => {
    setIsClassificationModalOpen(true);
  };
  const closeEditClassification = () => {
    setIsClassificationModalOpen(false);
  };
  const openImportModal = (file: File) => {
    setImportFile(file);
    setIsImportModalLoading(true);
    setIsImportModalOpen(true);
    setImportErrors(null);
    setIsImportFatalError(false);
  };

  const closeImportModal = () => {
    setIsImportModalOpen(false);
  };

  const openFileDialog = () => {
    dropzoneRef?.current?.open?.();
  };

  const onImport = () => {
    onClose?.();
    openFileDialog();
  };

  const onDropAccepted = (acceptedFiles: File[]) => {
    if (acceptedFiles?.length) {
      const file = acceptedFiles[0];

      openImportModal(file);

      API.upload(languageCode, onflyId, classification, file)
        .then(() => {
          onImportCompleted?.();
          setIsImportModalLoading(false);
        })
        .catch((error) => {
          setIsImportModalLoading(false);

          if (error?.Status === 400) {
            const { Errors } = error as BadRequestImportExcel;
            setImportErrors(Errors);
          } else {
            setIsImportFatalError(true);
          }
        });
    }
  };

  /** Menu props */
  const criticalFeatures = !disableCriticalFeatures && {
    onExport,
    onEdit: openEditClassification,
    onImport,
    onDelete: openDeleteModal,
  };

  const deleteModalTitle = replaceStringByComponent(
    resources.ClassificationHome.DeleteClassificationTitle,
    '[ClassificationName]',
    <strong>{classification?.Name}</strong>
  );

  const handleEditModalSubmit = (
    currentClassification: IClassification,
    language: LanguageCode
  ) => {
    if (currentClassification?.Id) {
      // Edition
      API.update(language, onflyId, currentClassification).then(() => {
        updateClassification(currentClassification);
      });
    }
  };

  const handleRedirect = () => {
    redirectToClassificationDetails(clonedClassification, languageCode);
  };

  return (
    <>
      <Menu {...criticalFeatures} onClone={onClone} onClick={onClick} onClose={onClose} />
      <Dropzone
        {...DROPZONE_CONFIG}
        ref={dropzoneRef}
        multiple={false}
        onDropAccepted={onDropAccepted}
      />
      <CloneModal
        classification={classification}
        isOpen={isCloneModalOpen}
        errors={cloneErrors}
        isLoading={isCloneModalLoading}
        onClose={closeCloneModal}
        onRedirect={handleRedirect}
      />
      <ImportModal
        classification={classification}
        file={importedFile}
        isOpen={isImportModalOpen}
        isLoading={isImportModalLoading}
        errors={importErrors}
        isFatalError={isImportFatalError}
        onClose={closeImportModal}
        onImport={openFileDialog}
        onExport={onExport}
      />
      <DeleteConfirm
        isDisplayed={isDeleteModalOpen}
        title={deleteModalTitle}
        description={resources.ClassificationHome.DeleteClassificationDescription}
        submitButtonLabel={resources.ClassificationHome.DeleteClassificationConfirm}
        checkboxLabel={resources.ClassificationHome.DeleteClassificationCheckboxLabel}
        onCancel={closeDeleteModal}
        onSubmit={handleDeleteModalSubmit}
      />
      <ClassificationModal
        classification={classification}
        isOpen={isClassificationModalOpen}
        onCancel={closeEditClassification}
        onSubmit={handleEditModalSubmit}
        disableCriticalFeatures={disableCriticalFeatures}
      />
    </>
  );
};

const mapStateToProps = createStructuredSelector({
  onflyId: selectManagementCloudId,
  languageCode: selectLanguageCode,
  isBoostOffer: selectIsBoostOffer,
  user: selectUser,
  resources: selectTranslatedResources,
});

const mapDispatchToProps = (dispatch) => ({
  deleteClassification: (classification: IClassification, keepPropertiesWithValue: boolean) =>
    dispatch(deleteClassificationAction(classification, keepPropertiesWithValue)),
  updateClassification: (classification: IClassification) =>
    dispatch(updateClassificationAction(classification)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ClassificationMenu);
