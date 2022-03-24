import React, { FormEventHandler, useEffect, useState } from 'react';
import { InputGroup, FormControl, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../hooks/useStore';

export default () => {
  const store = useStore();
  const navigate = useNavigate();
  const [input, setInput] = useState('');

  useEffect(() => {
    if (store.token) navigate('/panel');
  }, [store.token]);

  const handleSubmit: FormEventHandler<HTMLFormElement> = (ev) => {
    ev.preventDefault();
    store.authenticate(input);
  };

  return (
    <main className="vh-100 d-flex justify-content-center align-items-center">
      <section className="col-6">
        <form onSubmit={handleSubmit}>
          <InputGroup>
            <FormControl
              type="password"
              placeholder="Token"
              value={input}
              onChange={(ev) => setInput(ev.target.value)}
              required
            />

            <Button type="submit" variant="primary">Connect</Button>
          </InputGroup>
        </form>
      </section>
    </main>
  );
};