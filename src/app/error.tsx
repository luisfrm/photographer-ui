'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 px-4">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-foreground">500</h1>
          <h2 className="text-2xl font-semibold text-foreground">Algo salió mal</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Ha ocurrido un error inesperado. Por favor, intenta de nuevo.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={reset}>
            Intentar de nuevo
          </Button>
          <Button variant="outline" asChild>
            <Link href="/en">
              Volver al inicio
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
} 