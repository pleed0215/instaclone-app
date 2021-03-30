import {
  ApolloClient,
  createHttpLink,
  FieldPolicy,
  gql,
  InMemoryCache,
  split,
} from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";

import {
  getMainDefinition,
  isReference,
  offsetLimitPagination,
} from "@apollo/client/utilities";
import { authTokenVar } from "./vars";
import { QuerySeeFeeds_seeFeeds } from "../codegen/QuerySeeFeeds";
import {
  QuerySeeLikeUsers_seeLikeUsers,
  QuerySeeLikeUsers_seeLikeUsers_likeUsers,
} from "../codegen/QuerySeeLikeUsers";
import { createUploadLink } from "apollo-upload-client";
import {
  QuerySeeRoom,
  QuerySeeRoom_seeRoom,
  QuerySeeRoom_seeRoom_room,
} from "../codegen/QuerySeeRoom";

const HTTP_ENDPOINT = `https://giant-cat-16.loca.lt/graphql`;
const WS_ENDPOINT = `wss://giant-cat-16.loca.lt/graphql`;
//const HTTP_ENDPOINT = `http://localhost:4000/graphql`;
//const WS_ENDPOINT = `ws://localhost:4000/graphql`;

const seeRoomFieldPolicy: FieldPolicy = {
  keyArgs: false,
  merge(existing, incoming, options) {
    return incoming;
  },
};

const seeFeedsFieldPolicy: FieldPolicy = {
  keyArgs: false,
  merge(
    exisiting: QuerySeeFeeds_seeFeeds,
    incoming: QuerySeeFeeds_seeFeeds,
    options
  ) {
    // 와.. 시파..
    if (incoming.ok && incoming.feeds) {
      if (exisiting && exisiting.feeds) {
        if (exisiting.currentPage === incoming.currentPage) {
          return {
            ...incoming,
          };
        } else if (exisiting.currentPage! > incoming.currentPage!) {
          return {
            ...exisiting,
          };
        } else {
          return {
            ...incoming,
            feeds: [...exisiting.feeds, ...incoming.feeds],
          };
        }
      } else {
        // exisint empty... ex) first fetched data.
        return { ...incoming };
      }
    } else {
      return { ...exisiting };
    }
  },
};

const seeLikeUsersFieldPolicy: FieldPolicy = {
  merge(
    exisiting: QuerySeeLikeUsers_seeLikeUsers,
    incoming: QuerySeeLikeUsers_seeLikeUsers,
    options
  ) {
    if (incoming.ok && incoming.likeUsers) {
      if (exisiting && exisiting.likeUsers) {
        if (exisiting.currentPage === incoming.currentPage) {
          return {
            ...incoming,
          };
        } else if (exisiting.currentPage! > incoming.currentPage!) {
          return {
            ...exisiting,
          };
        } else {
          return {
            ...incoming,
            likeUsers: [...exisiting.likeUsers, ...incoming.likeUsers],
          };
        }
      } else {
        // exisint empty... ex) first fetched data.
        return { ...incoming };
      }
    } else {
      return { ...exisiting };
    }
  },
};

export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        seeFeeds: seeFeedsFieldPolicy,
        seeLikeUsers: seeLikeUsersFieldPolicy,
        seeRoom: {
          keyArgs: false,
          merge(existing, incoming) {
            return incoming;
          },
        },
      },
    },
    User: {
      keyFields: (object) => `User:${object.username}`,
    },

    Room: {
      merge(existing, incoming, { cache, readField }) {
        console.log(readField("messages", readField("room")));
        return incoming;
      },
    },
  },
});

const httpLink = createHttpLink({ uri: HTTP_ENDPOINT });
const onErrorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) console.log("GraphQL Error", graphQLErrors);
  if (networkError) console.log("Network Error", networkError);
});
const uploadLink = createUploadLink({ uri: HTTP_ENDPOINT });
const wsLink = new WebSocketLink({
  uri: WS_ENDPOINT,
  options: {
    reconnect: true,
    connectionParams: {
      "x-jwt": authTokenVar() || "",
    },
  },
});
const authLink = setContext((request, prevContext) => {
  return {
    headers: {
      ...prevContext.headers,
      "x-jwt": authTokenVar() || "",
    },
  };
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  authLink.concat(onErrorLink).concat(uploadLink)
);

export const apolloClient = new ApolloClient({
  link: splitLink,
  cache,
});
