import React from 'react';
import ReactDOM from 'react-dom/client';
// FIX: Correcting import path to be relative
import TaskTribeApp from './TaskTribeApp';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <TaskTribeApp />
  </React.StrictMode>
);