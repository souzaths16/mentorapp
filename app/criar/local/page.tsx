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
    if (!sessionStorage.getItem('gael-animals')) router.replace('/criar')
  }, [router])

  function handleNext() {
    if (!selected) return
    sessionStorage.setItem('gael-location', JSON.stringify(selected))
    router.push('/criar/tema')
  }

  return (
    <div className="min-h-screen flex flex-col page-enter" style={{ background: 'var(--cream)' }}>

      {/* Top bar */}
      <div className="flex items-center justify-between px-5 pt-8 pb-5">
        <Link href="/criar">
          <button
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-base font-bold border"
            style={{ background: 'var(--card)', borderColor: 'var(--card-border)', color: 'var(--text)' }}
          >
            ←
          </button>
        </Link>
        <StepBar current={2} />
        <div
          className="w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-black"
          style={{ background: 'var(--teal-light)', color: 'var(--teal)' }}
        >
          2/3
        </div>
      </div>

      {/* Title */}
      <div className="px-5 mb-5">
        <h2 className="text-3xl font-black" style={{ color: 'var(--text)' }}>
          On passa la història?
        </h2>
        <p className="text-sm font-semibold mt-0.5" style={{ color: 'var(--text-muted)' }}>
          Onde se passa a história?
        </p>
      </div>

      {/* Locations grid */}
      <div className="flex-1 px-5 pb-32 overflow-y-auto">
        <div className="grid grid-cols-2 gap-3">
          {locations.map((loc) => {
            const isSelected = selected?.id === loc.id
            return (
              <button
                key={loc.id}
                onClick={() => setSelected(loc)}
                className="card-press text-left p-4 rounded-3xl border"
                style={
                  isSelected
                    ? { background: 'var(--teal)', borderColor: 'var(--teal)' }
                    : { background: 'var(--card)', borderColor: 'var(--card-border)' }
                }
              >
                <div className="text-4xl mb-3">{loc.emoji}</div>
                <p
                  className="text-base font-black leading-tight"
                  style={{ color: isSelected ? 'white' : 'var(--text)' }}
                >
                  {loc.nameCa}
                </p>
                <p
                  className="text-sm font-medium mt-0.5"
                  style={{ color: isSelected ? 'rgba(255,255,255,0.8)' : 'var(--text-muted)' }}
                >
                  {loc.namePt}
                </p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Next button */}
      <div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md px-5 pb-8 pt-4"
        style={{ background: 'linear-gradient(to top, var(--cream) 70%, transparent)' }}
      >
        <button
          onClick={handleNext}
          disabled={!selected}
          className="w-full py-4 rounded-2xl font-black text-lg transition-opacity"
          style={{
            background: selected ? 'var(--teal)' : 'var(--card-border)',
            color: selected ? 'white' : 'var(--text-muted)',
          }}
        >
          Següent · Próximo →
        </button>
      </div>
    </div>
  )
}

function StepBar({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-1.5 flex-1 mx-3">
      {[1, 2, 3].map((s) => (
        <div
          key={s}
          className="h-2 flex-1 rounded-full"
          style={{ background: s <= current ? 'var(--teal)' : 'var(--card-border)' }}
        />
      ))}
    </div>
  )
}
