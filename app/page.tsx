import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-md">
        <div>
          <h1 className="text-4xl font-bold mb-4">🏰 The Castle</h1>
          <h2 className="text-2xl font-semibold mb-2">Tap Menu System</h2>
          <p className="text-muted-foreground">
            Live beer menu management for The Castle bar
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/display/1">
              <Button variant="outline" className="w-full h-16">
                <div className="text-center">
                  <div className="font-semibold">Display 1</div>
                  <div className="text-sm text-muted-foreground">Taps 1-10</div>
                </div>
              </Button>
            </Link>
            <Link href="/display/2">
              <Button variant="outline" className="w-full h-16">
                <div className="text-center">
                  <div className="font-semibold">Display 2</div>
                  <div className="text-sm text-muted-foreground">Taps 11-20</div>
                </div>
              </Button>
            </Link>
          </div>
          
          <Link href="/admin">
            <Button className="w-full h-12">
              Admin Dashboard
            </Button>
          </Link>
        </div>

        <div className="text-sm text-muted-foreground">
          <p>For staff: Use the admin dashboard to manage beers</p>
          <p>For customers: Displays update automatically every 30 seconds</p>
        </div>
      </div>
    </div>
  )
} 