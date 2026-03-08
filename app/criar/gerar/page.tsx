'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { saveStory, generateId } from '@/lib/storage'
import { Animal, Location, Theme, SavedStory } from '@/lib/types'

const loadingMessages = [
  { pt: 'Acordando os animais...', ca: 'Despertant els animals...' },
  { pt: 'Preparando o cenário mágico...', ca: 'Preparant l\'escenari màgic...' },
  { pt: 'Escolhendo as palavras certas...', ca: 'Escollint les paraules adequades...' },
  { pt: 'Pintando a ilustração...', ca: 'Pintant la il·lustració...' },
  { pt: 'Quase pronto!', ca: 'Gairebé a punt!' },
]

export default function GeneratingStory() {
  const router = useRouter()
  const [msgIndex, setMsgIndex] = useState(0)
  const [error, setError] = useState('')
  const hasStarted = useRef(false)

  useEffect(() => {
    // Cycle through messages
    const interval = setInterval(() => {
      setMsgIndex((i) => (i + 1) % loadingMessages.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (hasStarted.current) return
    hasStarted.current = true

    const animalsRaw = sessionStorage.getItem('gael-animals')
    const locationRaw = sessionStorage.getItem('gael-location')
    const themeRaw = sessionStorage.getItem('gael-theme')

    if (!animalsRaw || !locationRaw || !themeRaw) {
      router.replace('/criar')
      return
    }

    const animals: Animal[] = JSON.parse(animalsRaw)
    const location: Location = JSON.parse(locationRaw)
    const theme: Theme = JSON.parse(themeRaw)

    generateStory(animals, location, theme)
  }, [router])

  async function generateStory(animals: Animal[], location: Location, theme: Theme) {
    try {
      const response = await fetch('/api/gerar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ animals, location, theme }),
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || 'Failed to generate')
      }

      const story = await response.json()

      const savedStory: SavedStory = {
        id: generateId(),
        createdAt: new Date().toISOString(),
        animals,
        location,
        theme,
        story,
        favorite: false,
      }

      saveStory(savedStory)

      // Clear session
      sessionStorage.removeItem('gael-animals')
      sessionStorage.removeItem('gael-location')
      sessionStorage.removeItem('gael-theme')

      router.replace(`/historia/${savedStory.id}`)
    } catch (err) {
      console.error(err)
      setError('Algo deu errado. Tenta de novo! · Alguna cosa ha fallat. Torna-ho a intentar!')
    }
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
           style={{ background: '#FFF8E7' }}>
        <div className="text-6xl mb-4">😕</div>
        <p className="font-display text-xl text-gray-700 mb-6">{error}</p>
        <button
          onClick={() => router.replace('/criar')}
          className="bg-[#4ECDC4] text-white font-display text-lg font-bold py-3 px-8 rounded-2xl"
        >
          Voltar · Tornar
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
         style={{ background: 'linear-gradient(160deg, #A29BFE 0%, #FFF8E7 50%)' }}>

      {/* Animated animals */}
      <div className="flex gap-4 text-6xl mb-8">
        {['🦁', '🐬', '🦋', '🐘', '🦊'].map((emoji, i) => (
          <span
            key={i}
            className="float"
            style={{ animationDelay: `${i * 0.3}s`, display: 'inline-block' }}
          >
            {emoji}
          </span>
        ))}
      </div>

      {/* Magic wand */}
      <div className="text-8xl mb-6 float">✨</div>

      <h2 className="font-display text-3xl font-bold text-gray-800 mb-2">
        Criando o seu Conto...
      </h2>
      <p className="font-display text-xl text-purple-400 font-semibold mb-8">
        Creant el vostre Conte...
      </p>

      {/* Loading message */}
      <div className="bg-white/80 rounded-2xl px-6 py-4 shadow-md mb-8">
        <p className="font-body text-gray-700 font-semibold pulse-soft">
          {loadingMessages[msgIndex].pt}
        </p>
        <p className="font-body text-purple-400 text-sm pulse-soft">
          {loadingMessages[msgIndex].ca}
        </p>
      </div>

      {/* Progress dots */}
      <div className="flex gap-2">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="w-3 h-3 rounded-full bg-purple-300"
            style={{
              animation: 'pulse-soft 1.5s ease-in-out infinite',
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>

      <p className="text-gray-400 text-xs mt-8">
        Isso pode levar até 30 segundos · Pot trigar fins a 30 segons
      </p>
    </div>
  )
}
