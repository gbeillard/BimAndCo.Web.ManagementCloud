import styled from '@emotion/styled';
import { Skeleton } from '@bim-co/onfly-connect';
import React from 'react';

const retrieveSkeletonType = (index: number, rowCount: number, header: boolean, checkboxCount) => {
  // eslint-disable-next-line no-nested-ternary
  const type = index < checkboxCount ? 'checkbox' : index === checkboxCount ? 'longline' : 'line';

  return header ? `header${type}` : type;
};

const DataTableSkeleton = ({
  rowCount,
  columnCount,
  isHeader = true,
  checkboxCount = 3,
}): JSX.Element => (
  <table>
    {isHeader && (
      <thead>
        <tr>
          {Array.from({ length: columnCount }, (_, i) => (
            <th key={i}>
              <StyledSkeleton
                // @ts-ignore
                variant={retrieveSkeletonType(i, rowCount, true, checkboxCount)}
                animation="pulse"
              />
            </th>
          ))}
        </tr>
      </thead>
    )}
    <tbody>
      {Array.from({ length: rowCount }, (_, i) => (
        <tr key={i}>
          {Array.from({ length: columnCount }, (row, j) => (
            <th
              key={j}
              style={{
                backgroundColor: 'white',
              }}
            >
              <StyledSkeleton
                // @ts-ignore
                variant={retrieveSkeletonType(j, rowCount, false, checkboxCount)}
                animation="pulse"
              />
            </th>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

export const SummaryUploadDetailsListSkeleton = () => (
  <StyledWrapperSkeleton>
    <StyledDivSearchSkeleton>
      <DataTableSkeleton rowCount={1} columnCount={1} isHeader={false} checkboxCount={0} />
    </StyledDivSearchSkeleton>
    <DataTableSkeleton rowCount={10} columnCount={15} isHeader={false} checkboxCount={1} />
  </StyledWrapperSkeleton>
);

const StyledWrapperSkeleton = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  margin: 20px;
  overflow-x: hidden;
  overflow-y: hidden;
  background: transparent;
`;

const StyledSkeleton = styled(Skeleton)`
  margin: 1px;
`;

const StyledDivSearchSkeleton = styled.div`
  width: 50%;
  margin: 0px 15px 15px 0;
`;
