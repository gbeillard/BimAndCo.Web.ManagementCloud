import {
  Button,
  Cluster,
  defaultTheme,
  Ellipsis,
  shadow,
  Small as DSSmall,
  TableCell,
  TableRow as DSTableRow,
  Tooltip,
} from '@bim-co/componentui-foundation';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import styled from '@emotion/styled';
import { getErrorMessage } from '../../../../../Api/errorUtils';
import { BadRequestError } from '../../../../../Api/types';
import { copyTextToClipboard } from '../../../../../Utils/utils';
import { selectTranslatedResources } from '../../../../../Reducers/app/selectors';
import { TableCellContent } from './Styles';

type Props = {
  resources: any;
  error: BadRequestError;
};

const TableRowError: React.FC<Props> = ({ resources, error }) => {
  const [referenceIsCopied, setReferenceIsCopied] = useState(false);

  if (!error) {
    return null;
  }

  const copyReference = () => {
    copyTextToClipboard(error.Path?.Reference);
    setReferenceIsCopied(true);
  };

  const errorMessage = getErrorMessage(resources, error.Code);
  const errorTitle = `${errorMessage}${error.Details?.trim() ? ` ${error.Details}` : ''}`;

  return (
    <TableRow key={error.TraceId} hover>
      <TableCell width="100px">
        <TableCellContent title={`${error.Path?.Line}`}>{error.Path?.Line}</TableCellContent>
      </TableCell>
      <TableCell minWidth="66px">
        <TableCellContent title={error.Path?.Name}>{error.Path?.Name}</TableCellContent>
      </TableCell>
      <TableCell width="4fr">
        <Cluster nowrap>
          <span title={errorTitle}>{errorMessage}</span>
          {error.Details?.trim() && (
            <Small title={errorTitle}>
              <Ellipsis>{error.Details}</Ellipsis>
            </Small>
          )}
        </Cluster>
      </TableCell>
      <TableCell minWidth="66px">
        <ReferenceWrapper>
          <ReferenceEllipsis title={error.Path?.Reference}>
            {error.Path?.Reference}
          </ReferenceEllipsis>
          <CopyButtonWrapper className="copy-button-wrapper">
            <Tooltip
              value={resources.ClassificationImportModal.ReferenceTooltipCopy}
              placement="top"
            >
              <CopyButton
                size="dense"
                icon="link"
                variant={referenceIsCopied ? 'confirm' : 'alternative'}
                onClick={copyReference}
                onMouseLeave={() => setReferenceIsCopied(false)}
              />
            </Tooltip>
          </CopyButtonWrapper>
        </ReferenceWrapper>
      </TableCell>
    </TableRow>
  );
};

const TableRow = styled(DSTableRow)`
  &:hover {
    .copy-button-wrapper {
      opacity: 1;
    }
  }
`;

const CopyButtonWrapper = styled.div`
  position: absolute;
  right: 0;
  opacity: 0;
  box-shadow: ${shadow[10]};
  background-color: ${defaultTheme.backgroundColor};
`;

const CopyButton = styled(Button)`
  &::before {
    content: inherit !important;
  }
`;

const ReferenceWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const ReferenceEllipsis = styled(TableCellContent)`
  position: absolute;
  width: 100%;
`;

const Small = styled(DSSmall)`
  overflow: hidden;
`;

const mapStateToProps = createStructuredSelector({
  resources: selectTranslatedResources,
});

export default connect(mapStateToProps)(TableRowError);
