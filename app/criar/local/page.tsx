'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { locations } from '@/lib/data'
import { Location } from '@/lib/types'

export default function ChooseLocation() {
  const router = useRouter()
  const [selected, setSelected] = useState<Location | null>(null)

  useEffect(() => {
    // If no animals selected, go back
    const animals = sessionStorage.getItem('gael-animals')
    if (!animals) router.replace('/criar')
  }, [router])

  function handleNext() {
    if (!selected) return
    sessionStorage.setItem('gael-location', JSON.stringify(selected))
    router.push('/criar/tema')
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#FFF8E7' }}>
      {/* Header */}
      <div className="px-5 pt-8 pb-4" style={{ background: 'linear-gradient(160deg, #4ECDC4 0%, #FFF8E7 60%)' }}>
        <div className="flex items-center gap-3 mb-4">
          <Link href="/criar" className="w-9 h-9 bg-white/70 rounded-full flex items-center justify-center shadow text-lg">
            ←
          </Link>
          <StepIndicator current={2} />
        </div>
        <h2 className="font-display text-3xl font-bold text-gray-800">
          Onde acontece?
        </h2>
        <p className="font-display text-xl text-[#4ECDC4] font-semibold">
          On passa la història?
        </p>
        <p className="text-gray-500 text-sm mt-1">
          Escolha o cenário · Tria l'escenari
        </p>
      </div>

      {/* Locations grid */}
      <div className="flex-1 px-4 py-4 pb-32 overflow-y-auto">
        <div className="grid grid-cols-2 gap-3">
          {locations.map((loc) => {
            const isSelected = selected?.id === loc.id
            return (
              <button
                key={loc.id}
                onClick={() => setSelected(loc)}
                className={`animal-card relative flex flex-col items-center justify-center
                            p-5 rounded-2xl border-2 shadow-sm transition-all text-center ${
                  isSelected
                    ? 'bg-teal-50 border-[#4ECDC4] scale-95'
                    : 'bg-white border-gray-200 active:scale-95'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-[#4ECDC4] rounded-full
                                  flex items-center justify-center text-white text-xs font-bold">
                    ✓
                  </div>
                )}
                <span className="text-5xl mb-2">{loc.emoji}</span>
                <p className="text-sm font-bold text-gray-800 leading-tight">{loc.namePt}</p>
                <p className="text-xs text-[#4ECDC4] leading-tight mt-0.5">{loc.nameCa}</p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Next button */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md px-5 pb-8 pt-4
                      bg-gradient-to-t from-[#FFF8E7] via-[#FFF8E7]">
        <button
          onClick={handleNext}
          disabled={!selected}
          className={`w-full py-4 rounded-2xl font-display text-xl font-bold shadow-lg
                      transition-all active:scale-95 ${
            selected
              ? 'bg-[#4ECDC4] text-white'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {selected ? `${selected.emoji} Próximo · Següent →` : 'Escolha um local · Tria un lloc'}
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
              ? 'w-8 h-3 bg-[#4ECDC4]'
              : step < current
              ? 'w-3 h-3 bg-[#4ECDC4]'
              : 'w-3 h-3 bg-gray-300'
          }`}
        />
      ))}
    </div>
  )
}
