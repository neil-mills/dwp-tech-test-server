import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type Query {
    londonUsers: [User]!
  }

  type User {
    id: ID!
    first_name: String!
    last_name: String!
    email: String!
    ip_address: String!
    latitude: Float!
    longitude: Float!
    distance: Float!
    livesInLondon: Boolean!
  }
`;
