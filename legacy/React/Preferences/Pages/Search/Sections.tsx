import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { Toggle, ToggleLabel } from '@bim-co/componentui-foundation';
import { updatePreferences as updatePreferencesAction } from '../../../../Reducers/preferences/actions';

import { selectPreferences } from '../../../../Reducers/preferences/selectors';
import { selectTranslatedResources } from '../../../../Reducers/app/selectors';

import { Section, SubSection } from '../../Components';
import {ManagementCloudViewModelV10,ManagementCloudPatchViewModelV10} from "@bim-co/platformtypeandfixture";

type Props = {
  resources: any;
  preferences: ManagementCloudViewModelV10;
  updatePreferences: (preferences: ManagementCloudPatchViewModelV10) => void;
};

const Sections: React.FC<Props> = ({ resources, preferences, updatePreferences }) => {
  const handleToggleEmptyProperties = (EmptyPropertiesPreference) => {
    updatePreferences({ EmptyPropertiesPreference });
  };

  return (
    <Section title={resources.Preferences.ObjectDetailCardTitle}>
      <SubSection
        title={resources.Preferences.EmptyPropertiesTitle}
        description={resources.Preferences.EmptyPropertiesDescription}
      >
        <ToggleLabel>
          <Toggle
            label={
              preferences.EmptyPropertiesPreference
                ? resources.Preferences.EmptyPropertiesMasked
                : resources.Preferences.EmptyPropertiesDisplayed
            }
            checked={preferences.EmptyPropertiesPreference}
            onChange={handleToggleEmptyProperties}
          />
        </ToggleLabel>
      </SubSection>
    </Section>
  );
};

const mapStateToProps = createStructuredSelector({
  preferences: selectPreferences,
  resources: selectTranslatedResources,
});

const mapDispatchToProps = (dispatch: any) => ({
  updatePreferences: (preferences: ManagementCloudPatchViewModelV10) => dispatch(updatePreferencesAction(preferences)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Sections);