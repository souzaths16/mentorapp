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

  const formatDate = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  return (
    <div className="min-h-screen" style={{ background: '#FFF8E7' }}>
      {/* Header */}
      <div className="px-5 pt-8 pb-4"
           style={{ background: 'linear-gradient(160deg, #FFD93D 0%, #FFF8E7 60%)' }}>
        <div className="flex items-center gap-3 mb-4">
          <Link href="/" className="w-9 h-9 bg-white/70 rounded-full flex items-center justify-center shadow text-lg">
            ←
          </Link>
          <div>
            <h2 className="font-display text-2xl font-bold text-gray-800">Histórias Salvas</h2>
            <p className="font-display text-base text-amber-500">Històries Guardades</p>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-full font-semibold text-sm transition-all ${
              filter === 'all'
                ? 'bg-[#FFD93D] text-gray-800 shadow-md'
                : 'bg-white text-gray-500 border border-gray-200'
            }`}
          >
            📚 Todas ({stories.length})
          </button>
          <button
            onClick={() => setFilter('favorites')}
            className={`px-4 py-2 rounded-full font-semibold text-sm transition-all ${
              filter === 'favorites'
                ? 'bg-[#FFD93D] text-gray-800 shadow-md'
                : 'bg-white text-gray-500 border border-gray-200'
            }`}
          >
            ⭐ Favoritas ({stories.filter((s) => s.favorite).length})
          </button>
        </div>
      </div>

      {/* Stories list */}
      <div className="px-4 py-4">
        {filtered.length === 0 ? (
          <EmptyState filter={filter} />
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((story) => (
              <StoryCard
                key={story.id}
                story={story}
                onDelete={() => handleDelete(story.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create new button */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2">
        <Link href="/criar">
          <button className="bg-[#4ECDC4] text-white font-display text-lg font-bold
                             py-3 px-8 rounded-full shadow-lg active:scale-95 transition-transform
                             flex items-center gap-2">
            ✨ Nova História
          </button>
        </Link>
      </div>
    </div>
  )
}

function StoryCard({ story, onDelete }: { story: SavedStory; onDelete: () => void }) {
  const [showDelete, setShowDelete] = useState(false)
  const formatDate = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Color bar */}
      <div
        className="h-2"
        style={{
          background: 'linear-gradient(90deg, #4ECDC4, #A29BFE, #FFD93D)',
        }}
      />
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <Link href={`/historia/${story.id}`} className="flex-1">
            <div>
              {/* Animals */}
              <div className="flex gap-1 text-2xl mb-2">
                {story.animals.map((a) => (
                  <span key={a.id}>{a.emoji}</span>
                ))}
                <span className="ml-1">{story.location.emoji}</span>
              </div>

              <h3 className="font-display text-lg font-bold text-gray-800 leading-tight">
                {story.story.titlePt}
              </h3>
              <p className="font-display text-sm text-[#4ECDC4] font-semibold">
                {story.story.titleCa}
              </p>

              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs bg-amber-50 text-amber-600 font-semibold px-2 py-0.5 rounded-full">
                  {story.theme.emoji} {story.theme.namePt}
                </span>
                <span className="text-xs text-gray-400">{formatDate(story.createdAt)}</span>
                {story.favorite && <span className="text-sm">⭐</span>}
              </div>
            </div>
          </Link>

          <button
            onClick={() => setShowDelete(!showDelete)}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center
                       text-gray-400 text-sm flex-shrink-0 active:scale-90 transition-transform"
          >
            ···
          </button>
        </div>

        {showDelete && (
          <div className="mt-3 pt-3 border-t border-gray-100 flex justify-end">
            <button
              onClick={onDelete}
              className="text-red-400 text-sm font-semibold px-3 py-1.5 rounded-xl
                         bg-red-50 active:scale-95 transition-transform"
            >
              🗑 Apagar · Esborrar
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function EmptyState({ filter }: { filter: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-6xl mb-4 float">
        {filter === 'favorites' ? '⭐' : '📖'}
      </div>
      <p className="font-display text-xl text-gray-600 mb-1">
        {filter === 'favorites' ? 'Sem favoritas ainda' : 'Sem histórias ainda'}
      </p>
      <p className="font-display text-base text-[#4ECDC4]">
        {filter === 'favorites' ? 'Encara no hi ha favorits' : 'Encara no hi ha contes'}
      </p>
      <p className="text-gray-400 text-sm mt-3">
        {filter === 'favorites'
          ? 'Marca uma história como favorita ⭐'
          : 'Cria o primeiro conto do Gael! ✨'}
      </p>
    </div>
  )
}
