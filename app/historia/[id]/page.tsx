'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
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
    if (!found) { router.replace('/'); return }
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
    setIsFavorite((p) => !p)
  }

  async function handleAudio() {
    if (!story) return
    if (audioState === 'playing' && audioRef.current) { audioRef.current.pause(); setAudioState('paused'); return }
    if (audioState === 'paused' && audioRef.current) { audioRef.current.play(); setAudioState('playing'); return }
    if (audioUrlRef.current) { playAudio(audioUrlRef.current); return }

    setAudioState('loading')
    try {
      const fullText = `${story.story.titleCa}. ${story.story.sections.map((s) => s.ca).join('. ')}`
      const res = await fetch('/api/audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: fullText }),
      })
      if (!res.ok) throw new Error('audio failed')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      audioUrlRef.current = url
      playAudio(url)
    } catch { setAudioState('error') }
  }

  function playAudio(url: string) {
    const audio = new Audio(url)
    audioRef.current = audio
    audio.addEventListener('timeupdate', () => {
      if (audio.duration) setAudioProgress((audio.currentTime / audio.duration) * 100)
    })
    audio.addEventListener('ended', () => { setAudioState('idle'); setAudioProgress(0) })
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

  const { story: sd } = story
  const hasImage = !!sd.illustrationUrl

  const audioIcon = audioState === 'loading' ? '⏳' : audioState === 'playing' ? '🔊' : audioState === 'error' ? '⚠️' : '🔇'

  return (
    <div className="min-h-screen pb-16" style={{ background: '#FFF8F0' }}>

      {/* ── Top navigation ── */}
      <div className="sticky top-0 z-20 px-4 py-3" style={{ background: '#FFF8F0' }}>
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="w-11 h-11 flex items-center justify-center rounded-2xl font-bold text-lg shadow-sm"
            style={{ background: '#fff', border: '1.5px solid #E8E0D8', color: '#2C2416' }}
          >
            ←
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={handleAudio}
              disabled={audioState === 'loading'}
              className="w-11 h-11 flex items-center justify-center rounded-2xl text-lg shadow-sm active:scale-90 transition-transform"
              style={{ background: '#fff', border: '1.5px solid #E8E0D8' }}
            >
              {audioIcon}
            </button>
            <div
              className="h-11 flex items-center gap-1 px-3 rounded-2xl text-sm font-bold shadow-sm"
              style={{ background: '#fff', border: '1.5px solid #E8E0D8', color: '#2C2416' }}
            >
              <span>🌐</span><span>🇪🇸</span><span>CA</span>
            </div>
            <button
              onClick={handleFavorite}
              className="w-11 h-11 flex items-center justify-center rounded-2xl text-xl shadow-sm active:scale-90 transition-transform"
              style={{ background: '#fff', border: '1.5px solid #E8E0D8' }}
            >
              {isFavorite ? '❤️' : '🤍'}
            </button>
          </div>
        </div>
        {(audioState === 'playing' || audioState === 'paused') && (
          <div className="mt-2 h-1 rounded-full overflow-hidden" style={{ background: '#E8E0D8' }}>
            <div
              className="h-full rounded-full audio-bar"
              style={{ width: `${audioProgress}%`, background: 'linear-gradient(90deg, #4BB5AE, #A29BFE)' }}
            />
          </div>
        )}
      </div>

      {/* ── Header: emojis + titles + chips ── */}
      <div className="px-5 pt-2 pb-5">
        <div className="flex gap-2 text-5xl mb-3">
          {story.animals.map((a) => <span key={a.id}>{a.emoji}</span>)}
        </div>
        <h1 className="font-black text-2xl leading-tight" style={{ color: '#2C2416' }}>
          {sd.titleCa}
        </h1>
        <p className="text-base mt-1" style={{ color: '#8B7355' }}>{sd.titlePt}</p>
        <div className="flex flex-wrap gap-2 mt-3">
          <Chip emoji="✨" text={story.location.nameCa} />
          <Chip emoji={story.theme.emoji} text={story.theme.nameCa} />
        </div>
      </div>

      {/* ── Chapter cards ── */}
      <div className="px-4 space-y-5">
        {sd.sections.map((section, index) => (
          <div
            key={index}
            className="rounded-3xl overflow-hidden shadow-sm"
            style={{ background: '#fff', border: '1.5px solid #EDE5DC' }}
          >
            {/* Illustration — top of card */}
            <div className="w-full" style={{ aspectRatio: '16/9', position: 'relative', background: '#F5EFE8' }}>
              {hasImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={sd.illustrationUrl}
                  alt={sd.titleCa}
                  className="w-full h-full object-cover"
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                  <div className="flex gap-3 text-6xl">
                    {story.animals.map((a) => <span key={a.id} className="float">{a.emoji}</span>)}
                  </div>
                  <span className="text-4xl">{story.location.emoji}</span>
                </div>
              )}
            </div>

            {/* Chapter label */}
            <div className="px-4 pt-4 pb-1">
              <span
                className="text-xs font-black tracking-widest"
                style={{ color: '#B0A090', letterSpacing: '0.12em' }}
              >
                CAPÍTOL {index + 1} · CAPÍTULO {index + 1}
              </span>
            </div>

            {/* Bilingual text — two columns */}
            <div className="grid grid-cols-2 divide-x px-0 pb-4" style={{ borderColor: '#EDE5DC' }}>
              <div className="px-4 pt-3">
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-sm">🇧🇷</span>
                  <span className="text-[10px] font-black tracking-widest" style={{ color: '#8B7355' }}>PORTUGUÊS</span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: '#3D3020' }}>{section.pt}</p>
              </div>
              <div className="px-4 pt-3">
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-sm">🇪🇸</span>
                  <span className="text-[10px] font-black tracking-widest" style={{ color: '#8B7355' }}>CATALÀ</span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: '#3D3020' }}>{section.ca}</p>
              </div>
            </div>
          </div>
        ))}

        {/* End marker */}
        <div className="text-center py-8">
          <div className="text-5xl mb-2">🌟</div>
          <p className="font-black text-base" style={{ color: '#B0A090' }}>Fim · Fi</p>
        </div>

        {/* Bottom actions */}
        <div className="flex gap-3 pb-4">
          <button
            onClick={handleFavorite}
            className="flex-1 py-3.5 rounded-2xl font-black text-sm transition-all active:scale-95"
            style={
              isFavorite
                ? { background: '#FFF0F0', border: '2px solid #FFB3B3', color: '#E05555' }
                : { background: '#fff', border: '2px solid #EDE5DC', color: '#8B7355' }
            }
          >
            {isFavorite ? '❤️ Guardada' : '🤍 Guardar · Desar'}
          </button>
          <Link href="/criar" className="flex-1">
            <button
              className="w-full py-3.5 rounded-2xl font-black text-sm text-white active:scale-95 transition-transform"
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
