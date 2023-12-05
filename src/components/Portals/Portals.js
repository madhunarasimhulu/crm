import { useEffect, useState } from 'react';

import ReactDOM from 'react-dom';

const appRoot = document.getElementById('root');

const Portals = ({ children, className = 'root-portal', el = 'div' }) => {
  const [container] = useState(() => document.createElement(el));

  useEffect(() => {
    container.classList.add(className);
    appRoot && appRoot.appendChild(container);
    return () => {
      appRoot && appRoot.removeChild(container);
    };
  }, [className, container]);

  return ReactDOM.createPortal(children, container);
};

export { Portals };
