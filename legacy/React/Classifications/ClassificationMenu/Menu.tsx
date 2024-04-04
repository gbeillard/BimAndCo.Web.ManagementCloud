import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Menu as MenuDS } from '@bim-co/componentui-foundation';
import { selectTranslatedResources } from '../../../Reducers/app/selectors';

type Props = {
  resources: any;
  onClick: () => void;
  onClose?: () => void;
  onExport?: () => void;
  onClone?: () => void;
  onImport?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

const Menu: React.FC<Props> = ({ ...props }) => {
  const { onClick, onClose } = props;

  const options = getOptions(props);

  if (!options?.length) {
    return null;
  }

  return (
    <MenuDS
      items={options}
      menuOptions={{ placement: 'bottom-end' }}
      onClick={onClick}
      onClose={onClose}
    />
  );
};

// Menu options
enum MenuOption {
  Export,
  Clone,
  Import,
  Edit,
  Delete,
}

const getOptions = ({ resources, onExport, onClone, onImport, onEdit, onDelete }: Props) => {
  const options = [];

  if (onEdit) {
    const editOption = {
      id: MenuOption.Edit,
      icon: 'settings',
      label: resources.ClassificationDetails.EditClassification,
      onClick: () => onEdit?.(),
    };

    options.push(editOption);
  }

  const cloneOption = {
    id: MenuOption.Clone,
    icon: 'duplicate',
    label: resources.ClassificationDetails.CloneClassification,
    onClick: () => onClone?.(),
  };

  options.push(cloneOption);

  if (onExport) {
    const exportOption = {
      id: MenuOption.Export,
      icon: 'export',
      label: resources.ClassificationMenu.Export,
      onClick: () => onExport?.(),
    };

    options.push(exportOption);
  }

  if (onImport) {
    const importOption = {
      id: MenuOption.Import,
      icon: 'import',
      label: resources.ClassificationMenu.Import,
      onClick: () => onImport?.(),
    };

    options.push(importOption);
  }

  if (onDelete) {
    const deleteOption = {
      id: MenuOption.Delete,
      icon: 'delete',
      label: resources.ClassificationDetails.DeleteClassification,
      onClick: () => onDelete?.(),
    };

    options.push(deleteOption);
  }

  return options;
};

const mapStateToProps = createStructuredSelector({
  resources: selectTranslatedResources,
});

export default connect(mapStateToProps)(Menu);
