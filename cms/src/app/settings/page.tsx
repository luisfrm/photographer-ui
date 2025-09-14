export default function SettingsPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <section className="border rounded-md p-4">
        <h2 className="text-lg font-medium mb-3">Branding</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Site Name</label>
            <input className="border rounded-md h-9 px-3" placeholder="My Site" />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Logo</label>
            <div className="h-28 rounded-md border grid place-items-center text-sm text-muted-foreground">Image picker (static)</div>
          </div>
        </div>
      </section>
      <section className="border rounded-md p-4">
        <h2 className="text-lg font-medium mb-3">SEO</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Title</label>
            <input className="border rounded-md h-9 px-3" placeholder="Title" />
          </div>
          <div className="grid gap-2 sm:col-span-2">
            <label className="text-sm font-medium">Description</label>
            <textarea className="border rounded-md min-h-28 p-3" placeholder="Description" />
          </div>
        </div>
      </section>
    </div>
  )
}


