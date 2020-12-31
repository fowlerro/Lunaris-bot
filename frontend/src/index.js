import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter as Router} from 'react-router-dom';
import {ApolloClient, createHttpLink, InMemoryCache, ApolloProvider} from '@apollo/client';
import {ThemeSwitcherProvider} from 'react-css-theme-switcher';


//!!! ENV VARIABLES PUBLIC FOLDER
const themes = {
  dark: `/dark-theme.css`,
  light: `/light-theme.css`,
};

const link = createHttpLink({
  uri: 'http://localhost:3001/graphql',
  credentials: 'include',
});

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});


ReactDOM.render(
  <React.StrictMode>
    <Router>
      <ThemeSwitcherProvider themeMap={themes} defaultTheme="light">
        <ApolloProvider client={client}>
          <App />
        </ApolloProvider>
      </ThemeSwitcherProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
