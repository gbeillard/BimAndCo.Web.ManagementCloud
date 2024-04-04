import { toastr } from 'toastr';
import { IClassification, IClassificationNode } from './types';
import { API_URL } from '../../Api/constants';
import { generateRequest, parseJSON, request, requestExcel, RequestOptions } from '../../Api/utils';
import { LanguageCode } from '../app/types';

const get = (language: LanguageCode, onflyId: number, id: number) => {
  const url = `${API_URL}/api/v10/onfly/${onflyId}/classifications/${id}`;
  const options: RequestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept-Language': language,
    },
  };

  return request(url, options);
};

const list = (language: LanguageCode, onflyId: number) => {
  const url = `${API_URL}/api/v10/onfly/${onflyId}/classifications`;
  const options: RequestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept-Language': language,
    },
  };

  return request(url, options);
};

export const create = async (contentManagementId, classification) => {
  const url = `${API_URL}/api/v10/onfly/${contentManagementId}/classifications`;
  const body = JSON.stringify(classification);
  const options: RequestOptions = {
    method: 'POST',
    body,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Accept-Language': classification?.LanguageCode,
    },
  };
  const response = request(url, options);
  const newId = await response;
  return newId;
};

const update = (language: LanguageCode, onflyId: number, classification: IClassification) => {
  const url = `${API_URL}/api/v10/onfly/${onflyId}/classifications/${classification.Id}`;
  const options: RequestOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept-Language': language,
    },
    body: JSON.stringify(classification),
  };

  return request(url, options);
};

const remove = (
  onflyId: number,
  classification: IClassification,
  keepPropertiesWithValue: boolean
) => {
  const url = `${API_URL}/api/v10/onfly/${onflyId}/classifications/${classification.Id}?keepPropertiesWithValue=${keepPropertiesWithValue}`;
  const options: RequestOptions = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  return request(url, options);
};

const listNodes = (language: LanguageCode, onflyId: number, classificationId: number) => {
  const url = `${API_URL}/api/v10/onfly/${onflyId}/classifications/${classificationId}/nodes`;
  const options: RequestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept-Language': language,
    },
  };

  return request(url, options);
};

const addNode = async (
  language: LanguageCode,
  onflyId: number,
  classificationId: number,
  nodeId: number,
  node: IClassificationNode
) => {
  const url =
    nodeId === null
      ? `${API_URL}/api/v10/onfly/${onflyId}/classifications/${classificationId}/nodes/`
      : `${API_URL}/api/v10/onfly/${onflyId}/classifications/${classificationId}/nodes/${nodeId}/children`;
  const options: RequestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept-Language': language,
    },
    body: JSON.stringify([node]),
  };

  const response = await generateRequest(url, options);
  const responseParsed = await parseJSON(response);

  if (response?.status < 200 || response?.status >= 300) {
    throw responseParsed;
  }

  return responseParsed;
};

const moveNode = (
  onflyId: number,
  classificationId: number,
  target: IClassificationNode,
  node: IClassificationNode
) => {
  const url = `${API_URL}/api/v10/onfly/${onflyId}/classifications/${classificationId}/nodes/${node.Id}/parent`;
  const options: RequestOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ Id: target?.Id ?? null }),
  };

  return request(url, options);
};

const updateNode = async (
  language: LanguageCode,
  onflyId: number,
  classificationId: number,
  node: IClassificationNode
) => {
  const url = `${API_URL}/api/v10/onfly/${onflyId}/classifications/${classificationId}/nodes/${node.Id}`;
  const options: RequestOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept-Language': language,
    },
    body: JSON.stringify(node),
  };

  const response = await generateRequest(url, options);
  const responseParsed = await parseJSON(response);

  if (response?.status < 200 || response?.status >= 300) {
    throw responseParsed;
  }

  return responseParsed;
};

const deleteNode = (
  onflyId: number,
  classificationId: number,
  node: IClassificationNode,
  keepPropertiesWithValue: boolean
) => {
  const url = `${API_URL}/api/v10/onfly/${onflyId}/classifications/${classificationId}/nodes/${node.Id}?keepPropertiesWithValue=${keepPropertiesWithValue}`;
  const options: RequestOptions = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  return request(url, options);
};

const download = (languageCode: LanguageCode, onflyId: number, classification: IClassification) => {
  const url = `${API_URL}/api/v10/onfly/${onflyId}/classification/${classification?.Id}/export/excel`;

  const options: RequestOptions = {
    method: 'GET',
    headers: {
      'Accept-Language': languageCode,
    },
  };

  return requestExcel(url, options);
};

const upload = async (
  languageCode: LanguageCode,
  onflyId: number,
  classification: IClassification,
  file: File
) => {
  const url = `${API_URL}/api/v10/onfly/${onflyId}/classification/${classification?.Id}/import/excel`;

  const body = new FormData();
  body.append('file', file);

  const options: RequestOptions = {
    method: 'POST',
    headers: {
      'Accept-Language': languageCode,
    },
    body,
  };

  const response = await generateRequest(url, options);
  const responseParsed = await parseJSON(response);

  if (response?.status < 200 || response?.status >= 300) {
    throw responseParsed;
  }

  return responseParsed;
};

export default {
  get,
  list,
  create,
  update,
  remove,
  listNodes,
  addNode,
  updateNode,
  deleteNode,
  moveNode,
  download,
  upload,
};
