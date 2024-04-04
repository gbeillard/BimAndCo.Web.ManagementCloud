import { Property } from '../../../Reducers/dictionary/types';

export type SchemaTable = {
  Columns: Property[];
  Rows: ObjectValue[][];
};

export type ObjectValue = {
  Guid: string;
  Value: string;
};
