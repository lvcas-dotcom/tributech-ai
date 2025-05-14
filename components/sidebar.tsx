"use client"

import { useState } from "react"
import {
  User,
  Settings,
  LogOut,
  MessageSquare,
  Plus,
  ChevronLeft,
  ChevronRight,
  Trash,
  History,
  HelpCircle,
} from "lucide-react"

interface SidebarProps {
  isOpen: boolean
  toggleSidebar: () => void
  isMobile: boolean
}

export default function Sidebar({ isOpen, toggleSidebar, isMobile }: SidebarProps) {
  const [activeChat, setActiveChat] = useState<number | null>(0)

  const chatHistory = [
    { id: 0, title: "Consulta sobre ICMS" },
    { id: 1, title: "Dúvidas sobre Nota Fiscal" },
    { id: 2, title: "Planejamento tributário 2024" },
    { id: 3, title: "Análise de balanço fiscal" },
  ]

  return (
    <>
      {/* Overlay for mobile */}
      {isMobile && isOpen && <div className="fixed inset-0 bg-black/50 z-20" onClick={toggleSidebar}></div>}

      {/* Sidebar */}
      <div
        className={`fixed md:relative z-30 h-full flex flex-col bg-gray-900 border-r border-gray-800 transition-all duration-300 ${
          isOpen ? "w-64 translate-x-0" : "w-0 -translate-x-full md:translate-x-0 md:w-0"
        }`}
      >
        {isOpen && (
          <>
            {/* User profile section */}
            <div className="p-4 border-b border-gray-800">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                    MS
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-white font-medium truncate">Maria Silva</h2>
                  <p className="text-gray-400 text-sm truncate">maria.silva@empresa.com.br</p>
                </div>
              </div>
            </div>

            {/* New chat button */}
            <div className="p-3">
              <button className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md py-2 px-3 transition-colors">
                <Plus size={16} />
                <span>Nova conversa</span>
              </button>
            </div>

            {/* Chat history */}
            <div className="flex-1 overflow-y-auto p-2">
              <div className="mb-2 px-2 flex items-center justify-between">
                <h3 className="text-gray-400 text-xs font-medium uppercase">Minhas conversas</h3>
                <button className="text-gray-400 hover:text-white p-1 rounded">
                  <History size={14} />
                </button>
              </div>
              <div className="space-y-1">
                {chatHistory.map((chat) => (
                  <button
                    key={chat.id}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-left text-sm transition-colors ${
                      activeChat === chat.id ? "bg-purple-600/20 text-white" : "text-gray-300 hover:bg-gray-800"
                    }`}
                    onClick={() => setActiveChat(chat.id)}
                  >
                    <MessageSquare size={16} className={activeChat === chat.id ? "text-purple-400" : "text-gray-400"} />
                    <span className="truncate flex-1">{chat.title}</span>
                    {activeChat === chat.id && (
                      <button className="text-gray-400 hover:text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash size={14} />
                      </button>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation links */}
            <div className="p-3 border-t border-gray-800 space-y-1">
              <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-left text-sm text-gray-300 hover:bg-gray-800 transition-colors">
                <User size={16} className="text-gray-400" />
                <span>Perfil</span>
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-left text-sm text-gray-300 hover:bg-gray-800 transition-colors">
                <MessageSquare size={16} className="text-gray-400" />
                <span>Minhas conversas</span>
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-left text-sm text-gray-300 hover:bg-gray-800 transition-colors">
                <Settings size={16} className="text-gray-400" />
                <span>Configurações</span>
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-left text-sm text-gray-300 hover:bg-gray-800 transition-colors">
                <HelpCircle size={16} className="text-gray-400" />
                <span>Ajuda</span>
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-left text-sm text-red-400 hover:bg-gray-800 transition-colors">
                <LogOut size={16} className="text-red-400" />
                <span>Sair</span>
              </button>
            </div>
          </>
        )}
      </div>

      {/* Toggle button for mobile */}
      {isMobile && (
        <button
          className="fixed bottom-4 left-4 z-40 bg-gray-800 text-white p-2 rounded-full shadow-lg border border-gray-700"
          onClick={toggleSidebar}
        >
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      )}
    </>
  )
}
