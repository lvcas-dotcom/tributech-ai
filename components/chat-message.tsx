"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bot, User, Copy, Check } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"

type MessageProps = {
  message: {
    id: string
    role: "user" | "assistant" | "system"
    content: string
    timestamp?: Date
  }
}

export default function ChatMessage({ message }: MessageProps) {
  const isUser = message.role === "user"
  const formattedTime = message.timestamp ? format(message.timestamp, "HH:mm", { locale: ptBR }) : ""
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content)
    setCopied(true)
    toast({
      title: "Copiado!",
      description: "Texto copiado para a área de transferência.",
    })
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("group flex items-start gap-3 transition-opacity", isUser ? "justify-end" : "")}
    >
      {!isUser && (
        <Avatar className="h-9 w-9 border-2 border-purple-700 bg-purple-950 shadow-md">
          <AvatarFallback className="text-purple-300 bg-purple-950">
            <Bot size={18} />
          </AvatarFallback>
        </Avatar>
      )}

      <div className="flex flex-col max-w-[85%]">
        <div
          className={cn(
            "rounded-2xl p-3 shadow-md relative group",
            isUser
              ? "bg-gradient-to-br from-purple-700 to-purple-900 text-white rounded-tr-none"
              : "bg-gray-800 text-gray-100 rounded-tl-none border border-gray-700",
          )}
        >
          <p className="whitespace-pre-wrap break-words">{message.content}</p>

          {!isUser && message.content.length > 10 && (
            <Button
              size="icon"
              variant="ghost"
              onClick={copyToClipboard}
              className="absolute -right-2 -top-2 h-7 w-7 rounded-full bg-gray-700 text-gray-300 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-gray-600"
            >
              {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
            </Button>
          )}
        </div>

        {message.timestamp && (
          <span className="text-xs text-gray-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {formattedTime}
          </span>
        )}
      </div>

      {isUser && (
        <Avatar className="h-9 w-9 border-2 border-purple-600 bg-gray-800 shadow-md">
          <AvatarFallback className="text-gray-300 bg-gray-800">
            <User size={18} />
          </AvatarFallback>
        </Avatar>
      )}
    </motion.div>
  )
}
