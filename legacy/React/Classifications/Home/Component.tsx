import React, { useCallback, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import styled from '@emotion/styled';
import { Button, TextField, space } from '@bim-co/componentui-foundation';
import { selectIsBoostOffer, selectTranslatedResources } from '../../../Reducers/app/selectors';
import { ClassificationsSort, IClassification } from '../../../Reducers/classifications/types';
import List from './List';
import PageContentContainer from '../../CommonsElements/PageContentContainer';
import ClassificationModal from '../_shared/ClassificationModal';

type Props = {
  classifications: IClassification[];
  onClassificationChanged: (c: IClassification) => void;
  filter: string;
  setFilter: (f: string) => void;
  sort: ClassificationsSort;
  setSort: (s: ClassificationsSort) => void;
  onCreate: (c: IClassification) => void;
  onClassificationClicked: (c: IClassification) => void;
  isBoostOffer: boolean;
  resources: any;
};

const Component: React.FC<Props> = ({
  classifications,
  onClassificationChanged,
  filter,
  setFilter,
  sort,
  setSort,
  onCreate,
  onClassificationClicked,
  isBoostOffer,
  resources,
}) => {
  const [showCreate, setShowCreate] = useState(false);

  const handleShowCreate = useCallback(() => {
    setShowCreate(true);
  }, [setShowCreate]);

  const handleCloseCreate = useCallback(() => {
    setShowCreate(false);
  }, [setShowCreate]);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      setFilter(event.target.value);
    },
    [setFilter]
  );

  return (
    <PageContentContainer>
      <Toolbar>
        <FilterWrapper>
          <TextField
            data-testid="filter"
            value={filter}
            placeholder={resources.ClassificationHome.FilterPlaceholder}
            onChange={handleChange}
            iconLeft="search"
          />
        </FilterWrapper>
        {!isBoostOffer && (
          <Button variant="secondary" icon="create" onClick={handleShowCreate}>
            {resources.ClassificationHome.CreateButton}
          </Button>
        )}
      </Toolbar>
      <List
        classifications={classifications}
        onClassificationChanged={onClassificationChanged}
        onClassificationClicked={onClassificationClicked}
        sort={sort}
        setSort={setSort}
      />
      <ClassificationModal isOpen={showCreate} onSubmit={onCreate} onCancel={handleCloseCreate} />
    </PageContentContainer>
  );
};

const Toolbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${space[100]};
  padding-top: ${space[125]};
`;

const FilterWrapper = styled.div`
  width: 40%;
  margin: 0 8px;
`;

const mapStateToProps = createStructuredSelector({
  resources: selectTranslatedResources,
  isBoostOffer: selectIsBoostOffer,
});

export default connect(mapStateToProps)(React.memo(Component));
