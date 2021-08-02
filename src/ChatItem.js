import React, {useEffect, useState} from 'react';
import {getEmojiCategoriesFromEmojiContainer} from 'sendbird-uikit';

import ReactionsList from './ReactionsList';

function ChatItem({channel, message, onUpdateMessage, emojiContainer, userId}) {
  const [showEmojisList, setShowEmojisList] = useState(false)
  const [emojis, setEmojis] = useState([])

  useEffect(() => {
    const monkeysEmojiContainer = getEmojiCategoriesFromEmojiContainer(emojiContainer).filter(_ => _.name === "Monkeys")[0]
    const emojis = monkeysEmojiContainer.emojis
    setEmojis(emojis)
  }, [emojiContainer])

  const userReactionExists = emoji => message.reactions.find(
    reaction => (reaction.key === emoji.key) && reaction.userIds.find(_userId => _userId === userId)
  )

  const handleEmojiSelect = emoji => {
    if (userReactionExists(emoji)) {
      deleteReaction(emoji)
    } else {
      addReaction(emoji)
    }
    setShowEmojisList(false)
  }

  const addReaction = emoji => {
    channel.addReaction(message, emoji.key, function(reactionEvent, error) {
        if (error) {
            return console.error("🚀 channel.addReaction ~ error", error)
        }
        message.applyReactionEvent(reactionEvent);
    });
  }
  const deleteReaction = emoji => {
    channel.deleteReaction(message, emoji.key, function(reactionEvent, error) {
        if (error) {
          return console.error("🚀 channel.deleteReaction ~ error", error)
        }
        message.applyReactionEvent(reactionEvent);
    });
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
        <ReactionsList
          reactions={message.reactions}
          emojis={emojis}
          isOwnMessage={message?._sender?.userId === userId}
        />
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

export default ChatItem