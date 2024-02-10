function createDOM(type, options, ...children) {
  const container = document.createElement(type);
  if (typeof options === 'string') {
    container.className = options;
  } else {
    const { className, innerHTML, ...restOpts } = options;
    container.className = className;
    container.innerHTML = innerHTML;

    Object.keys(restOpts).forEach((k) => {
      if (!k.startsWith('on')) {
        return;
      }

      const event = restOpts[k];
      const eventName = k.replace('on', '').toLowerCase();
      container.addEventListener(eventName, event);
    });
  }

  children.forEach((child) => container.appendChild(child));
  return container;
}

function text(textContent) {
  return document.createTextNode(textContent);
}

function div(options, ...children) {
  return createDOM('div', options, ...children);
}

function span(options, ...children) {
  return createDOM('span', options, ...children);
}

function input(options) {
  return createDOM('input', options);
}

module.exports = {
  text,
  div,
  span,
  input,
}
