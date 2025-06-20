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

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const BeerItem = ({ beer, tapNumberToShow }: { beer: Beer, tapNumberToShow?: number }) => {
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
            {tapNumberToShow && `${tapNumberToShow}. `}
            {beer.name.toUpperCase()}
          </strong>
          {' - '}
          {beer.brewery.toUpperCase()}
        </p>
        {isEmpty ? (
          <p className="beer-item-sub font-semibold">keg is empty new one coming soon</p>
        ) : (
          <p className="beer-item-sub">
            {beer.style} {beer.abv} - {beer.location}
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


  
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.className = savedTheme;
    setIsDark(savedTheme === 'dark');
  }, []);

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

  const isDisplay1 = screenNumber === 1;

  const leftColumnBeers = isDisplay1 ? coreBeers.slice(0, 6) : rotatingBeers.slice(5, 9);
  const rightColumnBeers = isDisplay1 ? rotatingBeers.slice(0, 5) : rotatingBeers.slice(9, 13);
  
  const leftColumnTitle = isDisplay1 ? "CORE RANGE BEER" : "ROTATING BEER";
  const rightColumnTitle = "ROTATING BEER";

  return (
    <div className="tv-display-new">
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
              <BeerItem 
                key={beer.id} 
                beer={beer} 
                tapNumberToShow={!isDisplay1 ? 5 + index + 1 : undefined} 
              />
            ))}
          </div>
        </div>
        <div className="beer-column">
          <h2 className="column-title">{rightColumnTitle}</h2>
          <div className="beer-list">
            {rightColumnBeers.map((beer, index) => (
              <BeerItem 
                key={beer.id} 
                beer={beer} 
                tapNumberToShow={isDisplay1 ? index + 1 : 9 + index + 1} 
              />
            ))}
          </div>
        </div>
      </main>

      <footer className="display-footer">
      </footer>
    </div>
  );
} 