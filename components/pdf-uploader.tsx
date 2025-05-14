"use client"

import type React from "react"
import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileUp, FileText, Trash2, AlertCircle, CheckCircle2, Upload, Eye, Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { motion, AnimatePresence } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { useMobile } from "@/hooks/use-mobile"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

type PdfFile = {
  id: string
  name: string
  size: string
  date: Date
  content?: string
}

type UploadingFile = {
  id: string
  name: string
  progress: number
  status: "uploading" | "success" | "error"
  error?: string
  file: File
}

type PdfUploaderProps = {
  onUpload: (filename: string) => void
  onRemove: (filename: string) => void
  uploadedFiles: string[]
}

// Simulated PDF content for demo purposes
const simulatedPdfContent = `
LEGISLAÇÃO TRIBUTÁRIA BRASILEIRA

1. INTRODUÇÃO
Este documento apresenta uma visão geral sobre a legislação tributária brasileira, 
abordando os principais impostos e contribuições em vigor no país.

2. IMPOSTOS FEDERAIS
2.1. Imposto de Renda Pessoa Física (IRPF)
O Imposto de Renda Pessoa Física é um tributo federal que incide sobre a renda 
e proventos de contribuintes residentes no país ou que recebam rendimentos de 
fontes brasileiras. A declaração anual deve ser entregue geralmente entre março 
e abril do ano seguinte ao ano-calendário.

2.2. Imposto de Renda Pessoa Jurídica (IRPJ)
O IRPJ é um tributo federal que incide sobre o lucro das empresas. Pode ser 
calculado com base no Lucro Real, Lucro Presumido ou Lucro Arbitrado, 
dependendo do regime tributário adotado pela empresa.

3. IMPOSTOS ESTADUAIS
3.1. Imposto sobre Circulação de Mercadorias e Serviços (ICMS)
O ICMS é um imposto estadual que incide sobre operações relativas à circulação 
de mercadorias e sobre prestações de serviços de transporte interestadual e 
intermunicipal e de comunicação.

4. IMPOSTOS MUNICIPAIS
4.1. Imposto Sobre Serviços (ISS)
O ISS é um tributo municipal que incide sobre a prestação de serviços por 
empresas ou profissionais autônomos.
`

export default function PdfUploader({ onUpload, onRemove, uploadedFiles: initialUploadedFiles }: PdfUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([])
  const [uploadedFiles, setUploadedFiles] = useState<PdfFile[]>(
    initialUploadedFiles.map((name) => ({
      id: Math.random().toString(36).substring(2, 9),
      name,
      size: "1.2 MB", // Simulated size
      date: new Date(),
    })),
  )
  const [previewFile, setPreviewFile] = useState<PdfFile | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const isMobile = useMobile()

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      handleFiles(files)
      // Reset the input value so the same file can be uploaded again
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const handleFiles = (files: File[]) => {
    const pdfFiles = files.filter((file) => file.type === "application/pdf" || file.name.endsWith(".pdf"))

    if (pdfFiles.length === 0) {
      toast({
        title: "Tipo de arquivo inválido",
        description: "Por favor, envie apenas arquivos PDF.",
        variant: "destructive",
      })
      return
    }

    // Add files to uploading state
    const newUploadingFiles = pdfFiles.map((file) => ({
      id: Math.random().toString(36).substring(2, 9),
      name: file.name,
      progress: 0,
      status: "uploading" as const,
      file,
    }))

    setUploadingFiles((prev) => [...prev, ...newUploadingFiles])

    // Process each file
    newUploadingFiles.forEach((uploadingFile) => {
      processFile(uploadingFile)
    })
  }

  const processFile = async (uploadingFile: UploadingFile) => {
    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadingFiles((prev) => {
          const fileIndex = prev.findIndex((f) => f.id === uploadingFile.id)
          if (fileIndex === -1) return prev

          const file = prev[fileIndex]
          if (file.progress >= 90) {
            clearInterval(progressInterval)
            return prev
          }

          const updatedFiles = [...prev]
          updatedFiles[fileIndex] = {
            ...file,
            progress: Math.min(file.progress + Math.random() * 10, 90),
          }
          return updatedFiles
        })
      }, 200)

      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 1500 + Math.random() * 1000))

      // Complete the upload
      clearInterval(progressInterval)
      setUploadingFiles((prev) => {
        const updatedFiles = [...prev]
        const fileIndex = updatedFiles.findIndex((f) => f.id === uploadingFile.id)
        if (fileIndex !== -1) {
          updatedFiles[fileIndex] = {
            ...updatedFiles[fileIndex],
            progress: 100,
            status: "success",
          }
        }
        return updatedFiles
      })

      // Add to uploaded files
      const newFile: PdfFile = {
        id: uploadingFile.id,
        name: uploadingFile.file.name,
        size: formatFileSize(uploadingFile.file.size),
        date: new Date(),
        content: simulatedPdfContent, // In a real app, this would be the actual content
      }

      setUploadedFiles((prev) => [...prev, newFile])

      // Notify parent component
      onUpload(uploadingFile.file.name)

      // Show success toast
      toast({
        title: "PDF Enviado com Sucesso",
        description: `${uploadingFile.file.name} foi adicionado à sua base de conhecimento.`,
      })

      // Remove from uploading list after a delay
      setTimeout(() => {
        setUploadingFiles((prev) => prev.filter((f) => f.id !== uploadingFile.id))
      }, 2000)
    } catch (error) {
      console.error("Error processing file:", error)

      // Update status to error
      setUploadingFiles((prev) => {
        const updatedFiles = [...prev]
        const fileIndex = updatedFiles.findIndex((f) => f.id === uploadingFile.id)
        if (fileIndex !== -1) {
          updatedFiles[fileIndex] = {
            ...updatedFiles[fileIndex],
            progress: 100,
            status: "error",
            error: "Falha ao processar o arquivo. Tente novamente.",
          }
        }
        return updatedFiles
      })

      // Show error toast
      toast({
        title: "Erro ao Processar PDF",
        description: "Ocorreu um erro ao processar o arquivo. Tente novamente.",
        variant: "destructive",
      })

      // Remove from uploading list after a delay
      setTimeout(() => {
        setUploadingFiles((prev) => prev.filter((f) => f.id !== uploadingFile.id))
      }, 4000)
    }
  }

  const confirmDelete = (id: string) => {
    setDeleteConfirmId(id)
  }

  const cancelDelete = () => {
    setDeleteConfirmId(null)
  }

  const removeFile = useCallback(
    (id: string) => {
      const fileToRemove = uploadedFiles.find((file) => file.id === id)
      if (!fileToRemove) return

      // Remove file from state
      setUploadedFiles((prev) => prev.filter((file) => file.id !== id))

      // Notify parent component
      onRemove(fileToRemove.name)

      // Close delete confirmation
      setDeleteConfirmId(null)

      // Show success toast
      toast({
        title: "Arquivo Removido",
        description: `${fileToRemove.name} foi removido da sua base de conhecimento.`,
      })
    },
    [uploadedFiles, toast, onRemove],
  )

  const previewPdf = (file: PdfFile) => {
    // If content doesn't exist yet, simulate fetching it
    if (!file.content) {
      const updatedFile = { ...file, content: simulatedPdfContent }
      setPreviewFile(updatedFile)

      // Update the file in the state to include content
      setUploadedFiles((prev) => prev.map((f) => (f.id === file.id ? updatedFile : f)))
    } else {
      setPreviewFile(file)
    }
  }

  const closePreview = () => {
    setPreviewFile(null)
  }

  const downloadPdf = (file: PdfFile) => {
    // In a real app, this would download the actual file
    // For demo purposes, we'll create a text file with the simulated content
    const blob = new Blob([file.content || simulatedPdfContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = file.name.replace(".pdf", ".txt")
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Download Iniciado",
      description: `${file.name} está sendo baixado.`,
    })
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800 border-gray-700 text-gray-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-purple-400" />
            Base de Conhecimento Tributech.AI
          </CardTitle>
          <CardDescription className="text-gray-400">
            Envie documentos PDF para treinar seu chatbot com conhecimento personalizado.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
              isDragging
                ? "border-purple-500 bg-purple-900/20"
                : "border-gray-600 hover:border-purple-500/50 hover:bg-gray-700/30"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center justify-center">
              <div className="relative mb-4">
                <div className="absolute inset-0 bg-purple-600/20 rounded-full blur-md"></div>
                <div className="relative bg-gray-800 rounded-full p-4 border border-purple-500/30">
                  <Upload className="h-8 w-8 text-purple-400" />
                </div>
              </div>
              <h3 className="text-sm font-semibold text-gray-200">Arraste e solte seus arquivos PDF</h3>
              <p className="mt-1 text-xs text-gray-400">Ou clique para navegar em seus arquivos</p>
              <input
                type="file"
                accept=".pdf"
                multiple
                className="hidden"
                id="pdf-upload"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              <Button
                variant="outline"
                className="mt-4 border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-purple-500/70 transition-all"
                onClick={() => fileInputRef.current?.click()}
              >
                <FileUp className="mr-2 h-4 w-4" /> Selecionar Arquivos
              </Button>
            </div>
          </div>

          {/* Uploading files */}
          <AnimatePresence>
            {uploadingFiles.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 space-y-3 overflow-hidden"
              >
                <h4 className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <Badge variant="outline" className="bg-purple-900/30 text-purple-300 border-purple-700">
                    {uploadingFiles.length}
                  </Badge>
                  Enviando arquivos
                </h4>
                {uploadingFiles.map((file) => (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-gray-700/50 rounded-md p-3"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-purple-400" />
                        <span className="text-sm font-medium text-gray-200 truncate max-w-[200px]">{file.name}</span>
                      </div>
                      {file.status === "uploading" && (
                        <span className="text-xs text-gray-400">{Math.round(file.progress)}%</span>
                      )}
                      {file.status === "success" && <CheckCircle2 size={16} className="text-green-400" />}
                      {file.status === "error" && <AlertCircle size={16} className="text-red-400" />}
                    </div>
                    <Progress
                      value={file.progress}
                      className="h-1 bg-gray-600"
                      indicatorClassName={
                        file.status === "success"
                          ? "bg-green-500"
                          : file.status === "error"
                            ? "bg-red-500"
                            : "bg-purple-500"
                      }
                    />
                    {file.error && <p className="text-xs text-red-400 mt-1">{file.error}</p>}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {uploadedFiles.length > 0 ? (
        <Card className="bg-gray-800 border-gray-700 text-gray-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-400" />
              Documentos Enviados
            </CardTitle>
            <CardDescription className="text-gray-400">
              Estes documentos são usados para treinar seu chatbot.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px] pr-4">
              <ul className="space-y-2">
                {uploadedFiles.map((file, index) => (
                  <motion.li
                    key={file.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-3 bg-gray-700/50 rounded-md group hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex-1 flex items-center gap-2 min-w-0">
                      <FileText size={18} className="text-purple-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium text-gray-200 truncate block">{file.name}</span>
                        <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                          <span>{file.size}</span>
                          <span>•</span>
                          <span>{file.date.toLocaleDateString("pt-BR")}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                      {isMobile ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-gray-400 hover:text-purple-400 h-8 w-8 p-0"
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
                                <circle cx="12" cy="12" r="1" />
                                <circle cx="12" cy="5" r="1" />
                                <circle cx="12" cy="19" r="1" />
                              </svg>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-gray-800 border-gray-700 text-gray-200" align="end">
                            <DropdownMenuItem
                              className="flex items-center cursor-pointer hover:bg-gray-700"
                              onClick={() => previewPdf(file)}
                            >
                              <Eye className="mr-2 h-4 w-4" /> Visualizar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="flex items-center cursor-pointer hover:bg-gray-700"
                              onClick={() => downloadPdf(file)}
                            >
                              <Download className="mr-2 h-4 w-4" /> Baixar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="flex items-center cursor-pointer text-red-400 hover:bg-gray-700 hover:text-red-300"
                              onClick={() => confirmDelete(file.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Remover
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => previewPdf(file)}
                            className="text-gray-400 hover:text-purple-400 h-8 w-8 p-0"
                            title="Visualizar"
                          >
                            <Eye size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => downloadPdf(file)}
                            className="text-gray-400 hover:text-blue-400 h-8 w-8 p-0"
                            title="Baixar"
                          >
                            <Download size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => confirmDelete(file.id)}
                            className="text-gray-400 hover:text-red-400 h-8 w-8 p-0"
                            title="Remover"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </>
                      )}
                    </div>

                    {/* Delete confirmation */}
                    {deleteConfirmId === file.id && (
                      <div className="absolute right-0 top-0 bottom-0 left-0 bg-gray-800/95 rounded-md flex items-center justify-center p-3 z-10">
                        <div className="bg-gray-700 p-3 rounded-md border border-red-800/50 max-w-xs">
                          <h4 className="text-sm font-medium text-gray-200 mb-2">Confirmar exclusão</h4>
                          <p className="text-xs text-gray-300 mb-3">
                            Tem certeza que deseja remover <span className="font-medium text-white">{file.name}</span>?
                            Esta ação não pode ser desfeita.
                          </p>
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={cancelDelete}
                              className="h-8 text-xs border-gray-600 text-gray-300 hover:bg-gray-700"
                            >
                              Cancelar
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => removeFile(file.id)}
                              className="h-8 text-xs"
                            >
                              Excluir
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.li>
                ))}
              </ul>
            </ScrollArea>
          </CardContent>
        </Card>
      ) : (
        <Alert className="bg-gray-800/50 border-gray-700 text-gray-300">
          <AlertCircle className="h-4 w-4 text-purple-400" />
          <AlertTitle>Nenhum documento enviado</AlertTitle>
          <AlertDescription>
            Envie documentos PDF para melhorar as respostas do seu assistente com conhecimento personalizado.
          </AlertDescription>
        </Alert>
      )}

      {/* PDF Preview Dialog */}
      <Dialog open={previewFile !== null} onOpenChange={(open) => !open && closePreview()}>
        <DialogContent className="bg-gray-800 border-gray-700 text-gray-100 max-w-4xl h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-400" />
              {previewFile?.name}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Visualização do conteúdo extraído do documento
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full w-full pr-4">
              <div className="p-4 bg-gray-900 rounded-md border border-gray-700 whitespace-pre-wrap">
                {previewFile?.content || "Nenhum conteúdo extraído."}
              </div>
            </ScrollArea>
          </div>

          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => downloadPdf(previewFile!)}
              className="border-gray-600 text-gray-300 hover:bg-gray-700 mr-auto"
            >
              <Download className="mr-2 h-4 w-4" /> Baixar
            </Button>
            <Button
              variant="outline"
              onClick={closePreview}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
