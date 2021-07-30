
import React, {useState} from 'react';
import {
  Channel,
  ChannelList,
  getEmojisFromEmojiContainer,
  getEmojiCategoriesFromEmojiContainer,
  withSendBird
 } from 'sendbird-uikit';
import './App.css';

function ChatItem({message, onUpdateMessage, emojiContainer, userId}) {
  const [showEmojisList, setShowEmojisList] = useState(false)
  const monkeysEmojiContainer = getEmojiCategoriesFromEmojiContainer(emojiContainer).filter(_ => _.name === "Monkeys")[0]
  const emojis = monkeysEmojiContainer.emojis

  // if (message.isAdminMessage || message.isFileMessage) {
  //   return null
  // }

  const handleEmojiSelect = (emoji) => {
    console.log("🚀 ~ file: App.js ~ line 22 ~ handleEmojiSelect ~ emoji", emoji)
    // TODO
    setShowEmojisList(false)
  }

  return (
    <div className="custom-message-item">
      <div
        className="message"
        style={{ justifyContent: message?._sender?.userId === userId
          ? 'flex-end'
          : 'flex-start'}}
      >
        <p>{message.message}</p>
        {message?._sender?.userId !== userId &&
          <button onClick={() => setShowEmojisList(!showEmojisList)}>
            <span role="img" alt="Show monkey reactions">🐵</span>
          </button>
        }
      </div>
      <ul className="emojis-list" hidden={!showEmojisList}>
        {emojis && emojis.map(emoji =>
          <li key={emoji.key}>
            <button onClick={handleEmojiSelect.bind(this, emoji)}>
              <img src={emoji.url} alt={"Monkey emoji"} />
            </button>
          </li>
        )}
      </ul>
    </div>
    )
  }

function App({config}) {
  const [currentChannelUrl, setCurrentChannelUrl] = useState('')
  return (
    <div className="App">
      <ChannelList onChannelSelect={channel => setCurrentChannelUrl(channel.url)} />
      <Channel
        channelUrl={currentChannelUrl}
        renderChatItem={({message, onDeleteMessage, onUpdateMessage, emojiContainer}) =>
          <ChatItem
            message={message}
            emojiContainer={emojiContainer}
            onDeleteMessage={onDeleteMessage}
            onUpdateMessage={onUpdateMessage}
            userId={config.userId}
          />}
      />
    </div>
  );
}

export default withSendBird(App);
