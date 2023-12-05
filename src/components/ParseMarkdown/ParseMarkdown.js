import React from 'react';
import showdown from 'showdown';

const parse = new showdown.Converter();

export default function ParseMarkdown({ children }) {
  return (
    <span dangerouslySetInnerHTML={{ __html: parse.makeHtml(children) }} />
  );
}
