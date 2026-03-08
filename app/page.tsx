'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getSavedStories } from '@/lib/storage'
import { SavedStory } from '@/lib/types'

export default function Home() {
  const [stories, setStories] = useState<SavedStory[]>([])

  useEffect(() => {
    setStories(getSavedStories())
  }, [])

  return (
    <div className="min-h-screen px-5 pt-10 pb-10 page-enter" style={{ background: 'var(--cream)' }}>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-4xl font-black leading-tight" style={{ color: 'var(--text)' }}>
            Històries <span style={{ color: 'var(--teal)' }}>Màgiques</span>
          </h1>
          <p className="text-sm font-semibold mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Histórias Mágicas ✨
          </p>
        </div>
        <Link href="/criar">
          <button
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl font-black shadow-sm"
            style={{ background: 'var(--teal-light)', color: 'var(--teal)' }}
          >
            +
          </button>
        </Link>
      </div>

      {/* Create CTA */}
      <Link href="/criar">
        <div
          className="card-press rounded-3xl p-5 mb-8 flex items-center gap-4 shadow-sm"
          style={{ background: 'var(--teal)' }}
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
            style={{ background: 'rgba(255,255,255,0.25)' }}
          >
            +
          </div>
          <div>
            <p className="text-white font-black text-xl leading-tight">Nova Història</p>
            <p className="font-medium text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>
              Nova História · Crea una aventura
            </p>
          </div>
        </div>
      </Link>

      {/* Saved stories */}
      <div>
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-xl">🩷</span>
          <h2 className="text-2xl font-black" style={{ color: 'var(--text)' }}>
            Històries Guardades
          </h2>
        </div>
        <p className="text-sm font-medium mb-4" style={{ color: 'var(--text-muted)' }}>
          Histórias Salvas
        </p>

        {stories.length === 0 ? (
          <div
            className="rounded-3xl p-8 text-center border"
            style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}
          >
            <div className="text-5xl mb-3 float">📖</div>
            <p className="font-black text-base" style={{ color: 'var(--text)' }}>Ainda sem histórias</p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Encara no hi ha contes</p>
            <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>Cria o primeiro conto do Gael! ✨</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {stories.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function StoryCard({ story }: { story: SavedStory }) {
  return (
    <Link href={`/historia/${story.id}`}>
      <div
        className="card-press rounded-3xl p-4 flex items-center gap-4 border"
        style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
          style={{ background: 'var(--peach)' }}
        >
          {story.animals[0]?.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-black text-base leading-tight truncate" style={{ color: 'var(--text)' }}>
            {story.story.titleCa}
          </p>
          <p className="text-sm font-medium truncate mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {story.story.titlePt}
          </p>
          <div className="flex gap-1.5 mt-2 flex-wrap">
            <Tag emoji={story.location.emoji} label={story.location.nameCa} />
            <Tag emoji={story.theme.emoji} label={story.theme.nameCa} />
          </div>
        </div>
        <span className="text-xl flex-shrink-0">{story.favorite ? '🩷' : '🤍'}</span>
      </div>
    </Link>
  )
}

function Tag({ emoji, label }: { emoji: string; label: string }) {
  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full"
      style={{ background: 'var(--cream)', color: 'var(--text-muted)', border: '1px solid var(--card-border)' }}
    >
      {emoji} {label}
    </span>
  )
}
