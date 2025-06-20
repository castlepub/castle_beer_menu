'use client'

import { useState, useEffect } from 'react'
import useSWR from 'swr'
import Image from 'next/image'
import { BeerLogo } from '@/components/ui/beer-logo'

interface Beer {
  id: number
  tapNumber: number
  name: string
  brewery: string
  style: string
  abv: string
  price: string
  logo?: string
  status: string
  tags?: string
  location?: string
  isCore: boolean
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function DisplayPage({ params }: { params: { screen: string } }) {
  const [isDark, setIsDark] = useState(true)
  const [changingTextIndex, setChangingTextIndex] = useState(0)
  const screenNumber = parseInt(params.screen)

  const { data: beers, error } = useSWR<Beer[]>('/api/beers', fetcher, {
    refreshInterval: 30000, // Auto-refresh every 30 seconds
    onSuccess: (data) => {
      console.log('Fetched beers:', data)
    },
    onError: (err) => {
      console.error('Error fetching beers:', err)
    }
  })

  const toggleDarkMode = () => {
    setIsDark(!isDark)
  }

  // Changing text for display 1
  const changingTexts = [
    "Fresh craft beers on tap!",
    "Try our seasonal specials",
    "Local and imported favorites",
    "Perfect pints every time"
  ]

  // Rotate changing text every 8 seconds (increased from 5)
  useEffect(() => {
    const interval = setInterval(() => {
      setChangingTextIndex((prev) => (prev + 1) % changingTexts.length)
    }, 8000)
    return () => clearInterval(interval)
  }, [changingTexts.length])

  // Ensure beers is an array before filtering
  const beersArray = Array.isArray(beers) ? beers : []
  console.log('beersArray:', beersArray)

  // Filter beers based on screen number
  const screenBeers = beersArray.filter((beer) => {
    if (screenNumber === 1) {
      return beer.tapNumber >= 1 && beer.tapNumber <= 10
    } else if (screenNumber === 2) {
      return beer.tapNumber >= 11 && beer.tapNumber <= 20
    }
    return false
  })

  // Separate core and rotating beers (show all beers, including empty ones)
  const coreBeers = screenBeers.filter((beer) => beer.isCore)
  const rotatingBeers = screenBeers.filter((beer) => !beer.isCore)

  // Debug logging
  console.log(`Screen ${screenNumber}:`)
  console.log('All beers for this screen:', screenBeers.map(b => `Tap ${b.tapNumber}: ${b.name} (${b.status})`))
  console.log('Available beers (non-empty):', screenBeers.map(b => `Tap ${b.tapNumber}: ${b.name}`))
  console.log('Core beers:', coreBeers.map(b => `Tap ${b.tapNumber}: ${b.name}`))
  console.log('Rotating beers:', rotatingBeers.map(b => `Tap ${b.tapNumber}: ${b.name}`))

  // Calculate the starting tap number for rotating beers on this screen
  let rotatingStart = 1
  if (screenNumber > 1) {
    // Count all rotating beers on previous screens
    const previousRotating = beersArray.filter(
      (beer) => !beer.isCore && beer.tapNumber < (screenNumber - 1) * 10 + 1
    ).length
    rotatingStart = previousRotating + 1
  }

  if (error) {
    console.error('DisplayPage error:', error)
    return (
      <div className="tv-display p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-4 text-center">Error loading menu</h1>
          <p className="text-center text-muted-foreground">Please try refreshing the page</p>
        </div>
      </div>
    )
  }

  if (!beers) {
    console.log('No beers loaded yet, beers:', beers)
    return (
      <div className="tv-display p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-4 text-center">Loading menu...</h1>
        </div>
      </div>
    )
  }

  return (
    <div className={`tv-display ${isDark ? 'dark' : ''}`}>
      {/* Header */}
      <div className="header-section">
        <div className="flex justify-between items-center w-full px-8">
          <h1 className="text-4xl font-bold text-center flex-1">ON TAP</h1>
          <button
            onClick={toggleDarkMode}
            className="p-2 bg-primary/10 text-primary/60 rounded-lg hover:bg-primary/20 transition-colors"
          >
            {isDark ? '☀️' : '🌙'}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="content-section">
        {/* Core Range Beers */}
        {coreBeers.length > 0 && (
          <section className="menu-section">
            <h2 className="menu-section-title">CORE RANGE BEER</h2>
            
            {/* First row: Castle Brew, Hefeweizen, Pale Ale, Cider */}
            <div className="grid mb-4">
              {coreBeers.filter(beer => 
                beer.tapNumber === 1 || // Castle Brew Pils
                beer.tapNumber === 2 || // Hefeweizen
                beer.tapNumber === 3 || // Pale Ale
                beer.tapNumber === 4    // Cider
              ).map((beer) => (
                <div key={beer.id} className={`beer-card ${beer.status === 'keg_empty' ? 'opacity-60' : ''}`}>
                  <div className="beer-card-header">
                    <div className="beer-logo">
                      <BeerLogo 
                        src={beer.logo} 
                        alt={`${beer.brewery} logo`}
                        size={44}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className={`beer-name ${beer.status === 'keg_empty' ? 'line-through' : ''}`}>
                        {beer.name}
                      </h3>
                      <p className={`beer-brewery ${beer.status === 'keg_empty' ? 'line-through' : ''}`}>
                        {beer.brewery}
                      </p>
                    </div>
                  </div>
                  <div className="beer-card-content">
                    {beer.status === 'keg_empty' ? (
                      <div className="beer-info">
                        <p className="beer-details text-primary/80 font-medium">
                          keg empty :( new beer coming :)
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="beer-info">
                          <p className="beer-details">{beer.style} • {beer.abv}</p>
                          <p className="beer-details font-semibold">{beer.price}</p>
                        </div>
                        {beer.location && (
                          <div className="beer-meta">
                            <p className="beer-details text-primary/80 font-medium">{beer.location}</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Second row: Stout | Castle Logo | Radler */}
            <div className="flex justify-between items-stretch gap-4">
              {/* Stout - Left */}
              {(() => {
                const stout = coreBeers.find(beer => beer.tapNumber === 5)
                return stout && (
                  <div className={`beer-card flex-1 max-w-xs ${stout.status === 'keg_empty' ? 'opacity-60' : ''}`}>
                    <div className="beer-card-header">
                      <div className="beer-logo">
                        <BeerLogo 
                          src={stout.logo} 
                          alt={`${stout.brewery} logo`}
                          size={44}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className={`beer-name ${stout.status === 'keg_empty' ? 'line-through' : ''}`}>
                          {stout.name}
                        </h3>
                        <p className={`beer-brewery ${stout.status === 'keg_empty' ? 'line-through' : ''}`}>
                          {stout.brewery}
                        </p>
                      </div>
                    </div>
                    <div className="beer-card-content">
                      {stout.status === 'keg_empty' ? (
                        <div className="beer-info">
                          <p className="beer-details text-primary/80 font-medium">
                            keg empty :( new beer coming :)
                          </p>
                        </div>
                      ) : (
                        <>
                          <div className="beer-info">
                            <p className="beer-details">{stout.style} • {stout.abv}</p>
                            <p className="beer-details font-semibold">{stout.price}</p>
                          </div>
                          {stout.location && (
                            <div className="beer-meta">
                              <p className="beer-details text-primary/80 font-medium">{stout.location}</p>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )
              })()}
              
              {/* Castle Logo - Middle */}
              <div className="flex items-center justify-center flex-1">
                <Image
                  src="/static/castlologo5iiiii.png"
                  alt="The Castle Logo"
                  width={350}
                  height={350}
                  className="max-w-full h-auto"
                  priority
                />
              </div>
              
              {/* Radler - Right */}
              {(() => {
                const radler = coreBeers.find(beer => beer.tapNumber === 6)
                return radler && (
                  <div className={`beer-card flex-1 max-w-xs ${radler.status === 'keg_empty' ? 'opacity-60' : ''}`}>
                    <div className="beer-card-header">
                      <div className="beer-logo">
                        <BeerLogo 
                          src={radler.logo} 
                          alt={`${radler.brewery} logo`}
                          size={44}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className={`beer-name ${radler.status === 'keg_empty' ? 'line-through' : ''}`}>
                          {radler.name}
                        </h3>
                        <p className={`beer-brewery ${radler.status === 'keg_empty' ? 'line-through' : ''}`}>
                          {radler.brewery}
                        </p>
                      </div>
                    </div>
                    <div className="beer-card-content">
                      {radler.status === 'keg_empty' ? (
                        <div className="beer-info">
                          <p className="beer-details text-primary/80 font-medium">
                            keg empty :( new beer coming :)
                          </p>
                        </div>
                      ) : (
                        <>
                          <div className="beer-info">
                            <p className="beer-details">{radler.style} • {radler.abv}</p>
                            <p className="beer-details font-semibold">{radler.price}</p>
                          </div>
                          {radler.location && (
                            <div className="beer-meta">
                              <p className="beer-details text-primary/80 font-medium">{radler.location}</p>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )
              })()}
            </div>
          </section>
        )}

        {/* Rotating Beers */}
        {rotatingBeers.length > 0 && (
          <section className="menu-section">
            <h2 className="menu-section-title">ROTATING BEER</h2>
            <div className="grid">
              {rotatingBeers.map((beer, idx) => (
                <div key={beer.id} className={`beer-card ${beer.status === 'keg_empty' ? 'opacity-60' : ''}`}>
                  <div className="beer-card-header">
                    <div className="beer-logo">
                      <BeerLogo 
                        src={beer.logo} 
                        alt={`${beer.brewery} logo`}
                        size={44}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="tap-number">TAP {rotatingStart + idx}</span>
                        {beer.tags && (
                          <span className="inline-block px-2 py-0.5 text-xs font-bold bg-accent text-accent-foreground rounded uppercase tracking-wider">
                            {JSON.parse(beer.tags)[0]}
                          </span>
                        )}
                      </div>
                      <h3 className={`beer-name ${beer.status === 'keg_empty' ? 'line-through' : ''}`}>
                        {beer.name}
                      </h3>
                      <p className={`beer-brewery ${beer.status === 'keg_empty' ? 'line-through' : ''}`}>
                        {beer.brewery}
                      </p>
                    </div>
                  </div>
                  <div className="beer-card-content">
                    {beer.status === 'keg_empty' ? (
                      <div className="beer-info">
                        <p className="beer-details text-primary/80 font-medium">
                          keg empty :( new beer coming :)
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="beer-info">
                          <p className="beer-details">{beer.style} • {beer.abv}</p>
                          <p className="beer-details font-semibold">{beer.price}</p>
                        </div>
                        {beer.location && (
                          <div className="beer-meta">
                            <p className="beer-details text-primary/80 font-medium">{beer.location}</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Additional content based on screen */}
        {screenNumber === 1 && (
          <div className="mt-4 text-center">
            <p className="text-4xl font-semibold text-primary/80 animate-pulse">
              {changingTexts[changingTextIndex]}
            </p>
          </div>
        )}

        {screenNumber === 2 && (
          <div className="mt-4 text-center">
            <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
              <h3 className="text-2xl font-bold text-primary mb-2">JOIN OUR LOYALTY PROGRAM</h3>
              <p className="text-lg text-muted-foreground">
                Earn points with every pint • Exclusive member discounts
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Ask our staff for details
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 