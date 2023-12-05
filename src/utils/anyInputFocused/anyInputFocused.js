const anyInputFocused = () =>
  /input|textarea/i.test(
    document.activeElement && document.activeElement.tagName,
  );

export default anyInputFocused;
