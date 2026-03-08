'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getSavedStories, deleteStory } from '@/lib/storage'
import { SavedStory } from '@/lib/types'

export default function SavedStories() {
  const [stories, setStories] = useState<SavedStory[]>([])
  const [filter, setFilter] = useState<'all' | 'favorites'>('all')

  useEffect(() => {
    setStories(getSavedStories())
  }, [])

  function handleDelete(id: string) {
    deleteStory(id)
    setStories(getSavedStories())
  }

  const filtered = filter === 'favorites' ? stories.filter((s) => s.favorite) : stories

  return (
    <div className="min-h-screen pb-28 page-enter" style={{ background: 'var(--cream)' }}>

      {/* Header */}
      <div className="px-5 pt-8 pb-4">
        <div className="flex items-center gap-3 mb-4">
          <Link href="/">
            <button
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-base font-bold border"
              style={{ background: 'var(--card)', borderColor: 'var(--card-border)', color: 'var(--text)' }}
            >
              ←
            </button>
          </Link>
          <div>
            <h2 className="text-2xl font-black" style={{ color: 'var(--text)' }}>
              Històries Guardades
            </h2>
            <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
              Histórias Salvas
            </p>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2">
          {[
            { key: 'all', label: `📚 Totes (${stories.length})`, labelPt: 'Todas' },
            { key: 'favorites', label: `🩷 Favorites (${stories.filter(s => s.favorite).length})`, labelPt: 'Favoritas' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as 'all' | 'favorites')}
              className="px-4 py-2 rounded-2xl text-sm font-bold transition-colors"
              style={
                filter === tab.key
                  ? { background: 'var(--teal)', color: 'white' }
                  : { background: 'var(--card)', color: 'var(--text-muted)', border: '1.5px solid var(--card-border)' }
              }
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="px-5">
        {filtered.length === 0 ? (
          <div
            className="rounded-3xl p-10 text-center border mt-2"
            style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}
          >
            <div className="text-5xl mb-3">{filter === 'favorites' ? '🩷' : '📖'}</div>
            <p className="font-black text-base" style={{ color: 'var(--text)' }}>
              {filter === 'favorites' ? 'Sem favoritas ainda' : 'Sem histórias ainda'}
            </p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              {filter === 'favorites' ? 'Encara no hi ha favorites' : 'Encara no hi ha contes'}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((story) => (
              <StoryCard key={story.id} story={story} onDelete={() => handleDelete(story.id)} />
            ))}
          </div>
        )}
      </div>

      {/* FAB */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2">
        <Link href="/criar">
          <button
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl font-black text-base shadow-lg"
            style={{ background: 'var(--teal)', color: 'white' }}
          >
            ✦ Nova Història · Nova História
          </button>
        </Link>
      </div>
    </div>
  )
}

function StoryCard({ story, onDelete }: { story: SavedStory; onDelete: () => void }) {
  const [showMenu, setShowMenu] = useState(false)

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })

  return (
    <div
      className="rounded-3xl border overflow-hidden"
      style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}
    >
      <Link href={`/historia/${story.id}`}>
        <div className="p-4 flex items-center gap-4 card-press">
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
            <div className="flex gap-1.5 mt-2 flex-wrap items-center">
              <Tag emoji={story.location.emoji} label={story.location.nameCa} />
              <Tag emoji={story.theme.emoji} label={story.theme.nameCa} />
              <span className="text-xs font-medium ml-auto" style={{ color: 'var(--text-muted)' }}>
                {formatDate(story.createdAt)}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-center gap-1 flex-shrink-0">
            <span className="text-xl">{story.favorite ? '🩷' : '🤍'}</span>
            <button
              onClick={(e) => { e.preventDefault(); setShowMenu(!showMenu) }}
              className="text-xs font-bold px-1 py-0.5 rounded"
              style={{ color: 'var(--text-muted)' }}
            >
              ···
            </button>
          </div>
        </div>
      </Link>
      {showMenu && (
        <div
          className="flex justify-end px-4 pb-3 pt-0 border-t"
          style={{ borderColor: 'var(--card-border)' }}
        >
          <button
            onClick={onDelete}
            className="text-sm font-bold px-4 py-2 rounded-xl"
            style={{ background: '#FFF0F0', color: '#E55' }}
          >
            🗑 Apagar · Esborrar
          </button>
        </div>
      )}
    </div>
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
