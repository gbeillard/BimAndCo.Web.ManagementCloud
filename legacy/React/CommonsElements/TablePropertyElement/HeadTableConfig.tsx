import React from 'react';
import { Menu } from '@bim-co/componentui-foundation';
import styled from '@emotion/styled';
import { Property } from '../../../Reducers/dictionary/types';
import { arrayMove } from './utils';

type Props = {
  index: number;
  columns: (Property | null)[] | null;
  setColumns: (columns: (Property | null)[]) => void;
  indexColumnOver: number;
  setIndexColumnOver: (index: number) => void;
  resources: any;
};

enum MenuOption {
  Delete,
  MoveLeft,
  MoveRight,
}

const HeaderTableConfig: React.FC<Props> = ({
  index,
  columns,
  setColumns,
  indexColumnOver,
  setIndexColumnOver,
  resources,
}) => {
  const onChangeMenu = (option: MenuOption): void => {
    switch (option) {
      case MenuOption.Delete:
        setColumns(columns.filter((_, ind: number) => ind !== index));
        break;
      case MenuOption.MoveLeft:
        setColumns(arrayMove(columns, index, index - 1));
        break;
      case MenuOption.MoveRight:
        setColumns(arrayMove(columns, index, index + 1));
        break;
      default:
        break;
    }
  };

  const handleMouseEnter = () => setIndexColumnOver(index);

  const handleMouseLeave = () =>
    setIndexColumnOver(index === indexColumnOver ? -1 : indexColumnOver);

  const items = [
    {
      icon: 'delete-round',
      id: '1',
      label: resources.MetaResource.Delete,
      value: MenuOption.Delete,
    },
    {
      icon: 'arrow-left',
      id: '2',
      label: resources.ContentManagement.PropertiesModalTableMoveLeft,
      value: MenuOption.MoveLeft,
      disabled: index === 0,
    },
    {
      icon: 'arrow-right',
      id: '3',
      label: resources.ContentManagement.PropertiesModalTableMoveRight,
      value: MenuOption.MoveRight,
      disabled: index === columns.length - 1,
    },
  ];

  const handleChangeMenu = (item) => onChangeMenu(item.value);

  return (
    <Container onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <span title={resources.ContentManagement.PropertiesModalTableChooseEntity}>
        {resources.ContentManagement.PropertiesModalTableChooseEntity}
      </span>
      {index === indexColumnOver && <Menu size="dense" items={items} onChange={handleChangeMenu} />}
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export default HeaderTableConfig;
