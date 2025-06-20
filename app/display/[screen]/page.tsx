'use client'

import { useEffect, useState } from 'react'
import useSWR from 'swr'
import Image from 'next/image'
import { BeerLogo } from '@/components/ui/beer-logo'
import { Sun, Moon } from 'lucide-react'

interface Beer {
  id: number;
  tapNumber: number;
  name: string;
  brewery: string;
  style: string;
  abv: string;
  price: string;
  logo?: string;
  status: string;
  tags?: string;
  location?: string;
  isCore: boolean;
}

interface RotatingMessage {
  id: number;
  text: string;
  duration: number;
  color: string;
  order: number;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const BeerItem = ({ beer }: { beer: Beer }) => {
  const isNew = beer.tags && JSON.parse(beer.tags).includes('new');
  const isEmpty = beer.status === 'keg_empty';

  return (
    <div className={`beer-item ${isEmpty ? 'keg-empty' : ''}`}>
      <div className="beer-item-logo">
        {beer.logo && <BeerLogo src={beer.logo} alt={beer.name} size={80} />}
      </div>
      <div className="beer-item-info">
        <p className={`beer-item-header ${isEmpty ? 'line-through' : ''}`}>
          <strong>
            {!beer.isCore && `${beer.tapNumber}. `}
            {beer.name.toUpperCase()}
          </strong>
          {' - '}
          {beer.brewery.toUpperCase()}
        </p>
        {isEmpty ? (
          <p className="beer-item-sub font-semibold">keg is empty new one coming soon</p>
        ) : (
          <p className="beer-item-sub">
            {beer.style} {beer.abv}
          </p>
        )}
      </div>
      <div className="beer-item-price">
        {!isEmpty && <p dangerouslySetInnerHTML={{ __html: beer.price.replace(/ \/ /g, '<br/>') }} />}
        {isNew && !isEmpty && <span className="new-tag">NEW</span>}
      </div>
    </div>
  )
}

export default function DisplayPage({ params }: { params: { screen: string } }) {
  const { data: beers, error } = useSWR<Beer[]>('/api/beers', fetcher, { refreshInterval: 5000 });
  const screenNumber = parseInt(params.screen, 10);
  const isDisplay1 = screenNumber === 1;

  // Only fetch messages for Display 2
  const { data: messages } = useSWR<RotatingMessage[]>(
    !isDisplay1 ? '/api/messages' : null, 
    fetcher, 
    { refreshInterval: 30000 }
  );

  const [isDark, setIsDark] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.className = savedTheme;
    setIsDark(savedTheme === 'dark');
  }, []);

  // Handle message rotation for Display 2 only
  useEffect(() => {
    if (!isDisplay1 && messages && messages.length > 0) {
      const currentMessage = messages[currentMessageIndex];
      const duration = (currentMessage?.duration || 8) * 1000;
      
      const interval = setInterval(() => {
        setCurrentMessageIndex((prevIndex) => 
          (prevIndex + 1) % messages.length
        );
      }, duration);

      return () => clearInterval(interval);
    }
  }, [messages, currentMessageIndex, isDisplay1]);

  const toggleDarkMode = () => {
    const newTheme = document.documentElement.className === 'light' ? 'dark' : 'light';
    document.documentElement.className = newTheme;
    setIsDark(newTheme === 'dark');
    localStorage.setItem('theme', newTheme);
  };

  if (error) {
    return <div className="loading-screen">Error loading beer menu. Please try again later.</div>;
  }
  
  if (!beers) {
    return <div className="loading-screen">Loading...</div>;
  }

  const coreBeers = Array.isArray(beers) ? beers.filter(b => b.isCore).sort((a, b) => a.tapNumber - b.tapNumber) : [];
  const rotatingBeers = Array.isArray(beers) ? beers.filter(b => !b.isCore).sort((a, b) => a.tapNumber - b.tapNumber) : [];

  let leftColumnBeers, rightColumnBeers;
  let leftColumnTitle, rightColumnTitle;

  if (isDisplay1) {
    leftColumnBeers = coreBeers;
    rightColumnBeers = rotatingBeers.slice(0, 5); // Display first 5 rotating beers
    leftColumnTitle = "CORE RANGE BEER";
    rightColumnTitle = "ROTATING BEER";
  } else {
    // Display 2
    const display2Beers = rotatingBeers.slice(5); // Display beers from tap 12 onwards
    const midPoint = Math.ceil(display2Beers.length / 2);
    
    leftColumnBeers = display2Beers.slice(0, midPoint);
    rightColumnBeers = display2Beers.slice(midPoint);
    leftColumnTitle = "ROTATING BEER";
    rightColumnTitle = "ROTATING BEER";
  }

  // Get current message for Display 2
  const currentMessage = !isDisplay1 && messages && messages.length > 0 
    ? messages[currentMessageIndex] 
    : null;
  
  return (
    <div className={`tv-display-new ${!isDisplay1 ? 'display-2-large' : ''}`}>
      <button onClick={toggleDarkMode} className="theme-toggle-button">
        {isDark ? <Sun size={24} /> : <Moon size={24} />}
      </button>

      <div className="central-header">
        <h1>ON TAP</h1>
      </div>
      <div className="central-logo-new">
        <Image src="/castlologo5iiiii.png" alt="The Castle Logo" width={300} height={300} style={{ objectFit: 'contain' }} />
      </div>

      <main className="columns-container">
        <div className="beer-column">
          <h2 className="column-title">{leftColumnTitle}</h2>
          <div className="beer-list">
            {leftColumnBeers.map((beer) => (
              <BeerItem key={beer.id} beer={beer} />
            ))}
          </div>
        </div>
        <div className="beer-column">
          <h2 className="column-title">{rightColumnTitle}</h2>
          <div className="beer-list">
            {rightColumnBeers.map((beer) => (
              <BeerItem key={beer.id} beer={beer} />
            ))}
          </div>
        </div>
      </main>

      <footer className="display-footer">
        {currentMessage && (
          <div 
            className="rotating-text"
            style={{ color: currentMessage.color }}
          >
            {currentMessage.text}
          </div>
        )}
      </footer>
    </div>
  );
} 