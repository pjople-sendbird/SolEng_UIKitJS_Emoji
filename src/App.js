
import React, {useState} from 'react';
import {
  Channel,
  ChannelList,
  withSendBird
} from 'sendbird-uikit';

import './App.css';
import ChatItem from './ChatItem';

function App({config}) {
  const [currentChannelUrl, setCurrentChannelUrl] = useState('')
  return (
    <div className="App">
      <ChannelList onChannelSelect={channel => setCurrentChannelUrl(channel?.url)} />
      <div className="channel-wrapper">
        <Channel
          channelUrl={currentChannelUrl}
          renderChatItem={({channel, message, onDeleteMessage, onUpdateMessage, emojiContainer}) =>
          <ChatItem
            message={message}
            channel={channel}
            emojiContainer={emojiContainer}
            onDeleteMessage={onDeleteMessage}
            onUpdateMessage={onUpdateMessage}
            userId={config.userId}
          />}
      />
      </div>
    </div>
  );
}

export default withSendBird(App);
