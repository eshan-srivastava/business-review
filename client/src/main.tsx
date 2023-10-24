import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ApolloClient, InMemoryCache, ApolloProvider, makeVar } from '@apollo/client'

export const starredVar = makeVar<string[]>([]);

const client = new ApolloClient({
  uri: "http://localhost:4000",
  cache: new InMemoryCache({
    typePolicies: {
      Business: {
        fields: {
          isStarred: {
            read(_, {readField}) {
              return starredVar().includes(readField("businessId")!);
            },
          },
        },
      },
    },
  }),
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
)
