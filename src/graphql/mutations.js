/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const addNote = /* GraphQL */ `
  mutation AddNote(
    $account_id: String!
    $customer_id: String!
    $note: AWSJSON!
  ) {
    addNote(account_id: $account_id, customer_id: $customer_id, note: $note) {
      account_id
      created_at
      customer_id
      id
      note
      updated_at
    }
  }
`;
