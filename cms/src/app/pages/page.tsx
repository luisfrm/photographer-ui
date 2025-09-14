import Link from "next/link"
import { CMS_PAGES } from "@/config/pages"
import { FileText, ChevronRight } from "lucide-react"
import { BackButton } from "@/components/common/BackButton"

export default function PagesListPage() {
  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Pages</h1>
        <BackButton />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {CMS_PAGES.map((p) => (
          <Link
            key={p.id}
            href={`/pages/${p.id}`}
            className="group relative overflow-hidden rounded-lg border bg-card p-4 shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
            />
            <div className="relative flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="grid place-items-center size-9 shrink-0 rounded-md bg-primary/10 text-primary">
                  <FileText className="size-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-lg font-medium truncate">{p.title}</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5">
                      {p.sections.length} sections
                    </span>
                  </div>
                </div>
              </div>
              <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
            </div>
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-primary/30 transition-transform group-hover:scale-x-100"
            />
          </Link>
        ))}
      </div>
    </div>
  )
}


