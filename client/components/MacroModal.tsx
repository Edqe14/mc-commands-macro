import React, { FormEventHandler, useEffect, useState } from 'react';

import { Button, Modal, Form } from 'react-bootstrap';
import { useStore } from '../hooks/useStore';
import { Command } from '../../src/types';
import { Nullable } from '../types';

const EMPTY_COMMAND = {
  id: '',
  name: '',
  commands: [],
  color: '#0E0E0E'
};

export default () => {
  const { showModal, setShowModal, selectedCommandId, getCommand, emit } = useStore();
  const [command, setCommand] = useState<Command>(EMPTY_COMMAND);

  useEffect(() => {
    if (selectedCommandId) {
      const cmd = getCommand(selectedCommandId);
      if (cmd) setCommand(cmd);
    } else {
      setCommand(EMPTY_COMMAND);
    }
  }, [selectedCommandId]);

  const close = () => {
    setShowModal(false);
  };

  const deleteHandler = () => {
    emit('commands.delete', { id: selectedCommandId });
    close();
  };

  const save: FormEventHandler<HTMLFormElement> = (ev) => {
    ev.preventDefault();

    const data: Nullable<Command> = {
      ...command,
      commands: command.commands.filter(Boolean),
      id: selectedCommandId
    };

    emit('commands.set', data);
    close();
  };

  return (
    <Modal show={showModal} onHide={close}>
      <Modal.Header closeButton>
        <Modal.Title>{!selectedCommandId ? 'Create' : 'Modify'} macro</Modal.Title>
      </Modal.Header>

      <Form onSubmit={save}>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Name</Form.Label>
            <Form.Control
              required
              type="text"
              value={command.name}
              onChange={(ev) => setCommand({ ...command, name: ev.target.value })}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label>Commands</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              value={command.commands.join('\n')}
              onChange={(ev) => setCommand({ ...command, commands: ev.target.value.split('\n') })}
            />
            <Form.Text muted>
              Commands must starts with "/". Create a new line for multiple commands.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label>Color</Form.Label>
            <Form.Control
              className="w-100"
              as="input"
              type="color"
              value={command.color}
              onChange={(ev) => setCommand({ ...command, color: ev.target.value })}
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          {selectedCommandId&& (
            <Button variant="danger" type="button" onClick={deleteHandler}>Delete</Button>
          )}
          <Button variant="secondary" type="button" onClick={close}>
            Close
          </Button>
          <Button variant="primary" type="submit">
            Save
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};