import { PersistenceAdapter } from 'ask-sdk-core';
import { DynamoDbPersistenceAdapter } from 'ask-sdk-dynamodb-persistence-adapter';

export const dynamoDbPersistenceAdapter : PersistenceAdapter = new DynamoDbPersistenceAdapter({
  tableName : 'KCRW_PLAY_STATE',
  createTable: true
});
