import { useState } from 'react';
import CodeEditor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';

import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-python';

import 'prismjs/themes/prism.css';

const SUPPORTED_LANGUAGES = {
  JAVASCRIPT: 'js',
  JAVA: 'java',
  PYTHON: 'python',
};

export const Editor = ({ code, setCode }) => {
  const hightlightWithLineNumbers = (input, language) =>
    highlight(input, language)
      .split('\n')
      .map(
        (line, i) => `<span class='editor_line_number'>${i + 1}</span>${line}`
      )
      .join('\n');

  return (
    <CodeEditor
      value={code}
      onValueChange={(code) => setCode(code)}
      highlight={(code) =>
        hightlightWithLineNumbers(
          code,
          languages[SUPPORTED_LANGUAGES.JAVASCRIPT]
        )
      }
      padding={10}
      textareaId="code-area"
      className={'editor'}
      textareaClassName={'editor_no_border'}
      style={{
        fontFamily: '"Fira code", "Fira Mono", monospace',
        fontSize: 14,
      }}
    />
  );
};
