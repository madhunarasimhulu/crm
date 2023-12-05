/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getNetworkAuthTTL = /* GraphQL */ `
  query GetNetworkAuthTTL($event_id: String!) {
    getNetworkAuthTTL(event_id: $event_id) {
      cid
      data
      domain
      event_id
      event_type
      org_id
      schema_version
      timestamp
    }
  }
`;
export const listNetworkAuthTTLS = /* GraphQL */ `
  query ListNetworkAuthTTLS(
    $filter: TableNetworkAuthTTLFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listNetworkAuthTTLS(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        cid
        data
        domain
        event_id
        event_type
        org_id
        schema_version
        timestamp
      }
      nextToken
    }
  }
`;
