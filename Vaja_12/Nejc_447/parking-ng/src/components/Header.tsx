// Blue header with the app name and a single parking emoji.
export default function Header() {
  return (
    <header className="bg-accent text-white">
      <div className="mx-auto max-w-120 px-4 py-4">
        <h1 className="text-xl font-bold">Parking NG 🅿️</h1>
        <p className="text-sm text-white">Free spaces in Nova Gorica, reported by drivers</p>
      </div>
    </header>
  )
}
