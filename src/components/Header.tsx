import { Printer } from 'lucide-react';

const NAV_ITEMS = [
  { href: '#overview', label: 'Overview' },
  { href: '#algorithm', label: 'Algorithm' },
  { href: '#screenshots', label: 'Screenshots' },
  { href: '#future-scope', label: 'Future Scope' },
  { href: '#source-code', label: 'Source Code' },
];

export function Header() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <header className="no-print sticky top-0 z-30 border-b border-stone-200 bg-[#FAF8F4]/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-8 px-6 py-4">
        <a
          href="#overview"
          className="font-serif-display text-lg font-semibold tracking-tight text-stone-900 whitespace-nowrap shrink-0"
        >
          Project Synopsis
        </a>

        <nav aria-label="Report sections" className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="whitespace-nowrap shrink-0 transition-colors hover:text-[#1E3A8A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A8A] focus-visible:ring-offset-2 rounded-sm"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 rounded-md bg-[#1E3A8A] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#172D6B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A8A] focus-visible:ring-offset-2 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Printer className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Print Report</span>
          </button>
        </div>
      </div>
    </header>
  );
}
