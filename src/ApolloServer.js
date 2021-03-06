import React from 'react';
import App from './App';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";


const httpLink = createHttpLink({
  uri: `https://merngbackend.herokuapp.com/`
})


const authLink = setContext(() => {
  const token = localStorage.getItem('jwtToken');
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : ''
    }
  }
});

  const cache = new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          getAllPosts: {
            merge(existing, incoming) {
              return incoming;
            }
        },
      },
    },
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: cache
})


export default (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
)
