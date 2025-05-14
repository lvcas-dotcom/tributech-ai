import { Brain } from "lucide-react"

interface TributechLogoProps {
  size?: "sm" | "md" | "lg"
  withText?: boolean
  className?: string
}

export function TributechLogo({ size = "md", withText = true, className = "" }: TributechLogoProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10",
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <div className="absolute inset-0 bg-purple-600 rounded-full blur-sm opacity-70"></div>
        <div className="relative bg-gradient-to-br from-purple-500 to-purple-800 rounded-full p-1.5 shadow-lg">
          <Brain className={`${sizeClasses[size]} text-white`} />
        </div>
      </div>
      {withText && (
        <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600">
          Tributech.AI
        </span>
      )}
    </div>
  )
}
