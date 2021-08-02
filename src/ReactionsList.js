import React from 'react'

const ReactionsList = ({reactions, emojis, isOwnMessage}) => {
  const getEmojiFromReaction = reaction => emojis.find(emoji => emoji.key === reaction.key);

  if (!reactions.length) {
    return null
  }

  return (
    <div  className="reactions-list-container">
      <ul className="reactions-list" style={isOwnMessage ? {marginLeft: 'auto'} : null}>
        {reactions.map(reaction => {
          const emoji = getEmojiFromReaction(reaction)
          return emoji ? (
            <li key={reaction.key}>
              <img width={20} height={20} alt={reaction.key} src={emoji.url} />
              <ul hidden className="reaction-users-list">
                {reaction.userIds.map((userId, i) => (
                  <li key={userId}>{userId}{i !== (reaction.userIds.length - 1) ? ', ' : ''}</li>
                ))}
              </ul>
              <span className="count">{reaction.userIds.length}</span>
            </li>
          ) : null
        })}
      </ul>
    </div>
  )
}

export default ReactionsList
