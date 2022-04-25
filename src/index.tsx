import * as React from 'react';
import {createRoot, Root} from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');
if (container) {
  const root: Root = createRoot(container);
  root.render(
      <React.StrictMode>
        <App/>
      </React.StrictMode>,
  );
}
