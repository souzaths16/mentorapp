'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getStoryById, toggleFavorite } from '@/lib/storage'
import { SavedStory } from '@/lib/types'

export default function StoryPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [story, setStory] = useState<SavedStory | null>(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const [audioState, setAudioState] = useState<'idle' | 'loading' | 'playing' | 'paused' | 'error'>('idle')
  const [audioProgress, setAudioProgress] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const audioUrlRef = useRef<string>('')

  useEffect(() => {
    const found = getStoryById(id)
    if (!found) {
      router.replace('/salvos')
      return
    }
    setStory(found)
    setIsFavorite(found.favorite)
  }, [id, router])

  function handleFavorite() {
    toggleFavorite(id)
    setIsFavorite((prev) => !prev)
  }

  async function handleAudio() {
    if (!story) return

    if (audioState === 'playing' && audioRef.current) {
      audioRef.current.pause()
      setAudioState('paused')
      return
    }

    if (audioState === 'paused' && audioRef.current) {
      audioRef.current.play()
      setAudioState('playing')
      return
    }

    // Generate audio
    setAudioState('loading')
    try {
      // Build full Catalan text for narration
      const fullText = `${story.story.titleCa}. ${story.story.sections.map((s) => s.ca).join('. ')}`

      // Check if we already have a cached audio URL
      if (audioUrlRef.current) {
        playAudio(audioUrlRef.current)
        return
      }

      const response = await fetch('/api/audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: fullText, title: story.story.titleCa }),
      })

      if (!response.ok) throw new Error('Audio generation failed')

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      audioUrlRef.current = url
      playAudio(url)
    } catch (err) {
      console.error(err)
      setAudioState('error')
    }
  }

  function playAudio(url: string) {
    const audio = new Audio(url)
    audioRef.current = audio

    audio.addEventListener('timeupdate', () => {
      if (audio.duration) {
        setAudioProgress((audio.currentTime / audio.duration) * 100)
      }
    })

    audio.addEventListener('ended', () => {
      setAudioState('idle')
      setAudioProgress(0)
    })

    audio.play()
    setAudioState('playing')
  }

  if (!story) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#FFF8E7' }}>
        <div className="text-5xl float">📖</div>
      </div>
    )
  }

  const { story: storyData } = story

  return (
    <div className="min-h-screen pb-10" style={{ background: '#FFF8E7' }}>
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-gray-100 px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/salvos" className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center text-lg">
            ←
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">
              {story.animals.map((a) => a.emoji).join('')}
            </span>
          </div>
          <button
            onClick={handleFavorite}
            className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center text-xl active:scale-90 transition-transform"
          >
            {isFavorite ? '⭐' : '☆'}
          </button>
        </div>
      </div>

      {/* Illustration */}
      <div className="w-full aspect-[16/9] relative overflow-hidden">
        {storyData.illustrationUrl ? (
          <Image
            src={storyData.illustrationUrl}
            alt={storyData.titlePt}
            fill
            className="object-cover"
            unoptimized
            priority
          />
        ) : (
          <IllustrationPlaceholder story={story} />
        )}
      </div>

      {/* Title */}
      <div className="px-5 pt-6 pb-4">
        <h1 className="font-display text-3xl font-bold text-gray-800 leading-tight">
          {storyData.titlePt}
        </h1>
        <h2 className="font-display text-2xl text-[#4ECDC4] font-semibold mt-1">
          {storyData.titleCa}
        </h2>

        {/* Meta info */}
        <div className="flex flex-wrap gap-2 mt-3">
          <Chip emoji={story.location.emoji} text={story.location.namePt} color="#4ECDC4" />
          <Chip emoji={story.theme.emoji} text={story.theme.namePt} color="#FFD93D" />
          {story.animals.map((a) => (
            <Chip key={a.id} emoji={a.emoji} text={a.namePt} color="#A29BFE" />
          ))}
        </div>
      </div>

      {/* Audio Player */}
      <div className="mx-5 mb-6 bg-white rounded-2xl shadow-md p-4 border border-gray-100">
        <div className="flex items-center gap-3">
          <button
            onClick={handleAudio}
            disabled={audioState === 'loading'}
            className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-xl
                        font-bold shadow flex-shrink-0 active:scale-90 transition-transform ${
              audioState === 'loading'
                ? 'bg-gray-300 cursor-wait'
                : 'bg-gradient-to-br from-[#4ECDC4] to-[#A29BFE]'
            }`}
          >
            {audioState === 'loading' ? '⏳' : audioState === 'playing' ? '⏸' : '▶'}
          </button>

          <div className="flex-1">
            <p className="text-xs font-bold text-gray-700">
              🎙 Ouvir em Catalão · Escoltar en Català
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              {audioState === 'idle' && 'Voz nativa em Catalão · Veu nativa en Català'}
              {audioState === 'loading' && 'Gerando áudio... · Generant àudio...'}
              {audioState === 'playing' && 'A reproduzir... · Reproduint...'}
              {audioState === 'paused' && 'Pausado · En pausa'}
              {audioState === 'error' && '⚠️ Erro - API key necessária · Error - Cal clau API'}
            </p>
            {/* Progress bar */}
            {(audioState === 'playing' || audioState === 'paused') && (
              <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#4ECDC4] to-[#A29BFE] rounded-full audio-bar"
                  style={{ width: `${audioProgress}%` }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Story content - Bilingual */}
      <div className="px-5">
        {/* Language header */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2 bg-green-50 rounded-xl px-3 py-2">
            <span className="text-xl">🇧🇷</span>
            <div>
              <p className="text-xs font-bold text-green-700">Português BR</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-yellow-50 rounded-xl px-3 py-2">
            <span className="text-xl">🟡🔴</span>
            <div>
              <p className="text-xs font-bold text-yellow-700">Català</p>
            </div>
          </div>
        </div>

        {/* Story sections */}
        {storyData.sections.map((section, index) => (
          <div key={index} className="mb-6">
            {/* Section number */}
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-[#4ECDC4] flex items-center justify-center
                              text-white text-xs font-bold flex-shrink-0">
                {index + 1}
              </div>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Bilingual text side by side */}
            <div className="grid grid-cols-2 gap-3">
              {/* Portuguese */}
              <div className="bg-green-50 rounded-2xl p-4 border-l-4 border-green-400">
                <p className="story-text text-sm text-gray-800 leading-relaxed">
                  {section.pt}
                </p>
              </div>
              {/* Catalan */}
              <div className="bg-yellow-50 rounded-2xl p-4 border-l-4 border-yellow-400">
                <p className="story-text text-sm text-gray-800 leading-relaxed italic">
                  {section.ca}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* End decoration */}
        <div className="text-center py-6">
          <div className="text-4xl mb-2">🌟</div>
          <p className="font-display text-lg text-gray-500">Fim · Fi</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-4 pb-6">
          <button
            onClick={handleFavorite}
            className={`flex-1 py-3 rounded-2xl font-display font-bold text-base
                        border-2 transition-all active:scale-95 ${
              isFavorite
                ? 'bg-amber-50 border-[#FFD93D] text-amber-600'
                : 'bg-white border-gray-200 text-gray-600'
            }`}
          >
            {isFavorite ? '⭐ Favorita' : '☆ Favoritar'}
          </button>
          <Link href="/criar" className="flex-1">
            <button className="w-full py-3 rounded-2xl font-display font-bold text-base
                               bg-[#4ECDC4] text-white active:scale-95 transition-transform">
              ✨ Nova História
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

function Chip({ emoji, text, color }: { emoji: string; text: string; color: string }) {
  return (
    <span
      className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full text-gray-700"
      style={{ background: `${color}22`, border: `1.5px solid ${color}55` }}
    >
      {emoji} {text}
    </span>
  )
}

function IllustrationPlaceholder({ story }: { story: SavedStory }) {
  const bgColors = ['#4ECDC4', '#A29BFE', '#FFD93D', '#FF6B6B', '#55EFC4']
  const animals = story.animals

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center"
      style={{
        background: `linear-gradient(135deg, ${bgColors[0]}, ${bgColors[1]}, ${bgColors[2]})`,
      }}
    >
      <div className="flex gap-4 text-7xl mb-4">
        {animals.slice(0, 3).map((a) => (
          <span key={a.id} className="float drop-shadow-lg">
            {a.emoji}
          </span>
        ))}
      </div>
      <div className="text-4xl">{story.location.emoji}</div>
      <p className="text-white/70 text-xs mt-3 font-display">
        Ilustração · Il·lustració
      </p>
    </div>
  )
}
