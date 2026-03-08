import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

export async function POST(req: NextRequest) {
  const anthropicKey = process.env.ANTHROPIC_API_KEY
  if (!anthropicKey) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 500 })
  }

  const client = new Anthropic({ apiKey: anthropicKey })

  try {
    const { animals, location, theme } = await req.json()

    const animalNamesPt = animals.map((a: { namePt: string }) => a.namePt).join(' e ')
    const animalEmojis = animals.map((a: { emoji: string }) => a.emoji).join(' ')

    const systemPrompt = `Você é um contador de histórias infantil especializado em criar contos para crianças com autismo leve.
Crie histórias gentis, com linguagem simples, repetição reconfortante e finais felizes e claros.
IMPORTANTE: Responda SEMPRE com JSON válido, sem markdown adicional.`

    const userPrompt = `Crie um conto infantil em Português do Brasil e Catalão.

Animais: ${animalNamesPt} (${animalEmojis})
Local: ${location.namePt} / ${location.nameCa}
Tema: ${theme.namePt} — ${theme.descPt}

A história é para o Gael, 4-6 anos, autismo leve. Use linguagem simples, emoções claras, lição gentil, fim feliz. 5 parágrafos curtos. O Catalão deve ser correto (não Espanhol).

Responda APENAS com este JSON:
{
  "titlePt": "Título em Português",
  "titleCa": "Títol en Català",
  "sections": [
    { "pt": "parágrafo 1 PT", "ca": "paràgraf 1 CA" },
    { "pt": "parágrafo 2 PT", "ca": "paràgraf 2 CA" },
    { "pt": "parágrafo 3 PT", "ca": "paràgraf 3 CA" },
    { "pt": "parágrafo 4 PT", "ca": "paràgraf 4 CA" },
    { "pt": "parágrafo 5 PT", "ca": "paràgraf 5 CA" }
  ]
}`

    // 1. Generate story text with Claude
    const response = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    })

    const textBlock = response.content.find((b) => b.type === 'text')
    if (!textBlock || textBlock.type !== 'text') throw new Error('No text response from Claude')

    const raw = textBlock.text.trim().replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim()
    const storyData = JSON.parse(raw)

    // 2. Build Pollinations.ai URLs — no server-side fetch needed, URLs are stable by prompt
    const stylePrefix =
      `Children's picture book illustration. Painterly style with soft watercolor and gouache textures. ` +
      `Warm muted pastel palette: peach, sage green, dusty blue, warm cream, soft amber. ` +
      `Expressive rounded cute animal characters with big friendly eyes. ` +
      `Detailed atmospheric background with soft dreamy lighting. ` +
      `Cozy magical mood, lush environment. Similar to modern children's picture books. ` +
      `No text, no words, no letters anywhere in the image. ` +
      `Characters: ${animalNamesPt} (${animalEmojis}). Location: ${location.namePt}. `

    const illustrationUrls = storyData.sections.map((s: { pt: string }) => {
      const prompt = stylePrefix + `Scene: ${s.pt} Wide horizontal composition, full background scene.`
      return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1792&height=1024&nologo=true&model=flux`
    })

    return NextResponse.json({
      titlePt: storyData.titlePt,
      titleCa: storyData.titleCa,
      illustrationUrls,
      sections: storyData.sections,
    })
  } catch (error) {
    console.error('Story generation error:', error)
    return NextResponse.json({ error: 'Failed to generate story' }, { status: 500 })
  }
}
