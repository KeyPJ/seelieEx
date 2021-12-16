import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

let seelieEx = document.createElement('div');
seelieEx.id = 'seelieEx'
seelieEx.className = 'flex'
document.getElementById('app')?.append(seelieEx);

ReactDOM.render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>,
    document.getElementById('seelieEx')
);
