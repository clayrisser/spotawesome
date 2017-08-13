import rootStyle from '../styles/root.scss?root=./src/styles/';

let remove = {};

export function loadStyles(insertCss) {
  remove.rootStyle = insertCss(rootStyle);
}

export function unmountStyles() {
  remove.rootStyle();
}
