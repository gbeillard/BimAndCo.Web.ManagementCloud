import React, { useEffect, useState } from 'react';
import { Button, DataTable, Stack } from '@bim-co/componentui-foundation';
import { connect } from 'react-redux';
import styled from '@emotion/styled';
import { Property } from 'Scripts/App/Reducers/dictionary/types';
import { createStructuredSelector } from 'reselect';
import { DATA_TYPES } from '../../../../Properties/PropertyPicker/constants';
import { fetchDictionary as fetchDictionaryAction } from '../../../../../Reducers/dictionary/actions';
import { selectProperties } from '../../../../../Reducers/dictionary/selectors';
import Dialog from '../../../../../components/dialogs/Dialog';
import DialogActions from '../../../../../components/dialogs/DialogActions';
import { TableJson, ColumnType, ValueJson, DataType, Column, TypeColumn } from './types';
import Cell from './Cell';
import DeleteRowButton from './DeleteRowButton';

type Props = {
  resources: any;
  isOpen: boolean;
  sendData: (data: string) => void;
  initData: TableJson;
  property: Property;
  properties: Property[];
  fetchDictionary: () => void;
};

const ModalEditTableProperty: React.FC<Props> = ({
  resources,
  isOpen,
  sendData,
  initData,
  property,
  properties,
  fetchDictionary,
}) => {
  const [data, setData] = useState<{ [key: string]: DataType }[]>([]);
  const [column, setColumn] = useState<ColumnType[]>([]);

  const defaultHeightRow: number = 27;

  useEffect(() => {
    fetchDictionary();
    setInitData();
  }, []);

  useEffect(() => {
    if (property && properties) {
      setColumn([
        ...property.SchemaTable.Columns.map(mapColumnToColumnType),
        mapPropertyToColumnType(property),
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initData, property]);

  const mapColumnToColumnType = (col: Column): ColumnType => {
    const prop: Property = properties.find((p: Property) => p?.Guid === col?.Guid);
    return mapPropertyToColumnType(prop);
  };

  const mapPropertyToColumnType = (prop: Property): ColumnType => ({
    key: prop?.Id,
    guid: prop?.Guid,
    name: prop?.Name,
    type: getType(prop?.DataTypeId),
  });

  const getType = (dataTypeId: number): TypeColumn => {
    switch (dataTypeId) {
      case DATA_TYPES.INT:
      case DATA_TYPES.NUMERIC:
        return TypeColumn.NUMBER;
      case DATA_TYPES.STRING:
      case DATA_TYPES.TEXT:
        return TypeColumn.TEXT;
      case DATA_TYPES.BOOL:
        return TypeColumn.BOOLEAN;
      default:
        return TypeColumn.TEXT;
    }
  };

  const setInitData = (): void => {
    if (initData)
      setData(
        initData?.Row.map((row: ValueJson[]) =>
          Object.fromEntries(row.map((value: ValueJson) => [value.Guid, value.Value]))
        )
      );
  };

  const getHeader = () => [
    ...column.map((col: ColumnType) => ({
      frozen: true,
      key: col.key,
      name: col.name,
      resizable: true,
    })),
  ];

  const getRow = (): { [key: string]: Element }[] =>
    data.map((rowData: { [key: string]: DataType }, index: number) => ({
      ...Object.fromEntries([
        ...column.map((col: ColumnType) => [
          col.key,
          <Cell
            dataType={col.type}
            initValue={rowData[col.guid]}
            onChange={(event: any) => onChangeData(index, col.guid, event?.target?.value)}
          />,
        ]),
        ['key', index],
      ]),
      delete: <DeleteRowButton onClick={() => onDeleteRow(index)} />,
    }));

  const onChangeData = (index: number, key: string, value: DataType) => {
    const newData: { [key: string]: DataType }[] = [...data];
    newData[index][key] = value;
    setData(newData);
  };

  const onDeleteRow = (index: number) => {
    const newData: { [key: string]: DataType }[] = [...data];
    setData(newData.filter((_, i: number) => index !== i));
  };

  const getDataFormat = (): string =>
    JSON.stringify({
      Row: data.map((d: { [key: string]: DataType }) =>
        Object.entries(d).map(([, value]: [string, DataType], index: number) => ({
          Guid:
            property.SchemaTable.Columns.length > index
              ? property.SchemaTable.Columns[index].Guid
              : property.Guid,
          Value: value,
        }))
      ),
    });

  const addRow = (): void =>
    setData([
      ...data,
      Object.fromEntries([
        ...column.map((col: ColumnType) => [
          col.guid,
          col.type === getType(DATA_TYPES.BOOL) ? false : '',
        ]),
      ]),
    ]);

  return (
    <Dialog open={isOpen} onClose={() => sendData('')} fullWidth>
      <Stack>
        <Container tableHeight={defaultHeightRow * data.length + 47}>
          <DataTableContainerStyled>
            <DataTable
              cellNavigationMode="NONE"
              className="DataTable"
              columns={[
                ...getHeader(),
                {
                  frozen: false,
                  key: 'delete',
                  name: resources.MetaResource.Delete,
                  resizable: false,
                  width: 2,
                },
              ]}
              headerRowHeight={45}
              rowHeight={27}
              rows={getRow()}
            />
          </DataTableContainerStyled>
        </Container>
        <Button icon="add" onClick={addRow} size="dense" variant="primary">
          {resources.MetaResource.Add}
        </Button>
      </Stack>
      <DialogActions>
        <Button onClick={() => sendData(getDataFormat())}>{resources.MetaResource.Save}</Button>
      </DialogActions>
    </Dialog>
  );
};

const DataTableContainerStyled = styled.div`
  .DataGrid {
    .DataGrid__Header {
      font-weight: 450;
      padding-left: 10px;
    }
  }
`;

const Container = styled.div<{ tableHeight: number }>(
  ({ tableHeight }) => `
  .rdg {
    height: ${tableHeight}px;
  }
`
);

const mapStateToProps = createStructuredSelector({
  properties: selectProperties,
});

const mapDispatchToProps = (dispatch) => ({
  fetchDictionary: () => dispatch(fetchDictionaryAction()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ModalEditTableProperty);
