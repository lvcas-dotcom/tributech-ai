"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import { Send, Menu, Bot, User, FileText, Sparkles } from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface ChatInterfaceProps {
  isSidebarOpen: boolean
  toggleSidebar: () => void
  isMobile: boolean
  togglePromptManager: () => void
  toggleDocumentManager: () => void
  savedPrompts: string[]
}

export default function ChatInterface({
  isSidebarOpen,
  toggleSidebar,
  isMobile,
  togglePromptManager,
  toggleDocumentManager,
  savedPrompts,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Olá! Sou a Tributech.AI, sua assistente especializada em assuntos tributários e fiscais. Como posso ajudar você hoje?",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [showPromptSuggestions, setShowPromptSuggestions] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value)

    // Auto-resize textarea
    if (inputRef.current) {
      inputRef.current.style.height = "auto"
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Reset textarea height
    if (inputRef.current) {
      inputRef.current.style.height = "auto"
    }

    // Simulate AI response
    setTimeout(() => {
      const botResponses = [
        "Entendi sua dúvida sobre tributação. De acordo com a legislação atual, ",
        "Analisando sua questão fiscal, posso informar que ",
        "Sobre sua consulta tributária, é importante considerar que ",
        "Do ponto de vista contábil e fiscal, sua situação apresenta as seguintes características: ",
        "Com base na legislação tributária vigente, posso orientar que ",
      ]

      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)]

      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: `${randomResponse} ${inputValue.length > 20 ? "Sua consulta sobre '" + inputValue + "' envolve diversos aspectos da legislação tributária. Posso detalhar mais algum ponto específico?" : "Posso ajudar com mais informações sobre este assunto tributário?"}`,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsTyping(false)
    }, 1500)
  }

  const usePrompt = useCallback((prompt: string) => {
    setInputValue(prompt)
    setShowPromptSuggestions(false)

    // Focus and resize the textarea
    if (inputRef.current) {
      inputRef.current.focus()
      inputRef.current.style.height = "auto"
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`
    }
  }, [])

  return (
    <div
      className={`flex-1 flex flex-col transition-all duration-300 ${isMobile && isSidebarOpen ? "opacity-50" : ""}`}
    >
      {/* Chat header */}
      <div className="bg-gray-900/80 backdrop-blur-md border-b border-gray-800 p-4 flex items-center justify-between">
        {isMobile && (
          <button className="p-2 text-gray-400 hover:text-white" onClick={toggleSidebar}>
            <Menu size={20} />
          </button>
        )}

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
            <Sparkles size={16} className="text-white" />
          </div>
          <div>
            <h1 className="text-white font-medium">Tributech.AI</h1>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <span className="text-xs text-gray-400">Assistente Tributário</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={togglePromptManager}
            className="p-2 text-gray-400 hover:text-white rounded-md hover:bg-gray-800 transition-colors"
            title="Gerenciar prompts"
          >
            <Sparkles size={18} />
          </button>
          <button
            onClick={toggleDocumentManager}
            className="p-2 text-gray-400 hover:text-white rounded-md hover:bg-gray-800 transition-colors"
            title="Gerenciar documentos"
          >
            <FileText size={18} />
          </button>
        </div>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`flex gap-3 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : ""}`}>
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.role === "user" ? "bg-purple-600" : "bg-gray-700"
                }`}
              >
                {message.role === "user" ? (
                  <User size={16} className="text-white" />
                ) : (
                  <Bot size={16} className="text-purple-300" />
                )}
              </div>

              <div
                className={`rounded-2xl px-4 py-3 ${
                  message.role === "user"
                    ? "bg-purple-600 text-white rounded-tr-none"
                    : "bg-gray-800 text-gray-100 rounded-tl-none"
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                <div className="mt-1 text-xs opacity-70 text-right">
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="flex gap-3 max-w-[80%]">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                <Bot size={16} className="text-purple-300" />
              </div>

              <div className="rounded-2xl px-4 py-3 bg-gray-800 text-gray-100 rounded-tl-none">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"></div>
                  <div
                    className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="p-4 border-t border-gray-800 bg-gray-900/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Prompt suggestions */}
            {showPromptSuggestions && savedPrompts.length > 0 && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-gray-800 rounded-lg border border-gray-700 shadow-lg max-h-60 overflow-y-auto">
                <div className="p-2">
                  <h3 className="text-xs font-medium text-gray-400 mb-2 px-2">Prompts salvos</h3>
                  <div className="space-y-1">
                    {savedPrompts.map((prompt, index) => (
                      <button
                        key={index}
                        className="w-full text-left px-3 py-2 text-sm text-gray-200 hover:bg-gray-700 rounded-md transition-colors"
                        onClick={() => usePrompt(prompt)}
                      >
                        {prompt.length > 60 ? prompt.substring(0, 60) + "..." : prompt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="relative flex items-end bg-gray-800 rounded-lg border border-gray-700 focus-within:border-purple-500 transition-colors">
              <button
                onClick={() => setShowPromptSuggestions(!showPromptSuggestions)}
                className="p-3 text-gray-400 hover:text-purple-400"
                title="Ver prompts salvos"
              >
                <Sparkles size={18} />
              </button>
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Digite sua consulta tributária..."
                className="flex-1 bg-transparent border-0 text-white p-3 max-h-[120px] focus:outline-none resize-none"
                rows={1}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className={`p-3 rounded-r-lg ${
                  !inputValue.trim() || isTyping ? "text-gray-500" : "text-purple-400 hover:text-purple-300"
                }`}
              >
                <Send size={20} />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Tributech.AI - Assistente especializado em consultoria tributária e fiscal
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
