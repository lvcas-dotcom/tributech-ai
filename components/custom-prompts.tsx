"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Trash2, Plus, Edit, Save, X, Sparkles, AlertCircle, Copy } from "lucide-react"
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
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { useMobile } from "@/hooks/use-mobile"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

type CustomPromptsProps = {
  onAddPrompt: (prompt: string) => void
  onRemovePrompt: (index: number) => void
  savedPrompts: string[]
}

type Prompt = {
  id: string
  text: string
  date: Date
  category?: string
}

const examplePrompts = [
  {
    text: "Sempre responda em um tom profissional e formal, adequado para comunicações empresariais.",
    category: "Estilo",
  },
  {
    text: "Ao explicar conceitos tributários, inclua referências à legislação brasileira atual quando relevante.",
    category: "Conteúdo",
  },
  {
    text: "Quando mencionar valores monetários, use o formato brasileiro (R$ 1.000,00) e explique os cálculos detalhadamente.",
    category: "Formato",
  },
  {
    text: "Se não tiver certeza sobre alguma informação específica da legislação tributária, deixe claro que a consulta a um contador ou advogado tributário é recomendada.",
    category: "Disclaimer",
  },
  {
    text: "Ao responder perguntas sobre impostos, sempre mencione a data de referência da informação, pois a legislação tributária pode mudar.",
    category: "Atualização",
  },
]

export default function CustomPrompts({
  onAddPrompt,
  onRemovePrompt,
  savedPrompts: initialSavedPrompts,
}: CustomPromptsProps) {
  const [newPrompt, setNewPrompt] = useState("")
  const [promptCategory, setPromptCategory] = useState("")
  const [savedPrompts, setSavedPrompts] = useState<Prompt[]>(
    initialSavedPrompts.map((text, index) => ({
      id: `prompt-${index}`,
      text,
      date: new Date(),
      category: ["Estilo", "Conteúdo", "Formato", "Disclaimer", "Atualização"][Math.floor(Math.random() * 5)],
    })),
  )
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editedPrompt, setEditedPrompt] = useState("")
  const [editedCategory, setEditedCategory] = useState("")
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showExamplesDialog, setShowExamplesDialog] = useState(false)
  const { toast } = useToast()
  const isMobile = useMobile()
  const copyToastRef = useRef<any>(null)

  const handleAddPrompt = useCallback(async () => {
    if (!newPrompt.trim()) return

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800))

      const newPromptObj: Prompt = {
        id: `prompt-${Date.now()}`,
        text: newPrompt.trim(),
        date: new Date(),
        category: promptCategory.trim() || undefined,
      }

      setSavedPrompts((prev) => [...prev, newPromptObj])
      onAddPrompt(newPrompt.trim())
      setNewPrompt("")
      setPromptCategory("")

      toast({
        title: "Prompt Adicionado",
        description: "Seu prompt personalizado foi salvo com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao adicionar o prompt. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }, [newPrompt, promptCategory, onAddPrompt, toast])

  const startEditing = (id: string, prompt: Prompt) => {
    setEditingId(id)
    setEditedPrompt(prompt.text)
    setEditedCategory(prompt.category || "")
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditedPrompt("")
    setEditedCategory("")
  }

  const saveEdit = async (id: string) => {
    if (!editedPrompt.trim()) return

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      setSavedPrompts((prev) =>
        prev.map((prompt) =>
          prompt.id === id
            ? {
                ...prompt,
                text: editedPrompt.trim(),
                category: editedCategory.trim() || undefined,
                date: new Date(),
              }
            : prompt,
        ),
      )

      setEditingId(null)
      setEditedPrompt("")
      setEditedCategory("")

      toast({
        title: "Prompt Atualizado",
        description: "Seu prompt personalizado foi atualizado com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar o prompt. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  const confirmDelete = (id: string) => {
    setDeleteConfirmId(id)
  }

  const cancelDelete = () => {
    setDeleteConfirmId(null)
  }

  const deletePrompt = async (id: string) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Find the index of the prompt to be removed
      const promptIndex = savedPrompts.findIndex((p) => p.id === id)

      if (promptIndex !== -1) {
        // Remove from parent component state
        onRemovePrompt(promptIndex)

        // Remove from local state
        setSavedPrompts((prev) => prev.filter((prompt) => prompt.id !== id))
      }

      setDeleteConfirmId(null)

      toast({
        title: "Prompt Removido",
        description: "Seu prompt personalizado foi removido com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao remover o prompt. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  const useExamplePrompt = useCallback(
    (example: { text: string; category?: string }) => {
      setNewPrompt(example.text)
      if (example.category) {
        setPromptCategory(example.category)
      }
      setShowExamplesDialog(false)
    },
    [setNewPrompt, setPromptCategory],
  )

  const copyPrompt = useCallback(
    (text: string) => {
      navigator.clipboard.writeText(text)
      if (copyToastRef.current) {
        copyToastRef.current({
          title: "Prompt Copiado",
          description: "O prompt foi copiado para a área de transferência.",
        })
      }
    },
    [toast],
  )

  // Auto-resize textarea
  useEffect(() => {
    const textarea = document.getElementById("new-prompt") as HTMLTextAreaElement
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`
    }
  }, [newPrompt])

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800 border-gray-700 text-gray-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-400" />
            Prompts de Treinamento Personalizados
          </CardTitle>
          <CardDescription className="text-gray-400">
            Adicione prompts personalizados para ajustar o comportamento e as respostas da Tributech.AI.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-prompt" className="text-gray-300 mb-1 block">
                Novo Prompt de Treinamento
              </Label>
              <Textarea
                id="new-prompt"
                placeholder="Ex.: Sempre responda em um tom profissional e evite usar gírias."
                value={newPrompt}
                onChange={(e) => setNewPrompt(e.target.value)}
                className="mt-1 bg-gray-700 border-gray-600 text-gray-100 min-h-[100px] resize-none"
              />

              <div className="flex flex-col sm:flex-row gap-2 mt-2">
                <div className="flex-1">
                  <Label htmlFor="prompt-category" className="text-gray-300 text-xs mb-1 block">
                    Categoria (opcional)
                  </Label>
                  <Input
                    id="prompt-category"
                    placeholder="Ex.: Estilo, Conteúdo, Formato"
                    value={promptCategory}
                    onChange={(e) => setPromptCategory(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-gray-100 h-9 text-sm"
                  />
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="text-gray-400 border-gray-600 hover:bg-gray-700 h-9 mt-auto"
                  onClick={() => setShowExamplesDialog(true)}
                >
                  <Sparkles size={14} className="mr-1 text-purple-400" /> Ver exemplos
                </Button>
              </div>

              <div className="text-xs text-gray-500 text-right mt-1">{newPrompt.length} caracteres</div>
            </div>

            <Button
              onClick={handleAddPrompt}
              disabled={!newPrompt.trim() || isSubmitting}
              className="bg-purple-700 hover:bg-purple-800 transition-colors w-full relative"
            >
              {isSubmitting ? (
                <>
                  <span className="opacity-0">
                    <Plus size={16} className="mr-2" /> Adicionar Prompt
                  </span>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                </>
              ) : (
                <>
                  <Plus size={16} className="mr-2" /> Adicionar Prompt
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {savedPrompts.length > 0 ? (
        <Card className="bg-gray-800 border-gray-700 text-gray-100">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Badge variant="outline" className="bg-purple-900/30 text-purple-300 border-purple-700">
                  {savedPrompts.length}
                </Badge>
                Prompts Salvos
              </CardTitle>
            </div>
            <CardDescription className="text-gray-400">
              Estes prompts são usados para personalizar o comportamento do seu chatbot.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] pr-4">
              <ul className="space-y-3">
                <AnimatePresence>
                  {savedPrompts.map((prompt, index) => (
                    <motion.li
                      key={prompt.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                      transition={{ duration: 0.2 }}
                      className="relative p-3 bg-gray-700/50 rounded-md group hover:bg-gray-700 transition-colors"
                    >
                      {editingId === prompt.id ? (
                        <div className="space-y-2">
                          <Textarea
                            value={editedPrompt}
                            onChange={(e) => setEditedPrompt(e.target.value)}
                            className="w-full bg-gray-700 border-gray-600 text-gray-100 resize-none"
                            autoFocus
                          />

                          <div className="flex flex-col sm:flex-row gap-2">
                            <div className="flex-1">
                              <Label htmlFor="edit-category" className="text-gray-300 text-xs mb-1 block">
                                Categoria (opcional)
                              </Label>
                              <Input
                                id="edit-category"
                                placeholder="Ex.: Estilo, Conteúdo, Formato"
                                value={editedCategory}
                                onChange={(e) => setEditedCategory(e.target.value)}
                                className="bg-gray-700 border-gray-600 text-gray-100 h-9 text-sm"
                              />
                            </div>
                          </div>

                          <div className="flex gap-2 justify-end mt-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={cancelEditing}
                              className="border-gray-600 text-gray-300 hover:bg-gray-700"
                            >
                              <X size={14} className="mr-1" /> Cancelar
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => saveEdit(prompt.id)}
                              className="bg-purple-700 hover:bg-purple-800"
                            >
                              <Save size={14} className="mr-1" /> Salvar
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start justify-between">
                          <div className="flex-1 pr-2">
                            {prompt.category && (
                              <Badge
                                variant="outline"
                                className="bg-purple-900/30 text-purple-300 border-purple-700 text-[10px] mb-1"
                              >
                                {prompt.category}
                              </Badge>
                            )}
                            <p className="text-sm text-gray-200">{prompt.text}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              Adicionado em {prompt.date.toLocaleDateString("pt-BR")}
                            </p>
                          </div>
                          <div className="flex gap-1 ml-2">
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
                                    onClick={() => copyPrompt(prompt.text)}
                                  >
                                    <Copy className="mr-2 h-4 w-4" /> Copiar
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="flex items-center cursor-pointer hover:bg-gray-700"
                                    onClick={() => startEditing(prompt.id, prompt)}
                                  >
                                    <Edit className="mr-2 h-4 w-4" /> Editar
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="flex items-center cursor-pointer text-red-400 hover:bg-gray-700 hover:text-red-300"
                                    onClick={() => confirmDelete(prompt.id)}
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
                                  onClick={() => copyPrompt(prompt.text)}
                                  className="text-gray-400 hover:text-blue-400 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                  title="Copiar"
                                >
                                  <Copy size={14} />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => startEditing(prompt.id, prompt)}
                                  className="text-gray-400 hover:text-purple-400 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                  title="Editar"
                                >
                                  <Edit size={14} />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => confirmDelete(prompt.id)}
                                  className="text-gray-400 hover:text-red-400 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                  title="Remover"
                                >
                                  <Trash2 size={14} />
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Delete confirmation */}
                      {deleteConfirmId === prompt.id && (
                        <div className="absolute inset-0 bg-gray-800/95 rounded-md flex items-center justify-center p-3 z-10">
                          <div className="bg-gray-700 p-3 rounded-md border border-red-800/50 max-w-xs">
                            <h4 className="text-sm font-medium text-gray-200 mb-2">Confirmar exclusão</h4>
                            <p className="text-xs text-gray-300 mb-3">
                              Tem certeza que deseja remover este prompt? Esta ação não pode ser desfeita.
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
                                onClick={() => deletePrompt(prompt.id)}
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
                </AnimatePresence>
              </ul>
            </ScrollArea>
          </CardContent>
        </Card>
      ) : (
        <Alert className="bg-gray-800/50 border-gray-700 text-gray-300">
          <AlertCircle className="h-4 w-4 text-purple-400" />
          <AlertTitle>Nenhum prompt personalizado</AlertTitle>
          <AlertDescription>
            Adicione prompts personalizados para melhorar as respostas do seu assistente.
          </AlertDescription>
        </Alert>
      )}

      {/* Examples Dialog */}
      <Dialog open={showExamplesDialog} onOpenChange={setShowExamplesDialog}>
        <DialogContent className="bg-gray-800 border-gray-700 text-gray-100 max-w-lg">
          <DialogHeader>
            <DialogTitle>Exemplos de Prompts</DialogTitle>
            <DialogDescription className="text-gray-400">
              Selecione um exemplo para usar como base para seu prompt personalizado.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 my-4">
            {examplePrompts.map((prompt, index) => (
              <div
                key={index}
                className="p-3 bg-gray-700 rounded-md cursor-pointer hover:bg-gray-600 transition-colors"
                onClick={() => useExamplePrompt(prompt)}
              >
                <div className="flex items-center justify-between mb-1">
                  <Badge variant="outline" className="bg-purple-900/30 text-purple-300 border-purple-700 text-[10px]">
                    {prompt.category}
                  </Badge>
                </div>
                <p className="text-sm text-gray-200">{prompt.text}</p>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
              onClick={() => setShowExamplesDialog(false)}
            >
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
