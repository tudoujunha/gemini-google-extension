import { useState } from 'react'
import { TriggerMode } from '../config'
import ChatGPTCard from './ChatGPTCard'
import { QueryStatus } from './ChatGPTQuery'

interface Props {
  question: string
  triggerMode: TriggerMode
}

function ChatGPTContainer(props: Props) {
  const [queryStatus, setQueryStatus] = useState<QueryStatus>()

  return (
    <>
      <div className="chat-gpt-card">
        <ChatGPTCard
          question={props.question}
          triggerMode={props.triggerMode}
          onStatusChange={setQueryStatus}
        />
      </div>
    </>
  )
}

export default ChatGPTContainer
