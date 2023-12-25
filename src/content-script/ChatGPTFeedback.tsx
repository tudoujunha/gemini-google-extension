import { CheckIcon, CopyIcon } from '@primer/octicons-react'
import { useEffect } from 'preact/hooks'
import { memo, useCallback, useState } from 'react'

interface Props {
  messageId: string
  conversationId: string
  answerText: string
}

function ChatGPTFeedback(props: Props) {
  const [copied, setCopied] = useState(false)

  const clickCopyToClipboard = useCallback(async () => {
    await navigator.clipboard.writeText(props.answerText)
    setCopied(true)
  }, [props.answerText])

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => {
        setCopied(false)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [copied])

  return (
    <div className="gpt-feedback">
      <span onClick={clickCopyToClipboard}>
        {copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
      </span>
    </div>
  )
}

export default memo(ChatGPTFeedback)
