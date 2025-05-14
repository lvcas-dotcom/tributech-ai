import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(req: NextRequest) {
  try {
    const { messages, customPrompts = [], pdfReferences = [] } = await req.json()

    // In a real implementation, we would:
    // 1. Process the PDF references to extract relevant content
    // 2. Use the custom prompts to guide the AI's behavior
    // 3. Generate a response using the AI SDK

    // Build a system prompt that incorporates the custom training prompts
    const systemPrompt = [
      "Você é a Tributech.AI, uma assistente de IA especializada em assuntos tributários e financeiros.",
      "Você deve fornecer informações precisas e atualizadas sobre legislação tributária brasileira.",
      "Quando não tiver certeza sobre alguma informação específica, recomende a consulta a um profissional.",
      ...customPrompts,
      pdfReferences.length > 0 ? `Você tem conhecimento dos seguintes documentos: ${pdfReferences.join(", ")}` : "",
    ]
      .filter(Boolean)
      .join("\n")

    // Get the last user message
    const lastUserMessage = messages.filter((m: any) => m.role === "user").pop()?.content || ""

    // Generate a response using the AI SDK
    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: systemPrompt,
      prompt: lastUserMessage,
    })

    return NextResponse.json({ response: text })
  } catch (error) {
    console.error("Erro na API de chat:", error)
    return NextResponse.json({ error: "Falha ao gerar resposta" }, { status: 500 })
  }
}
