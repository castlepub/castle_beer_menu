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

interface RotatingMessage {
  id: number
  text: string
  duration: number
  color: string
  order: number
  isActive: boolean
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
  
  // Message management state
  const [messageForm, setMessageForm] = useState({
    id: '',
    text: '',
    duration: 8,
    color: '#FFFFFF',
    order: 1,
    isActive: true
  })
  const [isEditingMessage, setIsEditingMessage] = useState(false)


  const { data: beers, error } = useSWR<Beer[]>(
    isLoggedIn ? '/api/beers' : null,
    fetcher,
    { refreshInterval: 30000 }
  )

  const { data: messages, mutate: mutateMessages } = useSWR<RotatingMessage[]>(
    isLoggedIn ? '/api/messages' : null,
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

  const getBeerIdentifier = (beer: Beer) => {
    if (beer.isCore) {
      const coreLetters = ['A', 'B', 'C', 'D', 'E', 'F'];
      const coreBeers = Array.isArray(beers) ? beers.filter(b => b.isCore).sort((a, b) => a.tapNumber - b.tapNumber) : [];
      const index = coreBeers.findIndex(b => b.id === beer.id);
      if (index >= 0 && index < coreLetters.length) {
        return coreLetters[index];
      }
      return 'CORE';
    } else {
      // Rotating beers get numbers 1, 2, 3... based on their position among rotating beers
      const rotatingBeers = Array.isArray(beers) ? beers.filter(b => !b.isCore).sort((a,b) => a.tapNumber - b.tapNumber) : [];
      const rotatingIndex = rotatingBeers.findIndex(b => b.id === beer.id);
      return (rotatingIndex + 1).toString();
    }
  };

  // Message management handlers
  const handleMessageSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const method = isEditingMessage ? 'PUT' : 'POST'
      const response = await fetch('/api/messages', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...messageForm,
          id: isEditingMessage ? parseInt(messageForm.id) : undefined
        })
      })

      if (response.ok) {
        setMessageForm({
          id: '',
          text: '',
          duration: 8,
          color: '#FFFFFF',
          order: 1,
          isActive: true
        })
        setIsEditingMessage(false)
        mutateMessages()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to save message')
      }
    } catch (error) {
      console.error('Save message error:', error)
      alert('Failed to save message')
    }
  }

  const handleEditMessage = (message: RotatingMessage) => {
    setMessageForm({
      id: message.id.toString(),
      text: message.text,
      duration: message.duration,
      color: message.color,
      order: message.order,
      isActive: message.isActive
    })
    setIsEditingMessage(true)
  }

  const handleDeleteMessage = async (id: number) => {
    if (!confirm('Are you sure you want to delete this message?')) return

    try {
      const response = await fetch(`/api/messages?id=${id}`, { method: 'DELETE' })
      if (response.ok) {
        mutateMessages()
      } else {
        alert('Failed to delete message')
      }
    } catch (error) {
      console.error('Delete message error:', error)
      alert('Failed to delete message')
    }
  }

  if (error) {
    return (
      <div className="p-6 text-center text-destructive">
        Error loading beers: {error.message}. Please check the API server.
      </div>
    )
  }
  
  // Sort beers for display: core first, then rotating by tap number
  const sortedBeers = Array.isArray(beers) ? [...beers].sort((a, b) => {
    if (a.isCore && !b.isCore) return -1;
    if (!a.isCore && b.isCore) return 1;
    return a.tapNumber - b.tapNumber;
  }) : [];

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
              src="/logo/castle.png"
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
                  <option value="/logo/hopscor.png">Hopscor Brewing</option>
                  <option value="/logo/weihenstephan.jpg">Weihenstephan</option>
                  <option value="/logo/strassenbrau.png">Strassenbrau</option>
                  <option value="/logo/Brlo.png">Brlo</option>
                  <option value="/logo/castle.png">Castle</option>
                  <option value="/logo/braugier.png">Braugier</option>
                  <option value="/logo/fuerst wiacek.png">Fuerst Wiacek</option>
                  <option value="/logo/stowford.jpg">Stowford</option>
                  <option value="/logo/guinness.jpg">Guinness</option>
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
            <h2 className="text-xl font-semibold">Current Beers on Tap</h2>
            
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-4">
              {sortedBeers.map((beer) => (
                <div
                  key={beer.id}
                  className={`p-4 border rounded-lg ${
                    beer.status === 'keg_empty' ? 'opacity-60 border-muted' : 'border-border'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 rounded-md bg-muted flex items-center justify-center text-xl font-bold">
                          {getBeerIdentifier(beer)}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm bg-primary text-primary-foreground px-2 py-1 rounded">
                            {getBeerIdentifier(beer)}
                          </span>
                          {beer.status === 'keg_empty' && (
                            <span className="text-xs font-semibold bg-red-100 text-red-800 px-2 py-1 rounded-full">Empty</span>
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
                        <h3 className="text-xl font-bold">{beer.name}</h3>
                        <p className="text-sm text-muted-foreground">{beer.brewery}</p>
                        <p className="text-sm">{beer.style} • {beer.abv}</p>
                        <p className="text-sm font-medium text-primary">{beer.price}</p>
                        {beer.isCore && <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Core Beer</span>}
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
              
              {!beers && (
                <div className="text-center py-8 text-muted-foreground">
                  Loading beers...
                </div>
              )}

              {beers && beers.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No beers added yet. Add your first beer using the form.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Rotating Messages Management */}
        <div className="mt-8 pt-8 border-t">
          <h2 className="text-2xl font-bold mb-6">🔄 Rotating Messages (Display 2)</h2>
          
          {/* Message Form */}
          <div className="bg-card p-6 rounded-lg border mb-6">
            <h3 className="text-lg font-semibold mb-4">
              {isEditingMessage ? 'Edit Message' : 'Add New Message'}
            </h3>
            <form onSubmit={handleMessageSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="message-text">Message Text</Label>
                <Input
                  id="message-text"
                  value={messageForm.text}
                  onChange={(e) => setMessageForm({ ...messageForm, text: e.target.value })}
                  placeholder="Enter your message..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="message-duration">Duration (seconds)</Label>
                  <Input
                    id="message-duration"
                    type="number"
                    min="3"
                    max="30"
                    value={messageForm.duration}
                    onChange={(e) => setMessageForm({ ...messageForm, duration: parseInt(e.target.value) || 8 })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message-color">Text Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="message-color"
                      type="color"
                      value={messageForm.color}
                      onChange={(e) => setMessageForm({ ...messageForm, color: e.target.value })}
                      className="w-16 h-10"
                    />
                    <select
                      value={messageForm.color}
                      onChange={(e) => setMessageForm({ ...messageForm, color: e.target.value })}
                      className="flex h-10 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="#FFFFFF">White</option>
                      <option value="#FFD700">Gold</option>
                      <option value="#87CEEB">Sky Blue</option>
                      <option value="#98FB98">Light Green</option>
                      <option value="#FFA07A">Light Salmon</option>
                      <option value="#DDA0DD">Plum</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message-order">Display Order</Label>
                  <Input
                    id="message-order"
                    type="number"
                    min="1"
                    value={messageForm.order}
                    onChange={(e) => setMessageForm({ ...messageForm, order: parseInt(e.target.value) || 1 })}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="message-active"
                    checked={messageForm.isActive}
                    onChange={(e) => setMessageForm({ ...messageForm, isActive: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="message-active">Active</Label>
                </div>
                
                <div className="flex gap-2">
                  <Button type="submit">
                    {isEditingMessage ? 'Update Message' : 'Add Message'}
                  </Button>
                  {isEditingMessage && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsEditingMessage(false)
                        setMessageForm({
                          id: '',
                          text: '',
                          duration: 8,
                          color: '#FFFFFF',
                          order: 1,
                          isActive: true
                        })
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </div>

          {/* Messages List */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Current Messages</h3>
            {messages && messages.length > 0 ? (
              messages
                .sort((a, b) => a.order - b.order)
                .map((message) => (
                  <div
                    key={message.id}
                    className="flex items-center justify-between p-4 border rounded-lg bg-card"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium bg-primary text-primary-foreground px-2 py-1 rounded">
                          #{message.order}
                        </span>
                        <span className="text-sm">{message.duration}s</span>
                        <div
                          className="w-4 h-4 rounded border"
                          style={{ backgroundColor: message.color }}
                        />
                        {!message.isActive && (
                          <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">Inactive</span>
                        )}
                      </div>
                      <p className="font-medium" style={{ color: message.color }}>
                        {message.text}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditMessage(message)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteMessage(message.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No messages added yet. Add your first message using the form.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
} 