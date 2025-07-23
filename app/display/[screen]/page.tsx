'use client'

import { useEffect, useState } from 'react'
import useSWR from 'swr'
import Image from 'next/image'
import { BeerLogo } from '@/components/ui/beer-logo'
import { Sun, Moon } from 'lucide-react'

interface Beer {
  id: number;
  tapNumber: number;
  displayNumber?: number;
  name: string;
  nameFontSize?: string;
  brewery: string;
  breweryFontSize?: string;
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

const getTagInfo = (tag: string) => {
  switch (tag.toUpperCase()) {
    case 'NEW':
      return { color: '#ffc107', textColor: '#000000' };
    case 'LIMITED':
      return { color: '#ff6b6b', textColor: '#ffffff' };
    case 'STRONG':
      return { color: '#845ef7', textColor: '#ffffff' };
    case 'SEASONAL':
      return { color: '#ff922b', textColor: '#000000' };
    case 'HOUSE':
      return { color: '#20c997', textColor: '#000000' };
    case 'POPULAR':
      return { color: '#ffd43b', textColor: '#000000' };
    case 'AWARD':
      return { color: '#fab005', textColor: '#000000' };
    default:
      return { color: '#868e96', textColor: '#ffffff' };
  }
};

const BeerItem = ({ beer, rotatingIndex }: { beer: Beer; rotatingIndex?: number }) => {
  const tags = beer.tags ? JSON.parse(beer.tags) : [];
  const isEmpty = beer.status === 'keg_empty';

  return (
    <div className={`beer-item ${isEmpty ? 'keg-empty' : ''}`}>
      <div className="beer-item-logo">
        {beer.logo && <BeerLogo src={beer.logo} alt={beer.name} size={80} />}
      </div>
      <div className="beer-item-info">
        <p className={`beer-item-header ${isEmpty ? 'line-through' : ''}`}>
          <strong style={{ fontSize: beer.nameFontSize || '1rem' }}>
            {!beer.isCore && rotatingIndex !== undefined && `${rotatingIndex}. `}
            {beer.name.toUpperCase()}
          </strong>
          {' - '}
          <span style={{ fontSize: beer.breweryFontSize || '1rem' }}>
            {beer.brewery.toUpperCase()}
          </span>
        </p>
        {isEmpty ? (
          <p className="beer-item-sub font-semibold">keg is empty new one coming soon</p>
        ) : (
          <>
            <p className="beer-item-sub">
              {beer.style} {beer.abv}
            </p>
            <p className="beer-item-location">
              {beer.location}
              {tags.length > 0 && (
                <span className="beer-item-tags">
                  {tags.map((tag: string) => {
                    const tagInfo = getTagInfo(tag);
                    return (
                      <span 
                        key={tag} 
                        className="beer-tag"
                        style={{ 
                          backgroundColor: tagInfo.color,
                          color: tagInfo.textColor
                        }}
                      >
                        {tag}
                      </span>
                    );
                  })}
                </span>
              )}
            </p>
          </>
        )}
      </div>
      <div className="beer-item-price">
        {!isEmpty && <p dangerouslySetInnerHTML={{ __html: beer.price.replace(/ \/ /g, '<br/>') }} />}
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
  const rotatingBeers = Array.isArray(beers) ? beers.filter(b => !b.isCore).sort((a, b) => (a.displayNumber || 999) - (b.displayNumber || 999)) : [];

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

  // Calculate rotating beer index for proper numbering
  const getRotatingIndex = (beer: Beer, index: number, isRightColumn: boolean) => {
    if (beer.isCore) return undefined; // Core beers have no numbers (A, B, C, D, E, F)
    
    // For rotating beers, use the displayNumber if set, otherwise use the index
    return beer.displayNumber || (index + 1);
  };
  
  return (
    <div className={`tv-display-new ${isDark ? 'dark' : 'light'}`}>
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
            {leftColumnBeers.map((beer, index) => (
              <BeerItem key={beer.id} beer={beer} rotatingIndex={getRotatingIndex(beer, index, false)} />
            ))}
          </div>
        </div>
        <div className="beer-column">
          <h2 className="column-title">{rightColumnTitle}</h2>
          <div className="beer-list">
            {rightColumnBeers.map((beer, index) => (
              <BeerItem key={beer.id} beer={beer} rotatingIndex={getRotatingIndex(beer, index, true)} />
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