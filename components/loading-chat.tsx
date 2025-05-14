import { TributechLogo } from "@/components/tributech-logo"

export default function LoadingChat() {
  return (
    <div className="flex flex-col h-[80vh] border border-gray-800 rounded-xl shadow-2xl bg-gray-900 p-4">
      <div className="border-b border-gray-800 pb-3 mb-4">
        <TributechLogo size="sm" />
      </div>

      <div className="animate-pulse space-y-6 w-full h-full">
        <div className="flex space-x-2 items-start">
          <div className="h-10 w-10 bg-purple-900/50 rounded-full"></div>
          <div className="h-24 bg-gray-800 rounded-lg w-2/3"></div>
        </div>

        <div className="flex space-x-2 items-start justify-end">
          <div className="h-16 bg-purple-900/30 rounded-lg w-1/2"></div>
          <div className="h-10 w-10 bg-gray-800 rounded-full"></div>
        </div>

        <div className="flex space-x-2 items-start">
          <div className="h-10 w-10 bg-purple-900/50 rounded-full"></div>
          <div className="h-32 bg-gray-800 rounded-lg w-3/4"></div>
        </div>

        <div className="mt-auto h-12 bg-gray-800 rounded-lg w-full"></div>
      </div>
    </div>
  )
}
