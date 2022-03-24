import React, { createRef, FormEventHandler, useEffect, useState } from 'react';
import { ListGroup, InputGroup, FormControl, Button } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import { useStore } from '../hooks/useStore';

export default () => {
  const store = useStore();
  const [message, setMessage] = useState('');
  const list = createRef<HTMLDivElement>();

  const handleSubmit: FormEventHandler<HTMLFormElement> = (ev) => {
    ev.preventDefault();
    if (!message || !store.socket) return;

    store.emit('message.send', { message });

    if (message.startsWith('/')) store.appendMessage(message);
    setMessage('');
  };

  useEffect(() => {
    if (list.current) list.current.scrollTo(0, list.current.scrollHeight);
  }, [store.messages, list]);

  return (
    <section className="chat rounded-2 border p-2 d-flex flex-column flex-grow-1">
      <section className="px-2 d-flex justify-content-between align-items-center">
        <h2 className="display-5">Chat</h2>

        <span className="clear text-danger pointer" onClick={() => store.clearMessages()}>Clear</span>
      </section>

      <ListGroup ref={list} className="flex-grow-1 mb-3 overflow-auto">
        {store.messages.map((msg, i) => (
          <ListGroup.Item as="li" active={msg.startsWith('/')} key={i}><ReactMarkdown>{msg}</ReactMarkdown></ListGroup.Item>
        ))}
      </ListGroup>

      <form onSubmit={handleSubmit}>
        <InputGroup>
          <FormControl
            type="text"
            placeholder="Message"
            value={message}
            onChange={(ev) => setMessage(ev.target.value)}
            required
          />

          <Button type="submit" variant="primary">Send</Button>
        </InputGroup>
      </form>
    </section>
  );
};