import React from 'react';
import { AlertTemplateProps } from 'react-alert';
import { Alert } from 'react-bootstrap';

export default function AlertTemplate({
  message,
  options,
  style,
  close,
}: AlertTemplateProps) {
  return (
    <Alert style={style} variant={options.type?.replace(/error/gi, 'danger')} onClick={close}>
      {message}
    </Alert>
  );
}
