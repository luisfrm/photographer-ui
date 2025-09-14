"use client"

import { useRef, useState } from "react"
import { cn } from "@/lib/utils"

type Props = {
  placeholder?: string
  className?: string
}

export function ImagePicker({ placeholder = "Drop or click to select image (static)", className }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  function onSelectFile(file: File | undefined) {
    setError(null)
    setPreview(null)
    if (!file) return
    const isImage = file.type.startsWith("image/")
    const isLt5mb = file.size < 5 * 1024 * 1024
    if (!isImage) {
      setError("Only images are allowed")
      return
    }
    if (!isLt5mb) {
      setError("Max size 5MB")
      return
    }
    const url = URL.createObjectURL(file)
    setPreview(url)
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <div
        className={cn(
          "relative flex h-40 items-center justify-center overflow-hidden rounded-lg border-2 border-dashed bg-muted/10 text-sm text-muted-foreground transition-colors hover:bg-muted/20",
          preview && "p-0 border-solid"
        )}
        onClick={() => inputRef.current?.click()}
        role="button"
        aria-label="Pick image"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault()
          onSelectFile(e.dataTransfer.files?.[0])
        }}
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Preview" className="h-full w-full object-cover" />
        ) : (
          <div className="pointer-events-none text-center">
            <div className="text-xs">{placeholder}</div>
            <div className="text-[11px] text-muted-foreground">PNG, JPG up to 5MB</div>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => onSelectFile(e.target.files?.[0] ?? undefined)}
        />
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}


