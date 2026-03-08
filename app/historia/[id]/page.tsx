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
      router.replace('/')
      return
    }
    setStory(found)
    setIsFavorite(found.favorite)
  }, [id, router])

  useEffect(() => {
    return () => {
      if (audioRef.current) audioRef.current.pause()
      if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current)
    }
  }, [])

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

    if (audioUrlRef.current) {
      playAudio(audioUrlRef.current)
      return
    }

    setAudioState('loading')
    try {
      const fullText = `${story.story.titleCa}. ${story.story.sections.map((s) => s.ca).join('. ')}`
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
      if (audio.duration) setAudioProgress((audio.currentTime / audio.duration) * 100)
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
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#FFF8F0' }}>
        <div className="text-5xl float">📖</div>
      </div>
    )
  }

  const { story: storyData } = story

  const audioIcon =
    audioState === 'loading' ? '⏳' :
    audioState === 'playing' ? '🔊' :
    audioState === 'error'   ? '⚠️' : '🔇'

  return (
    <div className="min-h-screen pb-16" style={{ background: '#FFF8F0' }}>

      {/* ── Top navigation bar ── */}
      <div className="sticky top-0 z-20 px-4 py-3" style={{ background: '#FFF8F0/95', backdropFilter: 'blur(8px)' }}>
        <div className="flex items-center justify-between gap-2">

          {/* Back */}
          <Link
            href="/"
            className="w-11 h-11 flex items-center justify-center rounded-2xl text-lg font-bold shadow-sm"
            style={{ background: '#fff', border: '1.5px solid #E8E0D8', color: '#2C2416' }}
          >
            ←
          </Link>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {/* Audio */}
            <button
              onClick={handleAudio}
              disabled={audioState === 'loading'}
              className="w-11 h-11 flex items-center justify-center rounded-2xl text-lg shadow-sm active:scale-90 transition-transform"
              style={{ background: '#fff', border: '1.5px solid #E8E0D8' }}
            >
              {audioIcon}
            </button>

            {/* Language chip */}
            <div
              className="h-11 flex items-center gap-1.5 px-3 rounded-2xl text-sm font-bold shadow-sm"
              style={{ background: '#fff', border: '1.5px solid #E8E0D8', color: '#2C2416' }}
            >
              <span className="text-base">🌐</span>
              <span>🇪🇸</span>
              <span>CA</span>
            </div>

            {/* Save / favorite */}
            <button
              onClick={handleFavorite}
              className="w-11 h-11 flex items-center justify-center rounded-2xl text-xl shadow-sm active:scale-90 transition-transform"
              style={{ background: '#fff', border: '1.5px solid #E8E0D8' }}
            >
              {isFavorite ? '❤️' : '🤍'}
            </button>
          </div>
        </div>

        {/* Audio progress bar */}
        {(audioState === 'playing' || audioState === 'paused') && (
          <div className="mt-2 mx-1 h-1 rounded-full overflow-hidden" style={{ background: '#E8E0D8' }}>
            <div
              className="h-full rounded-full audio-bar"
              style={{
                width: `${audioProgress}%`,
                background: 'linear-gradient(90deg, #4BB5AE, #A29BFE)',
              }}
            />
          </div>
        )}
      </div>

      {/* ── Header: animal emojis + title ── */}
      <div className="px-5 pt-3 pb-4">
        <div className="flex gap-2 text-5xl mb-3">
          {story.animals.map((a) => (
            <span key={a.id}>{a.emoji}</span>
          ))}
        </div>

        <h1 className="font-black text-2xl leading-tight" style={{ color: '#2C2416' }}>
          {storyData.titleCa}
        </h1>
        <p className="text-base mt-1" style={{ color: '#8B7355' }}>
          {storyData.titlePt}
        </p>

        <div className="flex flex-wrap gap-2 mt-3">
          <Chip emoji="✨" text={story.location.nameCa} />
          <Chip emoji={story.theme.emoji} text={story.theme.nameCa} />
        </div>
      </div>

      {/* ── Cover illustration ── */}
      <div className="mx-4 mb-2">
        <div className="rounded-3xl overflow-hidden shadow-md" style={{ aspectRatio: '4/3', position: 'relative' }}>
          {storyData.illustrationUrl ? (
            <Image
              src={storyData.illustrationUrl}
              alt={storyData.titleCa}
              fill
              className="object-cover"
              unoptimized
              priority
            />
          ) : (
            <IllustrationPlaceholder story={story} />
          )}
        </div>
      </div>

      {/* ── Story sections ── */}
      <div className="px-4 mt-4 space-y-4">
        {storyData.sections.map((section, index) => (
          <div key={index}>
            {/* Chapter label */}
            <div className="mb-2 px-1">
              <span
                className="text-xs font-black tracking-widest"
                style={{ color: '#B0A090', letterSpacing: '0.12em' }}
              >
                CAPÍTOL {index + 1} · CAPÍTULO {index + 1}
              </span>
            </div>

            {/* Bilingual text card */}
            <div
              className="rounded-3xl overflow-hidden shadow-sm"
              style={{ background: '#fff', border: '1.5px solid #EDE5DC' }}
            >
              <div className="grid grid-cols-2 divide-x" style={{ borderColor: '#EDE5DC' }}>
                {/* Portuguese column */}
                <div className="p-4">
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-base">🇧🇷</span>
                    <span className="text-[10px] font-black tracking-widest" style={{ color: '#8B7355' }}>
                      PORTUGUÊS
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: '#3D3020' }}>
                    {section.pt}
                  </p>
                </div>

                {/* Catalan column */}
                <div className="p-4">
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-base">🇪🇸</span>
                    <span className="text-[10px] font-black tracking-widest" style={{ color: '#8B7355' }}>
                      CATALÀ
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: '#3D3020' }}>
                    {section.ca}
                  </p>
                </div>
              </div>
            </div>

            {/* Character illustration between sections */}
            {index < storyData.sections.length - 1 && (
              <div
                className="mt-4 rounded-3xl overflow-hidden shadow-sm"
                style={{ background: '#fff', border: '1.5px solid #EDE5DC', aspectRatio: '4/3', position: 'relative' }}
              >
                {storyData.charactersUrl ? (
                  <Image
                    src={storyData.charactersUrl}
                    alt={`Ilustração ${index + 1}`}
                    fill
                    className="object-contain p-6"
                    unoptimized
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex gap-4 text-6xl">
                      {story.animals.map((a) => (
                        <span key={a.id} className="float">{a.emoji}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {/* End marker */}
        <div className="text-center py-8">
          <div className="text-5xl mb-2">🌟</div>
          <p className="font-black text-base" style={{ color: '#B0A090' }}>Fim · Fi</p>
        </div>

        {/* Bottom action buttons */}
        <div className="flex gap-3 pb-4">
          <button
            onClick={handleFavorite}
            className="flex-1 py-3.5 rounded-2xl font-black text-base transition-all active:scale-95"
            style={
              isFavorite
                ? { background: '#FFF0F0', border: '2px solid #FFB3B3', color: '#E05555' }
                : { background: '#fff', border: '2px solid #EDE5DC', color: '#8B7355' }
            }
          >
            {isFavorite ? '❤️ Guardada · Guardada' : '🤍 Guardar · Desar'}
          </button>
          <Link href="/criar" className="flex-1">
            <button
              className="w-full py-3.5 rounded-2xl font-black text-base text-white active:scale-95 transition-transform"
              style={{ background: '#4BB5AE' }}
            >
              ✨ Nova Història
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

function Chip({ emoji, text }: { emoji: string; text: string }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full"
      style={{ background: '#F0EBE3', color: '#5C4E3A', border: '1.5px solid #DDD5C8' }}
    >
      {emoji} {text}
    </span>
  )
}

function IllustrationPlaceholder({ story }: { story: SavedStory }) {
  const gradients: [string, string][] = [
    ['#A8E6CF', '#7EC8C8'],
    ['#FFD93D', '#FF6B6B'],
    ['#C9B8FF', '#7EC8C8'],
  ]
  const [g1, g2] = gradients[story.animals.length % gradients.length]
  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center gap-4"
      style={{ background: `linear-gradient(135deg, ${g1}, ${g2})` }}
    >
      <div className="flex gap-3 text-7xl">
        {story.animals.slice(0, 3).map((a) => (
          <span key={a.id} className="float drop-shadow-lg">{a.emoji}</span>
        ))}
      </div>
      <span className="text-5xl">{story.location.emoji}</span>
    </div>
  )
}
