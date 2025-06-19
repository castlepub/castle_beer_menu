'use client'

import { useEffect, useState } from 'react'
import useSWR from 'swr'
import Image from 'next/image'

interface Beer {
  id: number
  tapNumber: number
  name: string
  brewery: string
  abv: string
  style: string
  price: string
  logo?: string
  status: string
  tags?: string
  startDate: string
  endDate?: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function DisplayPage({ params }: { params: { screen: string } }) {
  const screen = parseInt(params.screen)
  const { data: beers, error } = useSWR<Beer[]>('/api/beers', fetcher, {
    refreshInterval: 30000, // Auto-refresh every 30 seconds
  })

  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Check for dark mode preference
    const darkMode = localStorage.getItem('darkMode') === 'true' || 
                     window.matchMedia('(prefers-color-scheme: dark)').matches
    setIsDark(darkMode)
    
    if (darkMode) {
      document.documentElement.classList.add('dark')
    }
  }, [])

  if (error) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Error Loading Menu</h1>
          <p className="text-muted-foreground">Please refresh the page or contact staff</p>
        </div>
      </div>
    )
  }

  if (!beers) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-xl text-muted-foreground">Loading tap menu...</p>
        </div>
      </div>
    )
  }

  // Filter beers based on screen (1-10 or 11-20)
  const startTap = screen === 1 ? 1 : 11
  const endTap = screen === 1 ? 10 : 20
  const screenBeers = beers.filter(beer => beer.tapNumber >= startTap && beer.tapNumber <= endTap)

  const toggleDarkMode = () => {
    const newDarkMode = !isDark
    setIsDark(newDarkMode)
    localStorage.setItem('darkMode', newDarkMode.toString())
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground tv-display">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-6 shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold">🏰 The Castle Tap Menu</h1>
            <p className="text-xl opacity-90">
              Taps {startTap}-{endTap} • Live Updates
            </p>
          </div>
          <button
            onClick={toggleDarkMode}
            className="p-2 bg-primary-foreground text-primary rounded-lg hover:opacity-80 transition-opacity"
          >
            {isDark ? '☀️' : '🌙'}
          </button>
        </div>
      </div>

      {/* Beer Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-7xl mx-auto">
          {Array.from({ length: 10 }, (_, index) => {
            const tapNumber = startTap + index
            const beer = screenBeers.find(b => b.tapNumber === tapNumber)
            
            return (
              <div
                key={tapNumber}
                className={`beer-card p-6 rounded-xl border-2 shadow-lg ${
                  beer 
                    ? beer.status === 'keg_empty' 
                      ? 'bg-muted border-muted keg-empty' 
                      : 'bg-card border-border hover:border-primary'
                    : 'bg-muted border-muted opacity-50'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Tap Number */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg">
                      {tapNumber}
                    </div>
                  </div>

                  {/* Beer Logo */}
                  <div className="flex-shrink-0">
                    {beer?.logo ? (
                      <Image
                        src={beer.logo}
                        alt={`${beer.name} logo`}
                        width={64}
                        height={64}
                        className="beer-logo"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                        }}
                      />
                    ) : (
                      <div className="w-16 h-16 bg-muted border-2 border-border rounded-full flex items-center justify-center">
                        🍺
                      </div>
                    )}
                  </div>

                  {/* Beer Info */}
                  <div className="flex-1 min-w-0">
                    {beer ? (
                      <>
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-xl font-bold text-foreground truncate">
                              {beer.name}
                            </h3>
                            <p className="text-lg text-muted-foreground">
                              {beer.brewery}
                            </p>
                          </div>
                          {beer.tags && (
                            <div className="flex gap-1 ml-2">
                              {JSON.parse(beer.tags).map((tag: string) => (
                                <span
                                  key={tag}
                                  className="px-2 py-1 bg-accent text-accent-foreground text-xs font-semibold rounded-full"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">
                            <span className="font-medium">{beer.style}</span> • {beer.abv}
                          </p>
                          <p className="text-lg font-semibold text-primary">
                            {beer.price}
                          </p>
                        </div>

                        {beer.status === 'keg_empty' && (
                          <p className="text-sm text-destructive font-medium mt-2">
                            🚫 Keg Empty
                          </p>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-muted-foreground">No beer on tap</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center p-4 text-sm text-muted-foreground">
        <p>Updated: {new Date().toLocaleTimeString()} • Auto-refresh every 30 seconds</p>
      </div>
    </div>
  )
} 