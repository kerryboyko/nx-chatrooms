import React, { useState } from 'react';
import { ChatMessage } from '@chatrooms/api-interfaces';

const socket = new WebSocket(`ws://localhost:3333`);
socket.onmessage = (data: any) => {
  console.log(data);
};

const ChatRoom: React.FC<unknown> = () => {
  const [textField, setTextField] = useState<string>('');
  const handleTextField: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    setTextField(event.target.value);
  };
  const handleSubmit = () => {
    if (textField.length) {
      console.log(textField);
      socket.send(JSON.stringify({ message: textField }));
      setTextField('');
    }
  };

  return (
    <div>
      {textField}

      <input onChange={handleTextField} value={textField} />
      <button onClick={handleSubmit}>Post</button>
    </div>
  );
};

export default ChatRoom;
