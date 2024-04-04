import { LanguageCode } from '../../../Reducers/app/types';
import {
  IClassification,
  IClassificationNode,
  ITranlation,
  Status,
} from '../../../Reducers/classifications/types';

export const defaultClassification: IClassification = {
  Id: null as number,
  Name: '',
  Description: '',
  IsAutomaticTranslate: false,
  IsBimAndCo: false,
  IsPrivate: false,
  IsMandatory: false,
  Status: Status.Private,
  Statistics: null,
  CreatedAt: null as Date,
  UpdatedAt: null as Date,
  NameProperty: null,
  CodeProperty: null,
  Translations: [],
};

export const defaultNode: IClassificationNode = {
  Id: 0,
  Code: '',
  Name: '',
  Description: '',
  ParentId: 0,
  IfcExportAsId: null,
  IfcExportTypeId: null,
  CaoCategory: null,
  Children: [],
};

export const getDefaultTranslation = (languageCode: LanguageCode): ITranlation => ({
  Id: 0,
  Name: '',
  Description: '',
  LanguageCode: languageCode,
});
