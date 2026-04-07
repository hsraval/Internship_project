export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-cream flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-ink-200 border-t-ink-800 rounded-full animate-spin" />
        <p className="text-ink-400 font-mono text-xs tracking-widest uppercase">Loading</p>
      </div>
    </div>
  )
}
