import React, {useEffect, useState} from 'react';
import {getEmojiCategoriesFromEmojiContainer} from 'sendbird-uikit';

import ReactionsList from './ReactionsList';

function ChatItem({channel, message = {}, onUpdateMessage, onDeleteMessage, emojiContainer, userId = ""}) {
  const [showEmojisList, setShowEmojisList] = useState(false)
  const [emojis, setEmojis] = useState([])

  useEffect(() => {
    const monkeysEmojiContainer = getEmojiCategoriesFromEmojiContainer(emojiContainer).filter(_ => _.name === "Monkeys")[0]
    if (monkeysEmojiContainer) {
      const emojis = monkeysEmojiContainer.emojis
      setEmojis(emojis)
    }
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

  const EMAIL_PARSE_REGEX = /(?:(?:[^<>()\[\]\\.,;:+\s@"]+(?:\.[^<>()\[\]\\.,;:+\s@"]+)*)|(?:".+"))@(?:(?:\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(?:(?:[a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;
  const URL_PARSE_REGEX = /(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?/gi;

  const convertURLToLink = token => token.match(URL_PARSE_REGEX)
    ? <a href={token} target="_blank" rel="noreferrer">{token}</a>
    : token;

  const convertEmailToLink = token => token.match(EMAIL_PARSE_REGEX) ? <a href={`mailto:${token}`}>{token}</a> : token;

  const convertURLsAndEmailsToLinks = message => {
    if (!message) {
      return null;
    }
    return message.split(" ")
      .map(convertURLToLink)
      .map(token => typeof token !== 'string' ? token : token.split(" ").map(convertEmailToLink))
  }

  return (
    <div className="custom-message-item">
      <div
        className="message"
        style={{ justifyContent: message._sender?.userId === userId
          ? 'flex-end'
          : 'flex-start'}}
      >
        <p>
          {typeof message.message === 'string' ? convertURLsAndEmailsToLinks(message.message) : message.message}
        </p>
        {message._sender?.userId !== userId &&
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