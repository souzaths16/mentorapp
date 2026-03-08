'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { themes } from '@/lib/data'
import { Theme } from '@/lib/types'

export default function ChooseTheme() {
  const router = useRouter()
  const [selected, setSelected] = useState<Theme | null>(null)

  useEffect(() => {
    const animals = sessionStorage.getItem('gael-animals')
    const location = sessionStorage.getItem('gael-location')
    if (!animals || !location) router.replace('/criar')
  }, [router])

  function handleGenerate() {
    if (!selected) return
    sessionStorage.setItem('gael-theme', JSON.stringify(selected))
    router.push('/criar/gerar')
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#FFF8E7' }}>
      {/* Header */}
      <div className="px-5 pt-8 pb-4"
           style={{ background: 'linear-gradient(160deg, #FFD93D 0%, #FFF8E7 60%)' }}>
        <div className="flex items-center gap-3 mb-4">
          <Link href="/criar/local" className="w-9 h-9 bg-white/70 rounded-full flex items-center justify-center shadow text-lg">
            ←
          </Link>
          <StepIndicator current={3} />
        </div>
        <h2 className="font-display text-3xl font-bold text-gray-800">
          O que vamos aprender?
        </h2>
        <p className="font-display text-xl text-amber-500 font-semibold">
          Què aprendrem?
        </p>
        <p className="text-gray-500 text-sm mt-1">
          Escolha o tema educacional · Tria el tema educatiu
        </p>
      </div>

      {/* Themes list */}
      <div className="flex-1 px-4 py-4 pb-32 overflow-y-auto">
        <div className="flex flex-col gap-3">
          {themes.map((theme) => {
            const isSelected = selected?.id === theme.id
            return (
              <button
                key={theme.id}
                onClick={() => setSelected(theme)}
                className={`flex items-center gap-4 p-4 rounded-2xl border-2 shadow-sm
                            transition-all active:scale-[0.98] text-left ${
                  isSelected
                    ? 'bg-amber-50 border-[#FFD93D]'
                    : 'bg-white border-gray-200'
                }`}
              >
                <span className="text-4xl flex-shrink-0">{theme.emoji}</span>
                <div className="flex-1">
                  <p className="font-bold text-gray-800">{theme.namePt}</p>
                  <p className="text-sm text-amber-500 font-semibold">{theme.nameCa}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{theme.descPt}</p>
                </div>
                {isSelected && (
                  <div className="w-6 h-6 bg-[#FFD93D] rounded-full flex items-center justify-center
                                  text-white text-xs font-bold flex-shrink-0">
                    ✓
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Generate button */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md px-5 pb-8 pt-4
                      bg-gradient-to-t from-[#FFF8E7] via-[#FFF8E7]">
        <button
          onClick={handleGenerate}
          disabled={!selected}
          className={`w-full py-4 rounded-2xl font-display text-xl font-bold shadow-lg
                      transition-all active:scale-95 ${
            selected
              ? 'text-white'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
          style={selected ? { background: 'linear-gradient(135deg, #FFD93D, #FF6B6B)' } : {}}
        >
          {selected ? '✨ Criar a História · Crear el Conte ✨' : 'Escolha um tema · Tria un tema'}
        </button>
      </div>
    </div>
  )
}

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3].map((step) => (
        <div
          key={step}
          className={`rounded-full transition-all ${
            step === current
              ? 'w-8 h-3 bg-[#FFD93D]'
              : step < current
              ? 'w-3 h-3 bg-[#FFD93D]'
              : 'w-3 h-3 bg-gray-300'
          }`}
        />
      ))}
    </div>
  )
}
