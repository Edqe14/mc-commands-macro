import React, { MouseEventHandler } from 'react';
import { Button } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import { useStore } from '../hooks/useStore';
import { Command } from '../../src/types';
import hexToLum from '../lib/hexToLum';

export default ({ name, color, id }: Command) => {
  const store = useStore();

  const executeMacro = () => store.invokeCommand(id);
  const handleClick: MouseEventHandler<HTMLButtonElement> = (ev) => {
    if (ev.button === 1) {
      store.setSelectedCommandId(id);
      store.setShowModal(true);
    }
  };

  return (
    <Button
      onMouseDown={handleClick}
      onClick={executeMacro}
      variant="light"
      style={{
        outline: 'none',
        border: 'none',
        background: color,
        color: hexToLum(color) < 0.5 ? '#FEFEFE' : '#0E0E0E'
      }}
      className="macro"
    >
      <ReactMarkdown>{name}</ReactMarkdown>
    </Button>
  );
};