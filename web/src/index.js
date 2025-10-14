import React from 'react';
import { createRoot } from 'react-dom/client';
import Game from './Containers/Game/Game';

const root = createRoot(document.getElementById('root'));
root.render(<Game />);