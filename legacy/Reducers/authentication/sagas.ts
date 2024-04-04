import { call, delay, put, select, takeLatest } from 'redux-saga/effects';
import { selectLanguageCode, selectManagementCloudId } from '../app/selectors';
import {
  checkAuthenticationError,
  checkAuthenticationSuccess,
  getUserInfoError,
  getUserInfoSuccess,
  setToken,
  signinError,
  signinSuccess,
} from './actions';
import api from './api';
import {
  ConnectSSOResponse,
  CHECK_AUTHENTICATION,
  CHECK_AUTHENTICATION_SUCCESS,
  SIGNIN,
  SigninAction,
  SIGNIN_SUCCESS,
  UserInfo,
  IntroscpectSSOResponse,
  RefreshTokenSSOResponse,
} from './types';
import { history } from '../../history';
import { RoutePaths } from '../../React/Sidebar/RoutePaths';

function* introspect() {
  const token = localStorage.getItem('Temporary_token');
  const responseIntrospect: IntroscpectSSOResponse = yield call(api.introspectToken, token);

  if (responseIntrospect?.active) {
    const tokenRefreshDelay = responseIntrospect.exp - Date.now() / 1000; // Secondes
    localStorage.setItem('TokenRefreshDelay', tokenRefreshDelay.toString());
    localStorage.setItem('SubjectId', responseIntrospect.sub);

    yield put(setToken(token));
  }

  return responseIntrospect;
}

function* refreshToken() {
  const response: RefreshTokenSSOResponse = yield call(api.refreshToken);

  localStorage.setItem('Temporary_token', response.access_token);
  localStorage.setItem('Refresh_token', response.refresh_token);
  localStorage.setItem('TokenRefreshDelay', response.expires_in?.toString());

  yield put(setToken(response.access_token));
}

export function* signin({ code, languageCode }: SigninAction) {
  try {
    if (!localStorage.getItem('Code_token')) {
      const response: ConnectSSOResponse = yield call(api.getAccessToken, code, languageCode);
      localStorage.setItem('Code_token', code);
      localStorage.setItem('Temporary_token', response.access_token);
      localStorage.setItem('Refresh_token', response.refresh_token);
      const onflyId: number = yield select(selectManagementCloudId);

      yield call(introspect);
      const userId: string = localStorage.getItem('SubjectId');
      yield call(api.validateInvitation, onflyId, userId);
      yield put(signinSuccess());
      yield call(refreshTokenLoop);
    } else {
      yield put(signinSuccess());
    }
  } catch (error) {
    yield put(signinError(error as string));
  }
}

export function* checkAuthentication() {
  try {
    const introspectResponse: IntroscpectSSOResponse = yield call(introspect);
    const userId: string = localStorage.getItem('SubjectId');
    const onflyId: number = yield select(selectManagementCloudId);

    if (!introspectResponse?.active) {
      yield call(refreshToken);
    }

    yield call(api.validateInvitation, onflyId, userId);
    yield put(checkAuthenticationSuccess());
    yield call(refreshTokenLoop);
  } catch (error) {
    yield put(checkAuthenticationError(error as string));
  }
}

export function* refreshTokenLoop() {
  try {
    const tokenRefreshDelay = Number(localStorage.getItem('TokenRefreshDelay') ?? 0); // Secondes

    // On retire 60 secondes, pour que le délai se termine avant la fin de la validité du token
    const interval = (tokenRefreshDelay - 60) * 1000; // ms

    yield delay(interval);
    yield call(refreshToken);
    yield call(refreshTokenLoop);
  } catch (error) {
    console.error('Refresh token loop error:', error);
  }
}

export function* getUserInfo() {
  try {
    const onflyId: number = yield select(selectManagementCloudId);
    const userId = localStorage.getItem('SubjectId');
    const response: UserInfo = yield call(api.getUserInfo, onflyId, userId);
    yield put(getUserInfoSuccess(response));
  } catch (error) {
    console.log('Error during UserInfoSuccess : ', error);
    yield put(getUserInfoError(error as string));
    console.error(error);
    // Erreur lors de la récupération de l'utilisateur pour l'Onfly
    // Redirige vers la page "/unauthorized" pour que l'utilisateur utilise un autre compte ou demande l'accès au Onfly
    const languageCode = yield select(selectLanguageCode) ?? 'en';
    const url = `/${languageCode}/${RoutePaths.Unauthorized}`;
    history.push(url);
  }
}

const sagas = [
  takeLatest(CHECK_AUTHENTICATION, checkAuthentication),
  takeLatest(SIGNIN, signin),
  takeLatest(CHECK_AUTHENTICATION_SUCCESS, getUserInfo),
  takeLatest(SIGNIN_SUCCESS, getUserInfo),
];

export default sagas;
