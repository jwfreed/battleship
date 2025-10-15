import React from 'react';
import { createRoot } from 'react-dom/client';
import Game from './Containers/Game/Game';
import './index.css';

const root = createRoot(document.getElementById('root'));
root.render(<Game />);
