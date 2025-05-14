"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  User,
  Settings,
  Shield,
  CreditCard,
  LogOut,
  Save,
  Moon,
  Sun,
  Clock,
  MessageSquare,
  FileText,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Key,
  Globe,
  HelpCircle,
  ChevronRight,
  Sparkles,
  Plus,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useMobile } from "@/hooks/use-mobile"

export default function UserProfile() {
  const [activeTab, setActiveTab] = useState("general")
  const [isEditing, setIsEditing] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()
  const isMobile = useMobile()

  // User data state
  const [userData, setUserData] = useState({
    name: "João Silva",
    email: "joao.silva@empresa.com.br",
    company: "Empresa Contábil Ltda.",
    role: "Contador",
    bio: "Contador com mais de 10 anos de experiência em consultoria tributária para empresas de médio e grande porte.",
    avatar: "/placeholder.svg?height=200&width=200",
    notifications: {
      email: true,
      push: true,
      updates: false,
      newsletter: true,
    },
    preferences: {
      darkMode: true,
      fontSize: "medium",
      language: "pt-BR",
      autoSave: true,
    },
    security: {
      twoFactor: false,
      sessionTimeout: 30,
      loginNotifications: true,
    },
    subscription: {
      plan: "Profissional",
      status: "Ativo",
      nextBilling: "15/06/2025",
      features: ["Acesso ilimitado", "Suporte prioritário", "Exportação de dados", "API personalizada"],
    },
    usage: {
      messagesThisMonth: 1243,
      documentsUploaded: 17,
      customPrompts: 8,
      lastActive: "Hoje, 14:32",
    },
  })

  const handleSaveProfile = async () => {
    setIsSaving(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsSaving(false)
    setIsEditing(false)

    toast({
      title: "Perfil atualizado",
      description: "Suas informações foram atualizadas com sucesso.",
    })
  }

  const handleLogout = () => {
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso.",
    })
    setShowLogoutConfirm(false)
  }

  const handleDeleteAccount = () => {
    toast({
      title: "Conta excluída",
      description: "Sua conta foi excluída permanentemente.",
      variant: "destructive",
    })
    setShowDeleteConfirm(false)
  }

  const handleNotificationChange = (key: string, value: boolean) => {
    setUserData((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value,
      },
    }))
  }

  const handlePreferenceChange = (key: string, value: any) => {
    setUserData((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value,
      },
    }))
  }

  const handleSecurityChange = (key: string, value: any) => {
    setUserData((prev) => ({
      ...prev,
      security: {
        ...prev.security,
        [key]: value,
      },
    }))
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Card className="bg-gray-800 border-gray-700 text-gray-100 overflow-hidden">
        <CardHeader className="pb-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-purple-600">
                <AvatarImage src={userData.avatar || "/placeholder.svg"} alt={userData.name} />
                <AvatarFallback className="bg-purple-900 text-purple-100 text-xl">
                  {userData.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-xl">{userData.name}</CardTitle>
                <CardDescription className="text-gray-400">{userData.email}</CardDescription>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="bg-purple-900/30 text-purple-300 border-purple-700">
                    {userData.subscription.plan}
                  </Badge>
                  <Badge variant="outline" className="bg-green-900/30 text-green-300 border-green-700">
                    {userData.subscription.status}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex gap-2 sm:self-start">
              {isEditing ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(false)}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    Cancelar
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSaveProfile}
                    className="bg-purple-700 hover:bg-purple-800"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <span className="opacity-0">
                          <Save className="mr-2 h-4 w-4" /> Salvar
                        </span>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" /> Salvar
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Editar Perfil
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 sm:grid-cols-4 bg-gray-700 border border-gray-600 mb-6">
              <TabsTrigger
                value="general"
                className="data-[state=active]:bg-purple-900/50 data-[state=active]:text-white"
              >
                <User className="h-4 w-4 mr-2" /> Geral
              </TabsTrigger>
              <TabsTrigger
                value="preferences"
                className="data-[state=active]:bg-purple-900/50 data-[state=active]:text-white"
              >
                <Settings className="h-4 w-4 mr-2" /> Preferências
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className="data-[state=active]:bg-purple-900/50 data-[state=active]:text-white"
              >
                <Shield className="h-4 w-4 mr-2" /> Segurança
              </TabsTrigger>
              <TabsTrigger
                value="subscription"
                className="data-[state=active]:bg-purple-900/50 data-[state=active]:text-white"
              >
                <CreditCard className="h-4 w-4 mr-2" /> Assinatura
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6 mt-0">
              <div className="space-y-4">
                {isEditing ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome</Label>
                      <Input
                        id="name"
                        value={userData.name}
                        onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                        className="bg-gray-700 border-gray-600 text-gray-100"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={userData.email}
                        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                        className="bg-gray-700 border-gray-600 text-gray-100"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Empresa</Label>
                      <Input
                        id="company"
                        value={userData.company}
                        onChange={(e) => setUserData({ ...userData, company: e.target.value })}
                        className="bg-gray-700 border-gray-600 text-gray-100"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Cargo</Label>
                      <Input
                        id="role"
                        value={userData.role}
                        onChange={(e) => setUserData({ ...userData, role: e.target.value })}
                        className="bg-gray-700 border-gray-600 text-gray-100"
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="bio">Biografia</Label>
                      <Textarea
                        id="bio"
                        value={userData.bio}
                        onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
                        className="bg-gray-700 border-gray-600 text-gray-100 min-h-[100px] resize-none"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <h3 className="text-sm font-medium text-gray-400">Empresa</h3>
                        <p className="text-gray-200">{userData.company}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-400">Cargo</h3>
                        <p className="text-gray-200">{userData.role}</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-400">Biografia</h3>
                      <p className="text-gray-200 mt-1">{userData.bio}</p>
                    </div>
                  </div>
                )}

                <div className="pt-4">
                  <h3 className="text-sm font-medium text-gray-300 mb-3">Estatísticas de Uso</h3>
                  <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                    <div className="bg-gray-700/50 p-3 rounded-lg flex flex-col">
                      <div className="flex items-center gap-2 mb-1">
                        <MessageSquare className="h-4 w-4 text-purple-400" />
                        <span className="text-xs text-gray-400">Mensagens</span>
                      </div>
                      <span className="text-xl font-semibold text-gray-200">{userData.usage.messagesThisMonth}</span>
                      <span className="text-xs text-gray-500 mt-1">Este mês</span>
                    </div>
                    <div className="bg-gray-700/50 p-3 rounded-lg flex flex-col">
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="h-4 w-4 text-blue-400" />
                        <span className="text-xs text-gray-400">Documentos</span>
                      </div>
                      <span className="text-xl font-semibold text-gray-200">{userData.usage.documentsUploaded}</span>
                      <span className="text-xs text-gray-500 mt-1">Enviados</span>
                    </div>
                    <div className="bg-gray-700/50 p-3 rounded-lg flex flex-col">
                      <div className="flex items-center gap-2 mb-1">
                        <Sparkles className="h-4 w-4 text-amber-400" />
                        <span className="text-xs text-gray-400">Prompts</span>
                      </div>
                      <span className="text-xl font-semibold text-gray-200">{userData.usage.customPrompts}</span>
                      <span className="text-xs text-gray-500 mt-1">Personalizados</span>
                    </div>
                    <div className="bg-gray-700/50 p-3 rounded-lg flex flex-col">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="h-4 w-4 text-green-400" />
                        <span className="text-xs text-gray-400">Atividade</span>
                      </div>
                      <span className="text-xl font-semibold text-gray-200">
                        {userData.usage.lastActive.split(",")[0]}
                      </span>
                      <span className="text-xs text-gray-500 mt-1">{userData.usage.lastActive.split(",")[1]}</span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="bg-gray-700" />

              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-300">Notificações</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Notificações por email</Label>
                      <p className="text-xs text-gray-400">Receba atualizações e alertas por email</p>
                    </div>
                    <Switch
                      checked={userData.notifications.email}
                      onCheckedChange={(checked) => handleNotificationChange("email", checked)}
                      className="data-[state=checked]:bg-purple-600"
                    />
                  </div>
                  <Separator className="bg-gray-700" />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Notificações push</Label>
                      <p className="text-xs text-gray-400">Receba alertas em tempo real</p>
                    </div>
                    <Switch
                      checked={userData.notifications.push}
                      onCheckedChange={(checked) => handleNotificationChange("push", checked)}
                      className="data-[state=checked]:bg-purple-600"
                    />
                  </div>
                  <Separator className="bg-gray-700" />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Atualizações do produto</Label>
                      <p className="text-xs text-gray-400">Seja informado sobre novos recursos</p>
                    </div>
                    <Switch
                      checked={userData.notifications.updates}
                      onCheckedChange={(checked) => handleNotificationChange("updates", checked)}
                      className="data-[state=checked]:bg-purple-600"
                    />
                  </div>
                  <Separator className="bg-gray-700" />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Newsletter</Label>
                      <p className="text-xs text-gray-400">Receba dicas e conteúdos sobre tributação</p>
                    </div>
                    <Switch
                      checked={userData.notifications.newsletter}
                      onCheckedChange={(checked) => handleNotificationChange("newsletter", checked)}
                      className="data-[state=checked]:bg-purple-600"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="preferences" className="space-y-6 mt-0">
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-300">Aparência</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Modo escuro</Label>
                      <p className="text-xs text-gray-400">Alterne entre os temas claro e escuro</p>
                    </div>
                    <div className="flex items-center">
                      <Sun className="h-4 w-4 text-gray-400 mr-2" />
                      <Switch
                        checked={userData.preferences.darkMode}
                        onCheckedChange={(checked) => handlePreferenceChange("darkMode", checked)}
                        className="data-[state=checked]:bg-purple-600"
                      />
                      <Moon className="h-4 w-4 text-gray-400 ml-2" />
                    </div>
                  </div>
                  <Separator className="bg-gray-700" />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Tamanho da fonte</Label>
                      <p className="text-xs text-gray-400">Ajuste o tamanho do texto</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className={`h-8 px-3 ${userData.preferences.fontSize === "small" ? "bg-purple-900/50 border-purple-600" : "border-gray-600"}`}
                        onClick={() => handlePreferenceChange("fontSize", "small")}
                      >
                        A<span className="text-xs">-</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className={`h-8 px-3 ${userData.preferences.fontSize === "medium" ? "bg-purple-900/50 border-purple-600" : "border-gray-600"}`}
                        onClick={() => handlePreferenceChange("fontSize", "medium")}
                      >
                        A
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className={`h-8 px-3 ${userData.preferences.fontSize === "large" ? "bg-purple-900/50 border-purple-600" : "border-gray-600"}`}
                        onClick={() => handlePreferenceChange("fontSize", "large")}
                      >
                        A<span className="text-xs">+</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="bg-gray-700" />

              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-300">Idioma e Região</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Idioma da interface</Label>
                      <p className="text-xs text-gray-400">Selecione o idioma da interface</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                        <Globe className="h-4 w-4 mr-2" />
                        Português (BR)
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                  <Separator className="bg-gray-700" />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Salvar automaticamente</Label>
                      <p className="text-xs text-gray-400">Salvar alterações automaticamente</p>
                    </div>
                    <Switch
                      checked={userData.preferences.autoSave}
                      onCheckedChange={(checked) => handlePreferenceChange("autoSave", checked)}
                      className="data-[state=checked]:bg-purple-600"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="security" className="space-y-6 mt-0">
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-300">Segurança da Conta</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Autenticação de dois fatores</Label>
                      <p className="text-xs text-gray-400">Adicione uma camada extra de segurança</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {userData.security.twoFactor ? (
                        <Badge className="bg-green-600 text-white">Ativado</Badge>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-600 text-gray-300 hover:bg-gray-700"
                          onClick={() => handleSecurityChange("twoFactor", true)}
                        >
                          <Shield className="h-4 w-4 mr-2" />
                          Ativar
                        </Button>
                      )}
                    </div>
                  </div>
                  <Separator className="bg-gray-700" />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Tempo limite da sessão</Label>
                      <p className="text-xs text-gray-400">Tempo de inatividade antes do logout</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className={`h-8 px-3 ${userData.security.sessionTimeout === 15 ? "bg-purple-900/50 border-purple-600" : "border-gray-600"}`}
                        onClick={() => handleSecurityChange("sessionTimeout", 15)}
                      >
                        15m
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className={`h-8 px-3 ${userData.security.sessionTimeout === 30 ? "bg-purple-900/50 border-purple-600" : "border-gray-600"}`}
                        onClick={() => handleSecurityChange("sessionTimeout", 30)}
                      >
                        30m
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className={`h-8 px-3 ${userData.security.sessionTimeout === 60 ? "bg-purple-900/50 border-purple-600" : "border-gray-600"}`}
                        onClick={() => handleSecurityChange("sessionTimeout", 60)}
                      >
                        1h
                      </Button>
                    </div>
                  </div>
                  <Separator className="bg-gray-700" />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Notificações de login</Label>
                      <p className="text-xs text-gray-400">Receba alertas sobre novos logins</p>
                    </div>
                    <Switch
                      checked={userData.security.loginNotifications}
                      onCheckedChange={(checked) => handleSecurityChange("loginNotifications", checked)}
                      className="data-[state=checked]:bg-purple-600"
                    />
                  </div>
                </div>
              </div>

              <Separator className="bg-gray-700" />

              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-300">Ações da Conta</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Alterar senha</Label>
                      <p className="text-xs text-gray-400">Atualize sua senha de acesso</p>
                    </div>
                    <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                      <Key className="h-4 w-4 mr-2" />
                      Alterar
                    </Button>
                  </div>
                  <Separator className="bg-gray-700" />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Fazer logout</Label>
                      <p className="text-xs text-gray-400">Sair da sua conta</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                      onClick={() => setShowLogoutConfirm(true)}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                  <Separator className="bg-gray-700" />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm" className="text-red-400">
                        Excluir conta
                      </Label>
                      <p className="text-xs text-gray-400">Excluir permanentemente sua conta</p>
                    </div>
                    <Button variant="destructive" size="sm" onClick={() => setShowDeleteConfirm(true)}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Excluir
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="subscription" className="space-y-6 mt-0">
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-purple-900/50 to-purple-700/30 rounded-lg p-4 border border-purple-700/50">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-medium text-white flex items-center">
                        <CheckCircle2 className="h-5 w-5 text-green-400 mr-2" />
                        Plano {userData.subscription.plan}
                      </h3>
                      <p className="text-sm text-gray-300 mt-1">
                        Próxima cobrança em {userData.subscription.nextBilling}
                      </p>
                    </div>
                    <Button className="bg-purple-700 hover:bg-purple-800">Gerenciar Assinatura</Button>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <h3 className="text-sm font-medium text-gray-300">Recursos Incluídos</h3>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {userData.subscription.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 bg-gray-700/30 p-3 rounded-md">
                        <CheckCircle2 className="h-4 w-4 text-green-400 flex-shrink-0" />
                        <span className="text-sm text-gray-200">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="bg-gray-700" />

                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-300">Histórico de Pagamentos</h3>
                  <div className="bg-gray-700/30 rounded-lg overflow-hidden">
                    <div className="grid grid-cols-3 gap-4 p-3 border-b border-gray-700 bg-gray-700/50">
                      <div className="text-xs font-medium text-gray-400">Data</div>
                      <div className="text-xs font-medium text-gray-400">Valor</div>
                      <div className="text-xs font-medium text-gray-400">Status</div>
                    </div>
                    <ScrollArea className="h-[200px]">
                      {[...Array(5)].map((_, index) => (
                        <div key={index} className="grid grid-cols-3 gap-4 p-3 border-b border-gray-700 last:border-0">
                          <div className="text-sm text-gray-200">
                            {new Date(2025, 4 - index, 15).toLocaleDateString("pt-BR")}
                          </div>
                          <div className="text-sm text-gray-200">R$ 99,90</div>
                          <div>
                            <Badge className="bg-green-600 text-white">Pago</Badge>
                          </div>
                        </div>
                      ))}
                    </ScrollArea>
                  </div>
                </div>

                <Separator className="bg-gray-700" />

                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-gray-300">Métodos de Pagamento</h3>
                  <div className="flex items-center justify-between bg-gray-700/30 p-3 rounded-md">
                    <div className="flex items-center gap-3">
                      <div className="bg-gray-800 p-2 rounded">
                        <CreditCard className="h-5 w-5 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-200">Cartão de crédito</p>
                        <p className="text-xs text-gray-400">**** **** **** 4589 • Expira em 09/27</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-300">
                      Editar
                    </Button>
                  </div>
                  <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar método de pagamento
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter className="border-t border-gray-700 bg-gray-800/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-6">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-400">Precisa de ajuda? Entre em contato com o suporte.</span>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Button
              variant="outline"
              size="sm"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
              onClick={() => setShowLogoutConfirm(true)}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Logout Confirmation Dialog */}
      <Dialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <DialogContent className="bg-gray-800 border-gray-700 text-gray-100">
          <DialogHeader>
            <DialogTitle>Confirmar Logout</DialogTitle>
            <DialogDescription className="text-gray-400">Tem certeza que deseja sair da sua conta?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowLogoutConfirm(false)}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Cancelar
            </Button>
            <Button variant="default" onClick={handleLogout} className="bg-purple-700 hover:bg-purple-800">
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Account Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="bg-gray-800 border-gray-700 text-gray-100">
          <DialogHeader>
            <DialogTitle className="text-red-400 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Excluir Conta
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Esta ação é irreversível. Todos os seus dados, histórico de conversas e documentos serão permanentemente
              excluídos.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-red-900/20 border border-red-800/50 rounded-md p-3 my-2">
            <p className="text-sm text-gray-200">Para confirmar, digite "excluir minha conta" abaixo:</p>
            <Input className="mt-2 bg-gray-700 border-gray-600 text-gray-100" placeholder="excluir minha conta" />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(false)}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteAccount}>
              Excluir Permanentemente
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
