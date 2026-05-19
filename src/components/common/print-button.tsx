'use client'

import { Printer } from 'lucide-react'

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="mt-1 flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted print:hidden"
    >
      <Printer className="h-3.5 w-3.5" /> In / Xuất PDF
    </button>
  )
}
