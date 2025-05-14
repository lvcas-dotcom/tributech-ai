"use client"

import { useState, useEffect } from "react"
import Sidebar from "@/components/sidebar"
import ChatInterface from "@/components/chat-interface"
import PromptManager from "@/components/prompt-manager"
import DocumentManager from "@/components/document-manager"

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [showPromptManager, setShowPromptManager] = useState(false)
  const [showDocumentManager, setShowDocumentManager] = useState(false)
  const [savedPrompts, setSavedPrompts] = useState<string[]>([
    "Explique conceitos tributários de forma simples",
    "Analise esta nota fiscal e identifique possíveis irregularidades",
    "Resuma as principais mudanças na legislação tributária de 2024",
  ])
  const [uploadedDocuments, setUploadedDocuments] = useState<{ name: string; type: string; size: string }[]>([
    { name: "Nota Fiscal 2023.pdf", type: "pdf", size: "1.2 MB" },
    { name: "Relatório Anual.docx", type: "docx", size: "845 KB" },
  ])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false)
      } else {
        setIsSidebarOpen(true)
      }
    }

    // Check on initial load
    checkMobile()

    // Add event listener for window resize
    window.addEventListener("resize", checkMobile)

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const togglePromptManager = () => {
    setShowPromptManager(!showPromptManager)
    if (showDocumentManager) setShowDocumentManager(false)
  }

  const toggleDocumentManager = () => {
    setShowDocumentManager(!showDocumentManager)
    if (showPromptManager) setShowPromptManager(false)
  }

  const addPrompt = (prompt: string) => {
    setSavedPrompts([...savedPrompts, prompt])
  }

  const removePrompt = (index: number) => {
    const newPrompts = [...savedPrompts]
    newPrompts.splice(index, 1)
    setSavedPrompts(newPrompts)
  }

  const addDocument = (document: { name: string; type: string; size: string }) => {
    setUploadedDocuments([...uploadedDocuments, document])
  }

  const removeDocument = (index: number) => {
    const newDocuments = [...uploadedDocuments]
    newDocuments.splice(index, 1)
    setUploadedDocuments(newDocuments)
  }

  return (
    <main className="flex h-screen w-full overflow-hidden bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900">
      <div className="absolute inset-0 bg-[url('/grid.png')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>

      {/* Animated gradient background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="glowing-blob absolute top-[-300px] left-[-300px] w-[600px] h-[600px] rounded-full bg-purple-600/20 blur-3xl animate-blob"></div>
        <div className="glowing-blob absolute top-[-200px] right-[-300px] w-[500px] h-[500px] rounded-full bg-indigo-600/20 blur-3xl animate-blob animation-delay-2000"></div>
        <div className="glowing-blob absolute bottom-[-300px] left-[30%] w-[500px] h-[500px] rounded-full bg-pink-600/20 blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Main content */}
      <div className="relative flex w-full h-full">
        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} isMobile={isMobile} />

        {/* Chat area */}
        <ChatInterface
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          isMobile={isMobile}
          togglePromptManager={togglePromptManager}
          toggleDocumentManager={toggleDocumentManager}
          savedPrompts={savedPrompts}
        />

        {/* Prompt Manager */}
        {showPromptManager && (
          <PromptManager
            isOpen={showPromptManager}
            onClose={togglePromptManager}
            savedPrompts={savedPrompts}
            addPrompt={addPrompt}
            removePrompt={removePrompt}
          />
        )}

        {/* Document Manager */}
        {showDocumentManager && (
          <DocumentManager
            isOpen={showDocumentManager}
            onClose={toggleDocumentManager}
            uploadedDocuments={uploadedDocuments}
            addDocument={addDocument}
            removeDocument={removeDocument}
          />
        )}
      </div>
    </main>
  )
}
