'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getSavedStories } from '@/lib/storage'

export default function Home() {
  const [savedCount, setSavedCount] = useState(0)

  useEffect(() => {
    setSavedCount(getSavedStories().length)
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-between px-6 py-10"
         style={{ background: 'linear-gradient(160deg, #4ECDC4 0%, #FFF8E7 40%)' }}>

      {/* Header */}
      <div className="w-full flex flex-col items-center pt-6">
        <div className="float text-7xl mb-2">🦁</div>
        <h1 className="font-display text-5xl font-bold text-white drop-shadow-md text-center leading-tight">
          Conte Gael
        </h1>
        <p className="text-white/80 text-sm mt-1 font-body">
          Contes per al Gael · Contos para o Gael
        </p>
      </div>

      {/* Decorative animals row */}
      <div className="flex gap-3 text-4xl my-4 opacity-70">
        <span className="float" style={{ animationDelay: '0s' }}>🐬</span>
        <span className="float" style={{ animationDelay: '0.3s' }}>🦊</span>
        <span className="float" style={{ animationDelay: '0.6s' }}>🦋</span>
        <span className="float" style={{ animationDelay: '0.9s' }}>🐘</span>
        <span className="float" style={{ animationDelay: '1.2s' }}>🐙</span>
      </div>

      {/* Main buttons */}
      <div className="w-full flex flex-col gap-4">
        {/* Create New Story */}
        <Link href="/criar" className="block">
          <div className="bg-white rounded-3xl p-6 shadow-lg border-2 border-[#4ECDC4]
                          active:scale-95 transition-transform cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                   style={{ background: 'linear-gradient(135deg, #4ECDC4, #A29BFE)' }}>
                ✨
              </div>
              <div>
                <div className="font-display text-2xl font-bold text-gray-800">
                  Nova História
                </div>
                <div className="font-display text-lg text-[#4ECDC4] font-semibold">
                  Nova Història
                </div>
                <div className="text-gray-500 text-sm mt-1">
                  Cria um conto mágico · Crea un conte màgic
                </div>
              </div>
            </div>
          </div>
        </Link>

        {/* Saved Stories */}
        <Link href="/salvos" className="block">
          <div className="bg-white rounded-3xl p-6 shadow-lg border-2 border-[#FFD93D]
                          active:scale-95 transition-transform cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl relative"
                   style={{ background: 'linear-gradient(135deg, #FFD93D, #FF6B6B)' }}>
                📚
                {savedCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#FF6B6B] text-white text-xs
                                   font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {savedCount}
                  </span>
                )}
              </div>
              <div>
                <div className="font-display text-2xl font-bold text-gray-800">
                  Histórias Salvas
                </div>
                <div className="font-display text-lg text-[#FFD93D] font-semibold">
                  Històries Guardades
                </div>
                <div className="text-gray-500 text-sm mt-1">
                  {savedCount === 0
                    ? 'Ainda não há histórias · Encara no hi ha contes'
                    : `${savedCount} ${savedCount === 1 ? 'história' : 'histórias'} salva${savedCount === 1 ? '' : 's'}`}
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Footer */}
      <div className="text-center mt-6">
        <p className="text-gray-500 text-xs">
          Feito com ❤️ para o Gael · Fet amb ❤️ per al Gael
        </p>
      </div>
    </div>
  )
}
