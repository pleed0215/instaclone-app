import { QueryFetchMessage_fetchAndReadMessages } from "./../codegen/QueryFetchMessage";
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

const HTTP_ENDPOINT = `https://forkstar.herokuapp.com/graphql`;
const WS_ENDPOINT = `wss://forkstar.herokuapp.com/graphql`;
//const HTTP_ENDPOINT = `http://localhost:4000/graphql`;
//const WS_ENDPOINT = `ws://localhost:4000/graphql`;

const fetchAndReadMessagesPolicy: FieldPolicy = {
  keyArgs: ["roomId"],
  merge(
    existing: QueryFetchMessage_fetchAndReadMessages,
    incoming: QueryFetchMessage_fetchAndReadMessages,
    options
  ) {
    if (options.args?.input.cursorId === 0) {
      return incoming;
    } else {
      if (incoming.ok && incoming.messages) {
        if (existing && existing.messages) {
          return {
            ...incoming,
            messages: [...existing.messages, ...incoming.messages],
          };
        } else {
          // exisint empty... ex) first fetched data.
          return { ...incoming };
        }
      } else {
        return { ...existing };
      }
    }
  },
};

const seeFeedsFieldPolicy: FieldPolicy = {
  keyArgs: false,
  merge(
    existing: QuerySeeFeeds_seeFeeds,
    incoming: QuerySeeFeeds_seeFeeds,
    options
  ) {
    // 와.. 시파..
    if (incoming.ok && incoming.feeds) {
      if (existing && existing.feeds) {
        if (existing.currentPage === incoming.currentPage) {
          return {
            ...incoming,
          };
        } else if (existing.currentPage! > incoming.currentPage!) {
          return {
            ...existing,
          };
        } else {
          return {
            ...incoming,
            feeds: [...existing.feeds, ...incoming.feeds],
          };
        }
      } else {
        // exisint empty... ex) first fetched data.
        return { ...incoming };
      }
    } else {
      return { ...existing };
    }
  },
};

const seeLikeUsersFieldPolicy: FieldPolicy = {
  merge(
    existing: QuerySeeLikeUsers_seeLikeUsers,
    incoming: QuerySeeLikeUsers_seeLikeUsers,
    options
  ) {
    if (incoming.ok && incoming.likeUsers) {
      if (existing && existing.likeUsers) {
        if (existing.currentPage === incoming.currentPage) {
          return {
            ...incoming,
          };
        } else if (existing.currentPage! > incoming.currentPage!) {
          return {
            ...existing,
          };
        } else {
          return {
            ...incoming,
            likeUsers: [...existing.likeUsers, ...incoming.likeUsers],
          };
        }
      } else {
        // exisint empty... ex) first fetched data.
        return { ...incoming };
      }
    } else {
      return { ...existing };
    }
  },
};

export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        seeFeeds: seeFeedsFieldPolicy,
        seeLikeUsers: seeLikeUsersFieldPolicy,
        fetchAndReadMessages: fetchAndReadMessagesPolicy,
      },
    },
    User: {
      keyFields: (object) => `User:${object.username}`,
    },
    Message: {
      keyFields: ["id"],
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
    connectionParams: () => ({
      "x-jwt": authTokenVar() || "",
    }),
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
