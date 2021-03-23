import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  split,
} from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { setContext } from "@apollo/client/link/context";

import { getMainDefinition } from "@apollo/client/utilities";
import { authTokenVar } from "./vars";

const HTTP_ENDPOINT = `https://e2b8bf6da616.ngrok.io/graphql`;
const WS_ENDPOINT = `wss://e2b8bf6da616.ngrok.io/graphql`;
//const HTTP_ENDPOINT = `http://localhost:4000/graphql`;
//const WS_ENDPOINT = `ws://localhost:4000/graphql`;

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
  cache: new InMemoryCache({
    typePolicies: {
      User: {
        keyFields: (object) => `User: ${object.username}`,
      },
    },
  }),
});
