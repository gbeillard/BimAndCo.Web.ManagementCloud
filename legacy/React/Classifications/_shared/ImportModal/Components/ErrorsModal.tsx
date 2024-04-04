import React, { useEffect, useState } from 'react';
import {
  Badge,
  Button,
  Cluster,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TabsV2,
  TabV2,
} from '@bim-co/componentui-foundation';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { BadRequestError } from 'Scripts/App/Api/types';
import _ from 'underscore';
import styled from '@emotion/styled';
import { selectTranslatedResources } from '../../../../../Reducers/app/selectors';
import TableRowError from './TableRowError';

type Props = {
  resources: any;
  isOpen: boolean;
  file: File;
  errors: BadRequestError[];
  onClose: () => void;
  onImport: () => void;
};

type Sheets = {
  [key: string]: BadRequestError[];
};

const ErrorsModal: React.FC<Props> = ({ resources, isOpen, file, errors, onClose, onImport }) => {
  const [sheets, setSheets] = useState<Sheets>({});
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const newSheets = _.groupBy(errors, (error: BadRequestError) => error?.Path?.Sheet);
    setSheets(newSheets);
  }, [errors]);

  const onChangeTab = (value: number) => setTabValue(value);

  const renderTabs = () =>
    Object.keys(sheets)?.map((sheet) => (
      <TabV2 key={sheet}>
        <Cluster nowrap>
          <span>{sheet}</span>
          <Badge>{sheets[sheet]?.length}</Badge>
        </Cluster>
      </TabV2>
    ));

  const renderBody = () => {
    const sheetErrors = Object.values(sheets)?.[tabValue];

    if (!sheetErrors?.length) {
      return null;
    }

    return sheetErrors.map((error) => <TableRowError key={error.TraceId} error={error} />);
  };

  const dialogProps = {
    className: 'oc-page-modal',
  };

  return (
    <Dialog isFullSize isOpen={isOpen} onClose={onClose} {...dialogProps}>
      <DialogTitle>{file?.name}</DialogTitle>
      <DialogContent>
        <ContentWrapper>
          <TabsV2 onChange={onChangeTab} value={tabValue}>
            {renderTabs()}
          </TabsV2>
          <TableWrapper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell width="100px">
                    {resources.ClassificationImportModal.LineColumn}
                  </TableCell>
                  <TableCell minWidth="66px">
                    {resources.ClassificationImportModal.NameColumn}
                  </TableCell>
                  <TableCell width="4fr">
                    {resources.ClassificationImportModal.ErreurColumn}
                  </TableCell>
                  <TableCell minWidth="66px">
                    {resources.ClassificationImportModal.ReferenceColumn}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{renderBody()}</TableBody>
            </Table>
          </TableWrapper>
        </ContentWrapper>
      </DialogContent>
      <DialogActions>
        <Button variant="secondary" icon="import" onClick={onImport}>
          {resources.ClassificationMenu.Import}
        </Button>
        <Button onClick={onClose}>{resources.MetaResource.Close}</Button>
      </DialogActions>
    </Dialog>
  );
};

const ContentWrapper = styled.div`
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const TableWrapper = styled.div`
  overflow: auto;
`;

const mapStateToProps = createStructuredSelector({
  resources: selectTranslatedResources,
});

export default connect(mapStateToProps)(ErrorsModal);
