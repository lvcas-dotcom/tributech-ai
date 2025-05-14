"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { X, Plus, Trash, Save } from "lucide-react"

interface PromptManagerProps {
  isOpen: boolean
  onClose: () => void
  savedPrompts: string[]
  addPrompt: (prompt: string) => void
  removePrompt: (index: number) => void
}

export default function PromptManager({ isOpen, onClose, savedPrompts, addPrompt, removePrompt }: PromptManagerProps) {
  const [newPrompt, setNewPrompt] = useState("")
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [editValue, setEditValue] = useState("")
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    // Focus the input when the modal opens
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }

    // Handle click outside to close
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  const handleAddPrompt = () => {
    if (newPrompt.trim()) {
      addPrompt(newPrompt.trim())
      setNewPrompt("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.ctrlKey) {
      handleAddPrompt()
    }
  }

  const startEdit = (index: number) => {
    setEditIndex(index)
    setEditValue(savedPrompts[index])
  }

  const saveEdit = () => {
    if (editIndex !== null && editValue.trim()) {
      removePrompt(editIndex)
      addPrompt(editValue.trim())
      setEditIndex(null)
      setEditValue("")
    }
  }

  const cancelEdit = () => {
    setEditIndex(null)
    setEditValue("")
  }

  const confirmDelete = (index: number) => {
    setShowDeleteConfirm(index)
  }

  const handleDelete = (index: number) => {
    removePrompt(index)
    setShowDeleteConfirm(null)
  }

  const cancelDelete = () => {
    setShowDeleteConfirm(null)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        ref={modalRef}
        className="bg-gray-900 border border-gray-800 rounded-lg shadow-xl w-full max-w-md max-h-[80vh] flex flex-col overflow-hidden"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h2 className="text-lg font-medium text-white">Gerenciar Prompts</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 flex-1 overflow-y-auto">
          <div className="space-y-4">
            <div>
              <label htmlFor="new-prompt" className="block text-sm font-medium text-gray-300 mb-1">
                Adicionar novo prompt
              </label>
              <div className="flex items-start gap-2">
                <textarea
                  ref={inputRef}
                  id="new-prompt"
                  value={newPrompt}
                  onChange={(e) => setNewPrompt(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Digite um prompt para usar depois..."
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-md p-2 text-white text-sm focus:outline-none focus:border-purple-500 resize-none min-h-[80px]"
                />
                <button
                  onClick={handleAddPrompt}
                  disabled={!newPrompt.trim()}
                  className={`p-2 rounded-md ${
                    !newPrompt.trim() ? "bg-gray-700 text-gray-500" : "bg-purple-600 hover:bg-purple-700 text-white"
                  } transition-colors`}
                >
                  <Plus size={20} />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Pressione Ctrl+Enter para salvar</p>
            </div>

            {savedPrompts.length > 0 ? (
              <div>
                <h3 className="text-sm font-medium text-gray-300 mb-2">Prompts salvos</h3>
                <div className="space-y-2">
                  {savedPrompts.map((prompt, index) => (
                    <div key={index} className="relative bg-gray-800 rounded-md p-3 border border-gray-700">
                      {editIndex === index ? (
                        <div className="space-y-2">
                          <textarea
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white text-sm focus:outline-none focus:border-purple-500 resize-none min-h-[60px]"
                            autoFocus
                          />
                          <div className="flex justify-end gap-2">
                            <button onClick={cancelEdit} className="px-2 py-1 text-xs text-gray-300 hover:text-white">
                              Cancelar
                            </button>
                            <button
                              onClick={saveEdit}
                              disabled={!editValue.trim()}
                              className={`px-2 py-1 text-xs rounded ${
                                !editValue.trim()
                                  ? "bg-gray-700 text-gray-500"
                                  : "bg-purple-600 hover:bg-purple-700 text-white"
                              }`}
                            >
                              <Save size={12} className="inline mr-1" /> Salvar
                            </button>
                          </div>
                        </div>
                      ) : showDeleteConfirm === index ? (
                        <div className="space-y-2">
                          <p className="text-sm text-gray-300">Tem certeza que deseja excluir este prompt?</p>
                          <div className="flex justify-end gap-2">
                            <button onClick={cancelDelete} className="px-2 py-1 text-xs text-gray-300 hover:text-white">
                              Cancelar
                            </button>
                            <button
                              onClick={() => handleDelete(index)}
                              className="px-2 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded"
                            >
                              Confirmar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="text-sm text-gray-200 pr-16">{prompt}</p>
                          <div className="absolute top-2 right-2 flex gap-1">
                            <button
                              onClick={() => startEdit(index)}
                              className="p-1 text-gray-400 hover:text-white rounded-md hover:bg-gray-700"
                              title="Editar"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                              </svg>
                            </button>
                            <button
                              onClick={() => confirmDelete(index)}
                              className="p-1 text-gray-400 hover:text-red-400 rounded-md hover:bg-gray-700"
                              title="Excluir"
                            >
                              <Trash size={16} />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-400">Nenhum prompt salvo ainda</p>
                <p className="text-sm text-gray-500 mt-1">Adicione prompts para agilizar suas consultas</p>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-gray-800 bg-gray-900/80">
          <p className="text-xs text-gray-500 text-center">
            Os prompts salvos podem ser acessados diretamente na área de chat
          </p>
        </div>
      </div>
    </div>
  )
}
