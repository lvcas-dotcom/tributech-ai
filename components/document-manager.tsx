"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { X, Upload, File, FileText, FileIcon as FilePdf, FileImage, Trash, Download, Eye } from "lucide-react"

interface DocumentManagerProps {
  isOpen: boolean
  onClose: () => void
  uploadedDocuments: { name: string; type: string; size: string }[]
  addDocument: (document: { name: string; type: string; size: string }) => void
  removeDocument: (index: number) => void
}

export default function DocumentManager({
  isOpen,
  onClose,
  uploadedDocuments,
  addDocument,
  removeDocument,
}: DocumentManagerProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null)
  const [showPreview, setShowPreview] = useState<number | null>(null)
  const [uploadProgress, setUploadProgress] = useState<{ name: string; progress: number }[]>([])

  const modalRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
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
  }, [onClose])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files)
      handleFiles(files)
    }
  }

  const handleFiles = (files: File[]) => {
    // Simulate file upload with progress
    files.forEach((file) => {
      const newUpload = {
        name: file.name,
        progress: 0,
      }

      setUploadProgress((prev) => [...prev, newUpload])

      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          const updatedProgress = prev.map((item) => {
            if (item.name === file.name) {
              return { ...item, progress: Math.min(item.progress + 10, 100) }
            }
            return item
          })
          return updatedProgress
        })
      }, 300)

      // Simulate upload completion
      setTimeout(() => {
        clearInterval(interval)
        setUploadProgress((prev) => prev.filter((item) => item.name !== file.name))

        // Add document to the list
        const fileType = file.name.split(".").pop() || "unknown"
        const fileSize = formatFileSize(file.size)

        addDocument({
          name: file.name,
          type: fileType,
          size: fileSize,
        })
      }, 3000)
    })
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "pdf":
        return <FilePdf size={20} className="text-red-400" />
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return <FileImage size={20} className="text-blue-400" />
      case "doc":
      case "docx":
        return <FileText size={20} className="text-blue-500" />
      case "xls":
      case "xlsx":
        return <FileText size={20} className="text-green-500" />
      default:
        return <File size={20} className="text-gray-400" />
    }
  }

  const confirmDelete = (index: number) => {
    setShowDeleteConfirm(index)
  }

  const handleDelete = (index: number) => {
    removeDocument(index)
    setShowDeleteConfirm(null)
  }

  const cancelDelete = () => {
    setShowDeleteConfirm(null)
  }

  const previewDocument = (index: number) => {
    setShowPreview(index)
  }

  const closePreview = () => {
    setShowPreview(null)
  }

  const downloadDocument = (document: { name: string; type: string; size: string }) => {
    // In a real app, this would download the actual file
    // For this demo, we'll just show an alert
    alert(`Baixando ${document.name}`)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        ref={modalRef}
        className="bg-gray-900 border border-gray-800 rounded-lg shadow-xl w-full max-w-md max-h-[80vh] flex flex-col overflow-hidden"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h2 className="text-lg font-medium text-white">Gerenciar Documentos</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 flex-1 overflow-y-auto">
          <div className="space-y-4">
            {/* Upload area */}
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                isDragging ? "border-purple-500 bg-purple-500/10" : "border-gray-700 hover:border-purple-500/50"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input type="file" ref={fileInputRef} onChange={handleFileInput} className="hidden" multiple />
              <Upload size={32} className="mx-auto text-gray-500 mb-2" />
              <h3 className="text-sm font-medium text-gray-300">Arraste e solte arquivos aqui</h3>
              <p className="text-xs text-gray-500 mt-1 mb-3">ou</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-md transition-colors"
              >
                Selecionar arquivos
              </button>
              <p className="text-xs text-gray-500 mt-3">Suporta PDF, Word, Excel, imagens e outros formatos</p>
            </div>

            {/* Upload progress */}
            {uploadProgress.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-300">Enviando...</h3>
                {uploadProgress.map((item, index) => (
                  <div key={index} className="bg-gray-800 rounded-md p-3 border border-gray-700">
                    <div className="flex items-center gap-2 mb-2">
                      <File size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-300 truncate">{item.name}</span>
                      <span className="text-xs text-gray-500 ml-auto">{item.progress}%</span>
                    </div>
                    <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-600 rounded-full" style={{ width: `${item.progress}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Uploaded documents */}
            {uploadedDocuments.length > 0 ? (
              <div>
                <h3 className="text-sm font-medium text-gray-300 mb-2">Documentos enviados</h3>
                <div className="space-y-2">
                  {uploadedDocuments.map((doc, index) => (
                    <div key={index} className="relative bg-gray-800 rounded-md p-3 border border-gray-700">
                      {showDeleteConfirm === index ? (
                        <div className="space-y-2">
                          <p className="text-sm text-gray-300">Tem certeza que deseja excluir este documento?</p>
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
                          <div className="flex items-center gap-3">
                            {getFileIcon(doc.type)}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-200 truncate">{doc.name}</p>
                              <p className="text-xs text-gray-500">{doc.size}</p>
                            </div>
                            <div className="flex gap-1">
                              <button
                                onClick={() => previewDocument(index)}
                                className="p-1 text-gray-400 hover:text-white rounded-md hover:bg-gray-700"
                                title="Visualizar"
                              >
                                <Eye size={16} />
                              </button>
                              <button
                                onClick={() => downloadDocument(doc)}
                                className="p-1 text-gray-400 hover:text-blue-400 rounded-md hover:bg-gray-700"
                                title="Baixar"
                              >
                                <Download size={16} />
                              </button>
                              <button
                                onClick={() => confirmDelete(index)}
                                className="p-1 text-gray-400 hover:text-red-400 rounded-md hover:bg-gray-700"
                                title="Excluir"
                              >
                                <Trash size={16} />
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-400">Nenhum documento enviado ainda</p>
                <p className="text-sm text-gray-500 mt-1">Adicione documentos para consulta tributária</p>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-gray-800 bg-gray-900/80">
          <p className="text-xs text-gray-500 text-center">
            Os documentos enviados serão utilizados para análise tributária
          </p>
        </div>
      </div>

      {/* Document Preview Modal */}
      {showPreview !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={closePreview}>
          <div
            className="bg-gray-900 border border-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <h2 className="text-lg font-medium text-white truncate">{uploadedDocuments[showPreview].name}</h2>
              <button onClick={closePreview} className="text-gray-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-4 flex-1 overflow-y-auto bg-gray-800">
              <div className="flex flex-col items-center justify-center min-h-[300px]">
                {/* This would be a real document preview in a production app */}
                <div className="text-center">
                  {getFileIcon(uploadedDocuments[showPreview].type)}
                  <p className="mt-4 text-gray-300">Visualização do documento</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Em uma aplicação real, o conteúdo do documento seria exibido aqui
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-800 flex justify-end">
              <button
                onClick={() => downloadDocument(uploadedDocuments[showPreview])}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-md transition-colors flex items-center gap-2"
              >
                <Download size={16} />
                Baixar documento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
