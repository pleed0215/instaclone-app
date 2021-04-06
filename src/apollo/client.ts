import { QueryFetchMessage_fetchAndReadMessages } from "./../codegen/QueryFetchMessage";
import {
  ApolloClient,
  createHttpLink,
  FieldPolicy,
  InMemoryCache,
  split,
} from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";

import { getMainDefinition } from "@apollo/client/utilities";
import {
  authTokenVar,
  isLoggedInVar,
  removeTokenFromStorage,
  setTokenToStorage,
} from "./vars";

import { QuerySeeLikeUsers_seeLikeUsers } from "../codegen/QuerySeeLikeUsers";
import { createUploadLink } from "apollo-upload-client";
import { QuerySeeFeeds_seeFeeds } from "../codegen/QuerySeeFeeds";

const HTTP_ENDPOINT = `https://forkstar.herokuapp.com/graphql`;
const WS_ENDPOINT = `wss://forkstar.herokuapp.com/graphql`;
//const HTTP_ENDPOINT = `http://localhost:4000/graphql`;
//const WS_ENDPOINT = `ws://localhost:4000/graphql`;

export const makeLogin = async (token: string) => {
  await setTokenToStorage(token);
  isLoggedInVar(true);
  authTokenVar(token);
};
export const makeLogout = async () => {
  await removeTokenFromStorage();
  apolloClient.cache.reset();
  isLoggedInVar(false);
  authTokenVar(null);
};

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
  merge: (
    prev: QuerySeeFeeds_seeFeeds[],
    incoming: QuerySeeFeeds_seeFeeds[],
    { args }
  ) => {
    const safePrev = prev ? prev.slice(0) : [];
    const offset = args?.input ? args.input.offset : 0;
    for (let i = 0; i < incoming.length; ++i) {
      safePrev[offset + i] = incoming[i];
    }
    return safePrev;
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
