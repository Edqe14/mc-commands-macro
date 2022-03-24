import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { useStore } from '../hooks/useStore';

import Chat from '../components/Chat';
import Macro from '../components/Macro';
import MacroModal from '../components/MacroModal';

export default () => {
  const store = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!store.socket || !store.token) navigate('/');
  }, [store.token]);

  const openModal = () => {
    store.setSelectedCommandId(null);
    store.setShowModal(true);
  };

  return (
    <main className="panel container d-flex py-5">
      <MacroModal />

      <section className="chat col-4 d-flex flex-col me-5">
        <Chat />
      </section>

      <section className="d-flex flex-column flex-grow-1">
        <h1 className="display-4 mb-3">Macros</h1>

        <section className="d-grid macros gap-3 overflow-visible">
          {store.commands.sort((a, b) => a.name.localeCompare(b.name)).map((c, i) => (<Macro key={i} {...c} />))}
          <Button className="fs-2 outline-none" variant='info' onClick={openModal}>+</Button>
        </section>
      </section>
    </main>
  );
};