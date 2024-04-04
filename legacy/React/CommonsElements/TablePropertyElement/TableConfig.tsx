import React, { useState, useMemo, useEffect } from 'react';
import styled from '@emotion/styled';
import { Button, DataTable } from '@bim-co/componentui-foundation';
import { Property } from '../../../Reducers/dictionary/types';
import HeaderTableConfig from './HeadTableConfig';
import CellTableConfig from './CellTableConfig';

type Props = {
  columns: (Property | null)[] | null;
  setColumns: (columns: (Property | null)[]) => void;
  resources: any;
};

const TableConfig: React.FC<Props> = ({ columns, setColumns, resources }) => {
  const refContainerDataTable = React.useRef<HTMLInputElement>();
  const [indexColumnOver, setIndexColumnOver] = useState<number>(-1);
  const defaultHeightRow: number = 35;

  useEffect(() => {
    const width = refContainerDataTable.current
      ? refContainerDataTable.current.offsetWidth / columns.length
      : 0;
    setDataTableColumns(dataTableColumns.map((column: any) => ({ ...column, width })));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refContainerDataTable]);

  const getColumn = (): any[] => [
    ...columns.map((_, index: number) => ({
      key: `${index}`,
      name: resources.ContentManagement.PropertiesModalTableChooseEntity,
      width: refContainerDataTable.current
        ? refContainerDataTable.current.offsetWidth / columns.length
        : 0,
      minWidth: 200,
      headerRenderer: () => (
        <HeaderTableConfig
          index={index}
          indexColumnOver={indexColumnOver}
          columns={columns}
          setIndexColumnOver={setIndexColumnOver}
          setColumns={setColumns}
          resources={resources}
        />
      ),
    })),
  ];

  const [dataTableColumns, setDataTableColumns] = useState<any[]>(getColumn());

  useEffect(() => {
    setDataTableColumns(getColumn());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns, setColumns]);

  const dataTableRows = useMemo(
    () => [
      {
        key: 1,
        // @ts-ignore
        ...Object.fromEntries(
          columns.map((_, index: number) => [
            `${index}`,
            <CellTableConfig index={index} columns={columns} setColumns={setColumns} />,
          ])
        ),
      },
    ],
    [columns, setColumns]
  );

  const handleClick = () => {
    setColumns([...columns, null]);
    setDataTableColumns(getColumn());
  };

  return (
    <>
      <HelperText>{resources.ContentManagement.PropertiesModalTableTitleTableConfig}</HelperText>
      <Container heightRow={defaultHeightRow * 2 + 2}>
        <ContainerDataTable ref={refContainerDataTable} tableHeight={defaultHeightRow * 2 + 19}>
          <DataTable columns={dataTableColumns} rows={dataTableRows} />
        </ContainerDataTable>
        <Button icon="add" onClick={handleClick} variant="primary" />
      </Container>
    </>
  );
};

const HelperText = styled.label`
  color: rgb(175, 168, 157);
  font-size: 12px !important;
`;

const Container = styled.div<{ heightRow: number }>(
  ({ heightRow }) => `
  display: flex;
  width: 100% !important;
  button {
    height: ${heightRow}px;
  }
`
);

const ContainerDataTable = styled.div<{ tableHeight: number }>(
  ({ tableHeight }) => `
  width: calc(100% - 40px);
  overflow-x: auto;
  .rdg {
    height: ${tableHeight}px;
  }
`
);

export default TableConfig;
