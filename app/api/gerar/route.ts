import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import OpenAI from 'openai'

export async function POST(req: NextRequest) {
  const anthropicKey = process.env.ANTHROPIC_API_KEY
  if (!anthropicKey) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 500 })
  }

  const client = new Anthropic({ apiKey: anthropicKey })

  try {
    const { animals, location, theme } = await req.json()

    const animalNamesPt = animals.map((a: { namePt: string }) => a.namePt).join(', ')
    const animalEmojis = animals.map((a: { emoji: string }) => a.emoji).join(' ')

    const systemPrompt = `Você é um contador de histórias infantil especializado em criar contos para crianças com autismo leve.
Você cria histórias gentis, com linguagem simples, repetição reconfortante e finais felizes e claros.
As histórias devem ser educativas mas envolventes, com personagens animais adoráveis.
IMPORTANTE: Você SEMPRE responde com JSON válido, sem markdown adicional.`

    const userPrompt = `Crie um conto infantil em DUAS línguas simultaneamente: Português do Brasil e Catalão.

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

Responda APENAS com este JSON (sem mais texto, sem markdown):
{
  "titlePt": "Título em Português",
  "titleCa": "Títol en Català",
  "sections": [
    { "pt": "Parágrafo 1 em português...", "ca": "Paràgraf 1 en català..." },
    { "pt": "Parágrafo 2 em português...", "ca": "Paràgraf 2 en català..." },
    { "pt": "Parágrafo 3 em português...", "ca": "Paràgraf 3 en català..." },
    { "pt": "Parágrafo 4 em português...", "ca": "Paràgraf 4 en català..." },
    { "pt": "Parágrafo 5 em português...", "ca": "Paràgraf 5 en català..." }
  ],
  "illustrationPrompt": "Children's book watercolor illustration: cute ${animalNamesPt} in ${location.namePt}. Soft warm colors, whimsical style like Oliver Jeffers books. No text, wide format, dreamy magical atmosphere."
}`

    // Generate story with Claude
    const response = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    })

    const textBlock = response.content.find((b) => b.type === 'text')
    if (!textBlock || textBlock.type !== 'text') {
      throw new Error('No text response from Claude')
    }

    // Strip markdown code fences if present
    const raw = textBlock.text.trim().replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim()
    const storyData = JSON.parse(raw)

    // Generate illustration with DALL-E 3 (if OpenAI key available)
    let illustrationUrl = ''
    const openaiKey = process.env.OPENAI_API_KEY
    if (openaiKey) {
      try {
        const openai = new OpenAI({ apiKey: openaiKey })
        const illustrationPrompt = storyData.illustrationPrompt ||
          `Children's book watercolor illustration: cute ${animalNamesPt} in ${location.namePt}. Soft warm colors, whimsical style like Oliver Jeffers. No text, wide format, dreamy magical atmosphere.`

        const imageResponse = await openai.images.generate({
          model: 'dall-e-3',
          prompt: illustrationPrompt,
          size: '1792x1024',
          quality: 'standard',
          style: 'vivid',
          n: 1,
        })

        illustrationUrl = (imageResponse.data ?? [])[0]?.url || ''
      } catch (imgError) {
        console.error('Image generation failed:', imgError)
      }
    }

    return NextResponse.json({
      titlePt: storyData.titlePt,
      titleCa: storyData.titleCa,
      illustrationUrl,
      sections: storyData.sections,
    })
  } catch (error) {
    console.error('Story generation error:', error)
    return NextResponse.json({ error: 'Failed to generate story' }, { status: 500 })
  }
}
