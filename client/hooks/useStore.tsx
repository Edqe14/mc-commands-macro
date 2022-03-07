/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { createContext, useContext, useState } from 'react';
import createSocket, { Socket } from 'socket.io-client';
import { useAlert } from 'react-alert';
import { useNavigate, useLocation } from 'react-router-dom';
import { nanoid } from 'nanoid';
import { Command } from '../../src/types';
import { Dispatcher } from '../types';

const context = createContext({});

export default context;

export interface Props {
  url?: string;
  [key: string]: any;
}

interface StoreValues {
  token: string | null;
  socket: Socket | null;
  messages: string[];
  commands: Command[];
  selectedCommandId: string | null;
  setSelectedCommandId: Dispatcher<string | null>;
  showModal: boolean;
  setShowModal: Dispatcher<boolean>;
  emit: (name: string, data?: any) => string | null;
  authenticate: (password: string) => void;
  appendMessage: (message: string | string[]) => void;
  getCommand: (id: string) => Command | null;
  invokeCommand: (id: string) => any;
  createConnection: (password: string) => void;
}

export const Provider = ({ url, ...props }: Props) => {
  const alert = useAlert();
  const navigate = useNavigate();
  const location = useLocation();

  const [socket, setSocket] = useState<Socket | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [commands, setCommands] = useState<Command[]>([]);
  const [selectedCommandId, setSelectedCommandId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  const value: StoreValues = {
    messages,
    commands,
    socket,
    token,
    selectedCommandId,
    setSelectedCommandId,
    showModal,
    setShowModal,
    emit(name, data) {
      if (!socket || !token) return null;

      const pid = nanoid(5);

      socket.emit(name, { ...data, token, pid });

      return pid;
    },
    authenticate(password) {
      if (!password) return;
      if (!socket) return this.createConnection(password);

      socket.emit('auth', { token: password });
    },
    appendMessage(message) {
      const wrap = Array.isArray(message) ? message : [message];
      setMessages((last) => [...last, ...wrap]);
    },
    getCommand(id) {
      const index = commands.findIndex((command) => command.id === id);
      if (index === -1) return null;

      return commands[index];
    },
    invokeCommand(id) {
      if (!socket) return;

      const command = this.getCommand(id);
      if (!command) return;

      this.emit('commands.invoke', { id: command.id });
      this.appendMessage(command.commands.map((c) => `> ${c}`));
    },
    createConnection(password) {
      // eslint-disable-next-line no-restricted-globals
      const io = createSocket(url ?? window.location.href);

      setSocket(io);

      io.on('connect', () => {
        // Core
        io.on('message', ({ name, message }) => this.appendMessage(`[${name}] ${message}`));
        io.on('commands.set', (cmds: Command[]) => setCommands(cmds));
        io.on('commands.append', (command: Command) => setCommands((cmds) => [...cmds, command]));
        io.on('commands.remove', ({ id, message }) => {
          alert.success(message);
          setCommands((cmds) => {
            const arr = [...cmds];
            const index = arr.findIndex((c) => c.id === id);
            // eslint-disable-next-line no-param-reassign
            if (index > -1) arr.splice(index, 1);

            return arr;
          });
        });

        io.on('commands.edit', (command: Command) => setCommands((cmds) => {
          const arr = [...cmds];
          const index = arr.findIndex((c) => c.id === command.id);
          // eslint-disable-next-line no-param-reassign
          if (index > -1) arr.splice(index, 1, command);

          return arr;
        }));

        io.on('success', ({ message }) => alert.success(message));
        io.on('error', ({ message }) => alert.error(message));

        // Authentication
        io.on('auth.error', ({ message }) => {
          alert.error(message);

          if (location.pathname.includes('panel')) return navigate('/');
        });
        io.once('auth.success', ({ token: tkn }) => {
          console.info(`got token: ${tkn}`);

          setToken(tkn);
          navigate('/panel');
        });

        // Destructive events
        io.once('auth.timeout', () => {
          alert.error('Authentication timeout');

          io.removeAllListeners();
          setSocket(null);
        });

        io.once('disconnect', (reason) => {
          alert.error(reason);

          if (reason.includes('close')) return navigate('/');

          io.removeAllListeners();
          setSocket(null);
        });

        io.emit('auth', { token: password });
      });
    }
  };

  return <context.Provider {...props} value={value} />;
};

export const useStore = () => useContext(context) as StoreValues;