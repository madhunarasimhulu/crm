import React from 'react';
import Loadable from 'react-loadable';

const defaults = {
  errorComponent: <div>Error</div>,
  loaderComponent: <div>...</div>,
  loaderDisplayDelay: 300, // intervalo ate exibir o loader
  autoPreloadDelay: 1000, // intervalo para iniciar o preload
  autoPreload: false, // habilita o preload do componente
};

function build(customConfig) {
  const config = { ...defaults, ...customConfig };

  return function importAsync(
    importFn,
    autoPreload = config.autoPreload,
    loader,
  ) {
    const loading = (props) => {
      if (props.error) {
        return config.errorComponent;
      }
      if (props.pastDelay) {
        if (loader) return loader;
        return config.loaderComponent;
      }
      return null;
    };

    const module = Loadable({
      loader: importFn,
      loading,
      delay: config.loaderDisplayDelay,
    });

    if (autoPreload) {
      setTimeout(() => module.preload(), config.autoPreloadDelay);
    }

    return module;
  };
}

export { build };
export default build(); // configuracao padrao
