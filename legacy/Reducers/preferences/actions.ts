import {
  FetchPreferencesAction,
  FetchPreferencesErrorAction,
  FetchPreferencesSuccessAction,
  FETCH_PREFERENCES,
  FETCH_PREFERENCES_ERROR,
  FETCH_PREFERENCES_SUCCESS,
  UpdatePreferencesAction,
  UpdatePreferencesErrorAction,
  UpdatePreferencesSuccessAction,
  UPDATE_PREFERENCES,
  UPDATE_PREFERENCES_ERROR,
  UPDATE_PREFERENCES_SUCCESS,
} from './types';
import {ManagementCloudViewModelV10,ManagementCloudPatchViewModelV10} from "@bim-co/platformtypeandfixture";

export const fetchPreferences = (): FetchPreferencesAction => ({
  type: FETCH_PREFERENCES,
});

export const fetchPreferencesSuccess = (
  preferences: ManagementCloudViewModelV10
): FetchPreferencesSuccessAction => ({
  type: FETCH_PREFERENCES_SUCCESS,
  preferences,
});

export const fetchPreferencesError = (error: string): FetchPreferencesErrorAction => ({
  type: FETCH_PREFERENCES_ERROR,
  error,
});

export const updatePreferences = (preferences: ManagementCloudPatchViewModelV10): UpdatePreferencesAction => ({
  type: UPDATE_PREFERENCES,
  preferences,
});

export const updatePreferencesSuccess = (): UpdatePreferencesSuccessAction => ({
  type: UPDATE_PREFERENCES_SUCCESS,
});

export const updatePreferencesError = (error: string): UpdatePreferencesErrorAction => ({
  type: UPDATE_PREFERENCES_ERROR,
  error,
});