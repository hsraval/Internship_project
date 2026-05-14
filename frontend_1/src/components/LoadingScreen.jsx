export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-[#d7e9f2] flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-[#80b3ba] border-t-[#16537e] rounded-full animate-spin" />
        <p className="text-[#16537e] font-mono text-xs tracking-widest uppercase">Loading</p>
      </div>
    </div>
  )
}
