import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom';
// BrowserRouterはreact-router-domを使いたいところ全てを囲う必要がある。
// 全て囲んでるから、今回はどこでも使用することができる。
import App from '../components/App'

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <BrowserRouter>
      <App/>
    </BrowserRouter>,
    document.querySelector('#root'),
  );
});