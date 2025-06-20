'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { BeerLogo } from '@/components/ui/beer-logo'
import { TagIcon } from '@/components/ui/tag-icon'
import useSWR, { mutate } from 'swr'
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
  isCore: boolean
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loginForm, setLoginForm] = useState({ username: '', password: '' })
  const [beerForm, setBeerForm] = useState({
    id: '',
    tapNumber: '',
    name: '',
    brewery: '',
    abv: '',
    style: '',
    price: '',
    logo: '',
    status: 'on_tap',
    tags: '',
    isCore: false
  })
  const [isEditing, setIsEditing] = useState(false)

  const { data: beers, error } = useSWR<Beer[]>(
    isLoggedIn ? '/api/beers' : null,
    fetcher,
    { refreshInterval: 30000 }
  )

  useEffect(() => {
    // Check if already logged in (cookie-based)
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/check')
      if (response.ok) {
        setIsLoggedIn(true)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      })

      if (response.ok) {
        setIsLoggedIn(true)
        setLoginForm({ username: '', password: '' })
      } else {
        const error = await response.json()
        alert(error.error || 'Login failed')
      }
    } catch (error) {
      console.error('Login error:', error)
      alert('Login failed')
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/login', { method: 'DELETE' })
      setIsLoggedIn(false)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const handleBeerSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const method = isEditing ? 'PUT' : 'POST'
      const response = await fetch('/api/beers', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...beerForm,
          tags: beerForm.tags ? beerForm.tags.split(',').map(t => t.trim()) : []
        })
      })

      if (response.ok) {
        setBeerForm({
          id: '',
          tapNumber: '',
          name: '',
          brewery: '',
          abv: '',
          style: '',
          price: '',
          logo: '',
          status: 'on_tap',
          tags: '',
          isCore: false
        })
        setIsEditing(false)
        mutate('/api/beers')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to save beer')
      }
    } catch (error) {
      console.error('Save error:', error)
      alert('Failed to save beer')
    }
  }

  const handleEdit = (beer: Beer) => {
    setBeerForm({
      id: beer.id.toString(),
      tapNumber: beer.tapNumber.toString(),
      name: beer.name,
      brewery: beer.brewery,
      abv: beer.abv,
      style: beer.style,
      price: beer.price,
      logo: beer.logo || '',
      status: beer.status,
      tags: beer.tags ? JSON.parse(beer.tags).join(', ') : '',
      isCore: beer.isCore
    })
    setIsEditing(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this beer?')) return

    try {
      const response = await fetch(`/api/beers?id=${id}`, { method: 'DELETE' })
      if (response.ok) {
        mutate('/api/beers')
      } else {
        alert('Failed to delete beer')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Failed to delete beer')
    }
  }

  const handleToggleEmpty = async (beer: Beer) => {
    const newStatus = beer.status === 'keg_empty' ? 'on_tap' : 'keg_empty'
    const action = newStatus === 'keg_empty' ? 'mark as empty' : 'mark as on tap'
    
    if (!confirm(`Are you sure you want to ${action} for ${beer.name}?`)) return

    try {
      const response = await fetch('/api/beers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...beer,
          status: newStatus,
          tags: beer.tags ? JSON.parse(beer.tags) : []
        })
      })

      if (response.ok) {
        mutate('/api/beers')
      } else {
        alert('Failed to update beer status')
      }
    } catch (error) {
      console.error('Status update error:', error)
      alert('Failed to update beer status')
    }
  }

  // Function to get the display identifier for a beer
  const getBeerIdentifier = (beer: Beer) => {
    if (beer.isCore) {
      // Core beers get letters based on their tap number (0-5)
      const coreLetters = ['A', 'B', 'C', 'D', 'E', 'F']
      const coreNames = ['Castle Brew Pils', 'Hefeweizen', 'Pale Ale', 'Cider', 'Stout', 'Radler']
      const index = beer.tapNumber - 1 // Subtract 1 to get 0-based index
      if (index >= 0 && index < coreLetters.length) {
        return `${coreLetters[index]} - ${coreNames[index]}`
      }
      return 'CORE'
    } else {
      // Rotating beers get numbers
      return `TAP ${beer.tapNumber}`
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold">🏰 The Castle</h1>
            <p className="text-muted-foreground">Admin Dashboard</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4 shadow-lg">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <Image
              src="/static/logo/castle.png"
              alt="The Castle Logo"
              width={48}
              height={48}
              className="rounded-lg"
            />
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="opacity-90">Manage tap menu</p>
            </div>
          </div>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => window.open('/display/1', '_blank')}
              className="bg-primary-foreground text-primary"
            >
              View Display 1
            </Button>
            <Button
              variant="outline"
              onClick={() => window.open('/display/2', '_blank')}
              className="bg-primary-foreground text-primary"
            >
              View Display 2
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Beer Form */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">
              {isEditing ? 'Edit Beer' : 'Add New Beer'}
            </h2>
            
            <form onSubmit={handleBeerSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="isCore">Beer Type</Label>
                  <select
                    id="isCore"
                    value={beerForm.isCore ? 'true' : 'false'}
                    onChange={(e) => setBeerForm({ ...beerForm, isCore: e.target.value === 'true' })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="false">Rotating Beer (Tap Number)</option>
                    <option value="true">Core Beer (Letter)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tapNumber">
                    {beerForm.isCore ? 'Core Beer Letter' : 'Tap Number (1-20)'}
                  </Label>
                  {beerForm.isCore ? (
                    <select
                      id="tapNumber"
                      value={beerForm.tapNumber}
                      onChange={(e) => setBeerForm({ ...beerForm, tapNumber: e.target.value })}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="">Select Core Beer</option>
                      <option value="1">A - Castle Brew Pils (Tap 1)</option>
                      <option value="2">B - Hefeweizen (Tap 2)</option>
                      <option value="3">C - Pale Ale (Tap 3)</option>
                      <option value="4">D - Cider (Tap 4)</option>
                      <option value="5">E - Stout (Tap 5)</option>
                      <option value="6">F - Radler (Tap 6)</option>
                    </select>
                  ) : (
                    <Input
                      id="tapNumber"
                      type="number"
                      min="1"
                      max="20"
                      value={beerForm.tapNumber}
                      onChange={(e) => setBeerForm({ ...beerForm, tapNumber: e.target.value })}
                      required
                    />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    value={beerForm.status}
                    onChange={(e) => setBeerForm({ ...beerForm, status: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="on_tap">On Tap</option>
                    <option value="keg_empty">Keg Empty</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Beer Name</Label>
                <Input
                  id="name"
                  value={beerForm.name}
                  onChange={(e) => setBeerForm({ ...beerForm, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="brewery">Brewery</Label>
                <Input
                  id="brewery"
                  value={beerForm.brewery}
                  onChange={(e) => setBeerForm({ ...beerForm, brewery: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="style">Style</Label>
                  <Input
                    id="style"
                    value={beerForm.style}
                    onChange={(e) => setBeerForm({ ...beerForm, style: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="abv">ABV</Label>
                  <Input
                    id="abv"
                    placeholder="4.5%"
                    value={beerForm.abv}
                    onChange={(e) => setBeerForm({ ...beerForm, abv: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  placeholder="0.3L €4 / 0.5L €5.50"
                  value={beerForm.price}
                  onChange={(e) => setBeerForm({ ...beerForm, price: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="logo">Logo (optional)</Label>
                <select
                  id="logo"
                  value={beerForm.logo}
                  onChange={(e) => setBeerForm({ ...beerForm, logo: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">No Logo</option>
                  <option value="/static/logo/hopscor.png">Hopscor Brewing</option>
                  <option value="/static/logo/weihenstephan.jpg">Weihenstephan</option>
                  <option value="/static/logo/strassenbrau.png">Strassenbrau</option>
                  <option value="/static/logo/Brlo.png">Brlo</option>
                  <option value="/static/logo/castle.png">Castle</option>
                  <option value="/static/logo/braugier.png">Braugier</option>
                  <option value="/static/logo/fuerst wiacek.png">Fuerst Wiacek</option>
                  <option value="/static/logo/stowford.jpg">Stowford</option>
                  <option value="/static/logo/guinness.jpg">Guinness</option>
                  <option value="custom">Custom URL...</option>
                </select>
                {beerForm.logo === 'custom' && (
                  <Input
                    type="url"
                    placeholder="https://example.com/logo.png"
                    value={beerForm.logo === 'custom' ? '' : beerForm.logo}
                    onChange={(e) => setBeerForm({ ...beerForm, logo: e.target.value })}
                    className="mt-2"
                  />
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (optional, comma-separated)</Label>
                <Input
                  id="tags"
                  placeholder="NEW, LIMITED, STRONG, SEASONAL, HOUSE"
                  value={beerForm.tags}
                  onChange={(e) => setBeerForm({ ...beerForm, tags: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Available tags: NEW, LIMITED, STRONG, SEASONAL, HOUSE, POPULAR, AWARD
                </p>
              </div>

              <div className="flex gap-2">
                <Button type="submit">
                  {isEditing ? 'Update Beer' : 'Add Beer'}
                </Button>
                {isEditing && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false)
                      setBeerForm({
                        id: '',
                        tapNumber: '',
                        name: '',
                        brewery: '',
                        abv: '',
                        style: '',
                        price: '',
                        logo: '',
                        status: 'on_tap',
                        tags: '',
                        isCore: false
                      })
                    }}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </div>

          {/* Beer List */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Current Beers</h2>
            
            {error && (
              <div className="text-destructive">Error loading beers: {error.message}</div>
            )}
            
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {beers?.map((beer) => (
                <div
                  key={beer.id}
                  className={`p-4 border rounded-lg ${
                    beer.status === 'keg_empty' ? 'opacity-60 border-muted' : 'border-border'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3 flex-1">
                      <BeerLogo 
                        src={beer.logo} 
                        alt={`${beer.brewery} logo`}
                        size={40}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm bg-primary text-primary-foreground px-2 py-1 rounded">
                            {getBeerIdentifier(beer)}
                          </span>
                          {beer.status === 'keg_empty' && (
                            <span className="text-xs bg-destructive text-destructive-foreground px-2 py-1 rounded">
                              Empty
                            </span>
                          )}
                          {beer.tags && JSON.parse(beer.tags).map((tag: string) => (
                            <TagIcon 
                              key={tag} 
                              tag={tag} 
                              size={16}
                              className="ml-1"
                            />
                          ))}
                        </div>
                        <h3 className="font-semibold mt-1">{beer.name}</h3>
                        <p className="text-sm text-muted-foreground">{beer.brewery}</p>
                        <p className="text-sm">{beer.style} • {beer.abv}</p>
                        <p className="text-sm font-medium text-primary">{beer.price}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(beer)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(beer.id)}
                      >
                        Delete
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleEmpty(beer)}
                      >
                        {beer.status === 'keg_empty' ? 'Mark as On Tap' : 'Mark as Empty'}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              {beers?.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No beers added yet. Add your first beer above!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 