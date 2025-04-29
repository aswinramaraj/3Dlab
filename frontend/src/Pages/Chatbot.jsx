import React from 'react';

const Chatbot = () => {
  return (
    <div style={{ width: '100%', height: '100vh', overflow: 'hidden' }}>
      <iframe
        src="https://www.chatbase.co/chatbot-iframe/R3NWHQCi2kJLCeS2mntNJ"
        title="Personal AI Assistant"
        width="100%"
        style={{ height: '100%', minHeight: '700px', border: 'none' }}
        frameBorder="0"
        allow="clipboard-write"
      ></iframe>
    </div>
  );
};

export default Chatbot;