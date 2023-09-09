import { roomI } from '@/contexts/RoomsProvider'
import React, { useEffect, useRef, useState } from 'react'
interface Props {
  room: roomI
}
const RoomActions = ({ room }: Props) => {
  const [message, setMessage] = useState('');
  const messageBox = useRef<HTMLDivElement>(null);
  const selection = window.getSelection();
  const range = document.createRange();
  useEffect(() => {
    if (messageBox.current?.innerText !== message) {
      messageBox.current!.innerText = message
    }
  }, [message])
  return (
    <div
      className='w-full border-t border-t-palblack-800 py-4 px-4 flex max-h-fit'>
      <span contentEditable={true}
        ref={messageBox}
        role='textarea'
        className='w-full outline-none bg-palblack-800 rounded px-4 py-2 mr-4 resize-none h-auto'
        placeholder="Type message"
        onInput={(e) => {
          setMessage(e.currentTarget.innerText)
        }}
        onPaste={(e) => {
          e.preventDefault();
          const text = e.clipboardData.getData('text/plain');
          e.currentTarget.innerText += text;
          setMessage(e.currentTarget.innerText)
          selection?.removeAllRanges();
          range.selectNodeContents(e.currentTarget);
          range.collapse(false);
          selection?.addRange(range);
          e.currentTarget.focus();
        }
        }
        onKeyDown={(e) => {
          // Catch shift + enter
          if (e.key === 'Enter' /*&& e.getModifierState('Shift') === true*/) {
            e.preventDefault()
            e.stopPropagation();
            room.sendMessage(message)
            setMessage('')
          }
        }}
        suppressContentEditableWarning={true}
        id="messageBox"></span>
    </div >
  )
}

export default RoomActions