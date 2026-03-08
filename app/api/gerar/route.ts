import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 500 })
  }

  const client = new Anthropic({ apiKey })

  try {
    const { animals, location, theme } = await req.json()

    const animalNamesPt = animals.map((a: { namePt: string }) => a.namePt).join(', ')
    const animalEmojis = animals.map((a: { emoji: string }) => a.emoji).join(' ')

    const prompt = `Você é um contador de histórias infantil especializado em criar contos para crianças com autismo leve.
Você cria histórias gentis, com linguagem simples, repetição reconfortante e finais felizes e claros.

Crie um conto infantil em DUAS línguas simultaneamente: Português do Brasil e Catalão.

Animais da história: ${animalNamesPt} (${animalEmojis})
Local: ${location.namePt} / ${location.nameCa}
Tema educacional: ${theme.namePt} - ${theme.descPt}

Informação importante: O Gael tem 4-6 anos e autismo leve. A história deve:
- Ter linguagem simples e direta
- Mostrar claramente as emoções dos personagens
- Ter uma lição gentil sobre o tema escolhido
- Ser tranquilizadora e positiva
- Ter 5 parágrafos curtos (4-6 frases cada)
- Terminar de forma feliz e clara
- O Catalão deve ser Catalão correto e natural (não Espanhol)

Responda APENAS com este JSON válido (sem markdown, sem blocos de código, sem texto extra):
{
  "titlePt": "Título em Português",
  "titleCa": "Títol en Català",
  "sections": [
    { "pt": "Parágrafo 1 em português...", "ca": "Paràgraf 1 en català..." },
    { "pt": "Parágrafo 2 em português...", "ca": "Paràgraf 2 en català..." },
    { "pt": "Parágrafo 3 em português...", "ca": "Paràgraf 3 en català..." },
    { "pt": "Parágrafo 4 em português...", "ca": "Paràgraf 4 en català..." },
    { "pt": "Parágrafo 5 em português...", "ca": "Paràgraf 5 en català..." }
  ]
}`

    const message = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    })

    const block = message.content[0]
    if (block.type !== 'text') throw new Error('Unexpected response type')

    // Strip potential markdown code fences
    let jsonText = block.text.trim()
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
    }

    const storyData = JSON.parse(jsonText)

    return NextResponse.json({
      titlePt: storyData.titlePt,
      titleCa: storyData.titleCa,
      illustrationUrl: '', // Illustration rendered client-side with emoji art
      sections: storyData.sections,
    })
  } catch (error) {
    console.error('Story generation error:', error)
    return NextResponse.json({ error: 'Failed to generate story' }, { status: 500 })
  }
}
