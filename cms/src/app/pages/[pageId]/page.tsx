import { notFound } from "next/navigation"
import { BackButton } from "@/components/common/BackButton"
import { CMS_PAGES } from "@/config/pages"
import { SectionCard } from "@/components/forms/SectionCard"
import { FormField } from "@/components/forms/FormField"
import { ImagePicker } from "@/components/forms/ImagePicker"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function PageEditor({ params }: { params: { pageId: string } }) {
  const page = CMS_PAGES.find((p) => p.id === params.pageId)
  if (!page) return notFound()

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{page.title}</h1>
          <p className="text-sm text-muted-foreground">Static editor (no functionality)</p>
        </div>
        <BackButton />
      </div>

      <div className="space-y-6">
        {page.sections.map((section) => (
          <SectionCard key={section.id} title={section.title}>
            <div className="grid gap-4 sm:grid-cols-2">
              {section.fields.map((field) => (
                <FormField key={field.id} label={field.label}>
                  {field.type === 'text' && (
                    <Input className="h-10" placeholder={field.label} />
                  )}
                  {field.type === 'textarea' && (
                    <Textarea className="min-h-32" placeholder={field.label} />
                  )}
                  {field.type === 'image' && (
                    <ImagePicker />
                  )}
                  {field.type === 'richtext' && (
                    <div className="min-h-32 rounded-md border p-3 text-sm text-muted-foreground">Rich text editor (static)</div>
                  )}
                  {field.type === 'gallery' && (
                    <div className="h-36 rounded-md border grid place-items-center text-sm text-muted-foreground">Gallery grid (static)</div>
                  )}
                  {field.type === 'list' && (
                    <div className="rounded-md border p-3 text-sm text-muted-foreground">List items (static)</div>
                  )}
                </FormField>
              ))}
            </div>
          </SectionCard>
        ))}
      </div>
    </div>
  )
}


