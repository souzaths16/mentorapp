import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'OPENAI_API_KEY not configured' }, { status: 500 })
  }

  const openai = new OpenAI({ apiKey })

  try {
    const { animals, location, theme } = await req.json()

    const animalNamesPt = animals.map((a: { namePt: string }) => a.namePt).join(', ')
    const animalNamesCa = animals.map((a: { nameCa: string }) => a.nameCa).join(', ')
    const animalEmojis = animals.map((a: { emoji: string }) => a.emoji).join('')

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
  "illustrationPrompt": "Describe in English a children's book watercolor illustration scene with ${animalNamesPt} in ${location.namePt}. Warm, whimsical, soft colors, Oliver Jeffers style."
}`

    // Generate story
    const storyResponse = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.8,
      response_format: { type: 'json_object' },
    })

    const storyContent = storyResponse.choices[0].message.content || '{}'
    const storyData = JSON.parse(storyContent)

    // Generate illustration with DALL-E
    let illustrationUrl = ''
    try {
      const illustrationPrompt = storyData.illustrationPrompt ||
        `Children's book watercolor illustration: cute ${animalNamesPt} in ${location.namePt}.
         Soft warm colors, whimsical style like Oliver Jeffers or Nicola Kinnear books.
         No text, wide format, dreamy and magical atmosphere.`

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
      illustrationUrl = ''
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
