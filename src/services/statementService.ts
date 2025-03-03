import api from './api';
import { Statement, StatementFilter } from '../types/statement.types';
import { mockGenerateStatement } from '../mock/mockData';

export const generateStatement = async (
  userId: string,
  filter: StatementFilter
): Promise<Statement> => {
  return mockGenerateStatement(userId, filter);
};