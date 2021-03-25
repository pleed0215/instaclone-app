import {
  ApolloClient,
  createHttpLink,
  FieldPolicy,
  InMemoryCache,
  split,
} from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { setContext } from "@apollo/client/link/context";

import { getMainDefinition } from "@apollo/client/utilities";
import { authTokenVar } from "./vars";
import { QuerySeeFeeds_seeFeeds } from "../codegen/QuerySeeFeeds";
import { QuerySeeLikeUsers_seeLikeUsers } from "../codegen/QuerySeeLikeUsers";

const HTTP_ENDPOINT = `https://b302a7eb1b29.ngrok.io/graphql`;
const WS_ENDPOINT = `wss://b302a7eb1b29.ngrok.io/graphql`;
//const HTTP_ENDPOINT = `http://localhost:4000/graphql`;
//const WS_ENDPOINT = `ws://localhost:4000/graphql`;

const seeFeedsFieldPolicy: FieldPolicy = {
  keyArgs: false,
  merge(exisiting: QuerySeeFeeds_seeFeeds, incoming: QuerySeeFeeds_seeFeeds) {
    // 와.. 시파..
    if (incoming.ok && incoming.feeds) {
      if (exisiting) {
        if (exisiting.currentPage! < incoming.currentPage!) {
          const realPage =
            incoming.currentPage! > incoming.totalPage!
              ? incoming.totalPage
              : incoming.currentPage;
          return exisiting.feeds
            ? {
                ...exisiting,
                currentPage: realPage,
                feeds: [...exisiting.feeds, ...incoming.feeds],
              }
            : {
                ...exisiting,
                currentPage: realPage,
                feeds: [...incoming.feeds],
              };
        } else {
          return exisiting;
        }
      } else {
        return incoming;
      }
    } else {
      return exisiting;
    }
  },
};

const seeLikeUsersFieldPolicy: FieldPolicy = {
  keyArgs: false,
  merge(
    exisiting: QuerySeeLikeUsers_seeLikeUsers,
    incoming: QuerySeeLikeUsers_seeLikeUsers
  ) {
    if (incoming.ok && incoming.likeUsers) {
      if (exisiting) {
        if (exisiting.currentPage! < incoming.currentPage!) {
          const realPage =
            incoming.currentPage! > incoming.totalPage!
              ? incoming.totalPage
              : incoming.currentPage;
          return exisiting.likeUsers
            ? {
                ...exisiting,
                currentPage: realPage,
                likeUsers: [...exisiting.likeUsers, ...incoming.likeUsers],
              }
            : {
                ...exisiting,
                currentPage: realPage,
                likeUsers: [...incoming.likeUsers],
              };
        } else {
          return exisiting;
        }
      } else {
        return incoming;
      }
    } else {
      return exisiting;
    }
  },
};

export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        seeFeeds: seeFeedsFieldPolicy,
        seeLikeUsers: seeLikeUsersFieldPolicy,
      },
    },
    User: {
      keyFields: (object) => `User: ${object.username}`,
    },
  },
});

const httpLink = createHttpLink({ uri: HTTP_ENDPOINT });
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
  authLink.concat(httpLink)
);

export const apolloClient = new ApolloClient({
  link: splitLink,
  cache,
});
