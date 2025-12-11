import React from 'react';
import ReactDOM from 'react-dom/client';
import { EmotionalSpineChartFromCsv } from '../src/EmotionalSpineChart';
import dataUrl from '../src/data/frankenstein.csv?url';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <EmotionalSpineChartFromCsv src={dataUrl} width={960} height={1200} />
  </React.StrictMode>
);
