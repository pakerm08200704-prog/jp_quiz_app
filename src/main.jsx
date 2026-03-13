import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

const rootElement = document.getElementById('root');

if (!rootElement) {
  document.body.innerHTML = '<h1 style="color:red">錯誤：找不到 index.html 中的 #root 元素</h1>';
} else {
  const root = createRoot(rootElement);
  
  try {
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error("React 渲染崩潰:", error);
    rootElement.innerHTML = `<div style="padding:20px; color:red">
      <h2>React 啟動失敗</h2>
      <pre>${error.message}</pre>
    </div>`;
  }
}