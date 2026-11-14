import { useMemo, useState } from 'react';
import { Check, Copy, Download, Search } from 'lucide-react';
import { PROJECT_METADATA, PYTHON_SOURCE_CODE } from '../data/pythonSource';
import type { PythonFunctionIndex } from '../utils/projectAnalysis';

interface SourceCodeSectionProps {
  functions: PythonFunctionIndex[];
}

export function SourceCodeSection({ functions }: SourceCodeSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFunction, setSelectedFunction] = useState<string>('ALL');
  const [copied, setCopied] = useState(false);

  const lines = useMemo(() => PYTHON_SOURCE_CODE.split('\n'), []);

  const activeFnRange = useMemo(() => {
    if (selectedFunction === 'ALL') return null;
    return functions.find((f) => f.name === selectedFunction) ?? null;
  }, [functions, selectedFunction]);

  const displayedLines = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return lines
      .map((content, idx) => ({ lineNo: idx + 1, content }))
      .filter((entry) => {
        if (activeFnRange) {
          if (entry.lineNo < activeFnRange.startLine || entry.lineNo > activeFnRange.endLine) {
            return false;
          }
        }
        if (q) {
          return entry.content.toLowerCase().includes(q);
        }
        return true;
      });
  }, [lines, activeFnRange, searchQuery]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(PYTHON_SOURCE_CODE);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section id="source-code" className="py-16 print-break-before">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#1E3A8A]">
            Section 04 <span aria-hidden="true">·</span> Appendix &amp; Complete Listing
          </p>
          <h2 className="font-serif-display mt-2 text-3xl font-semibold text-stone-900">
            Complete Project Source Code
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-stone-600">
            Full unmodified Python implementation (<span className="font-mono-code text-xs">{PROJECT_METADATA.fileName}</span>, {lines.length} lines). Select any function in the index to isolate its implementation.
          </p>
        </div>

        <div className="no-print flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-2 rounded-md border border-stone-300 bg-white px-4 py-2 text-xs font-semibold text-stone-800 transition-colors hover:bg-stone-100 whitespace-nowrap shrink-0 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-700" aria-hidden="true" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-stone-600" aria-hidden="true" />
                <span>Copy Source Code</span>
              </>
            )}
          </button>

          <a
            href={PROJECT_METADATA.downloadUrl}
            download="online_voting_system.py"
            className="inline-flex items-center gap-2 rounded-md bg-stone-900 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-stone-800 whitespace-nowrap shrink-0"
          >
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Download .py</span>
          </a>
        </div>
      </div>

      {/* Controls */}
      <div className="no-print mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <aside className="lg:col-span-4 rounded-lg border border-stone-200 bg-white p-4 self-start">
          <label htmlFor="code-search" className="block text-xs font-semibold uppercase tracking-wider text-stone-500">
            Search Code Lines
          </label>
          <div className="relative mt-2">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-stone-400" aria-hidden="true" />
            <input
              id="code-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter e.g. SELECT, tabulate, voter_id"
              className="w-full rounded-md border border-stone-300 bg-[#FAF8F4] py-2 pl-9 pr-3 text-xs text-stone-900 placeholder:text-stone-400 focus:border-[#1E3A8A] focus:outline-none"
            />
          </div>

          <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-stone-500">
            Function Index ({functions.length})
          </p>
          <div className="mt-2 divide-y divide-stone-100 max-h-[380px] overflow-y-auto">
            <button
              type="button"
              onClick={() => setSelectedFunction('ALL')}
              className={`flex w-full items-center justify-between px-2.5 py-2 text-left text-xs rounded transition-colors cursor-pointer ${
                selectedFunction === 'ALL'
                  ? 'bg-[#1E3A8A] text-white font-semibold'
                  : 'text-stone-700 hover:bg-stone-100'
              }`}
            >
              <span>Full File (All Lines)</span>
              <span className="font-mono-code tabular-nums">1–{lines.length}</span>
            </button>

            {functions.map((fn) => {
              const active = selectedFunction === fn.name;
              return (
                <button
                  key={fn.name}
                  type="button"
                  onClick={() => setSelectedFunction(fn.name)}
                  className={`flex w-full items-center justify-between gap-2 px-2.5 py-2 text-left text-xs rounded transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#1E3A8A] text-white font-semibold'
                      : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <span className="font-mono-code truncate">{fn.name}()</span>
                  <span className="font-mono-code text-[11px] opacity-80 whitespace-nowrap shrink-0 tabular-nums">
                    L{fn.startLine}–{fn.endLine}
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        <div className="lg:col-span-8 rounded-lg border border-stone-200 bg-[#141312] text-stone-100 overflow-hidden">
          <div className="flex items-center justify-between border-b border-stone-800 px-4 py-3 text-xs text-stone-400">
            <span className="font-mono-code">
              {selectedFunction === 'ALL' ? PROJECT_METADATA.fileName : `${selectedFunction}() · Lines ${activeFnRange?.startLine}–${activeFnRange?.endLine}`}
            </span>
            <span className="tabular-nums">
              Showing {displayedLines.length} of {lines.length} lines
            </span>
          </div>

          <div
            data-testid="source-code-viewer"
            className="max-h-[540px] overflow-auto p-4 font-mono-code text-xs leading-6"
          >
            {displayedLines.length === 0 ? (
              <p className="py-6 text-center text-stone-400">
                No lines match &ldquo;{searchQuery}&rdquo; in the current selection.
              </p>
            ) : (
              <table className="w-full border-collapse">
                <tbody>
                  {displayedLines.map((entry) => (
                    <tr key={entry.lineNo} className="hover:bg-stone-800/50">
                      <td className="select-none pr-4 text-right text-stone-500 tabular-nums w-12 align-top">
                        {entry.lineNo}
                      </td>
                      <td className="whitespace-pre text-stone-200">{entry.content}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Print-only full code listing */}
      <div className="hidden print:block mt-6 rounded border border-stone-300 bg-white p-4 font-mono-code text-[10px] leading-4">
        {lines.map((content, idx) => (
          <div key={idx} className="whitespace-pre-wrap break-all">
            <span className="inline-block w-8 text-stone-500 tabular-nums">{idx + 1}</span>
            <span>{content}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
