import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';

import Header from './Header';
import Playlist from './Playlist';
import Discogs from './Discogs';
import Footer from './Footer';

ReactDOM.render(
  <React.StrictMode>
    <Header/>
    <Playlist />
    <Discogs />
    <Footer authorName="Author - Yagnesh Patel & Namita Bhoj"/>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
