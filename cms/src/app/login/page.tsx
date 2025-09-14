export default function LoginPage() {
  return (
    <main className="min-h-dvh grid place-items-center p-6">
      <div className="w-full max-w-sm border rounded-md p-6 bg-background">
        <h1 className="text-xl font-semibold mb-1">Sign in</h1>
        <p className="text-sm text-muted-foreground mb-6">Static UI only</p>
        <form className="space-y-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Email</label>
            <input className="border rounded-md h-9 px-3" placeholder="you@example.com" />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Password</label>
            <input type="password" className="border rounded-md h-9 px-3" placeholder="••••••••" />
          </div>
          <button type="button" className="h-9 px-4 rounded-md bg-primary text-primary-foreground w-full">Sign in</button>
        </form>
      </div>
    </main>
  )
}


