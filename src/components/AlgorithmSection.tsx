import { useState } from 'react';
import { ALGORITHMS, type AlgorithmSpec } from '../data/reportContent';

function AlgorithmDetailCard({ algorithm }: { algorithm: AlgorithmSpec }) {
  return (
    <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-12 print-avoid-break">
      <div className="lg:col-span-7">
        <div className="flex flex-wrap items-baseline gap-3 text-xs text-stone-500">
          <span className="font-semibold uppercase tracking-widest text-[#1E3A8A]">
            Algorithm {algorithm.number}
          </span>
          <span aria-hidden="true">·</span>
          <span className="font-mono-code">{algorithm.lineRange}</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono-code">{algorithm.functionsCovered.join(', ')}</span>
        </div>

        <h3 className="font-serif-display mt-2 text-2xl font-semibold text-stone-900">
          {algorithm.title}
        </h3>
        <p className="mt-3 text-[15px] leading-relaxed text-stone-700">
          {algorithm.summary}
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 border-y border-stone-200 py-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">Inputs</p>
            <ul className="mt-1.5 space-y-1 text-xs text-stone-700">
              {algorithm.inputs.map((inp) => (
                <li key={inp}>• {inp}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">Outputs &amp; State Changes</p>
            <ul className="mt-1.5 space-y-1 text-xs text-stone-700">
              {algorithm.outputs.map((out) => (
                <li key={out}>• {out}</li>
              ))}
            </ul>
          </div>
        </div>

        <ol className="mt-6 space-y-5">
          {algorithm.steps.map((step) => (
            <li key={step.stepNo} className="border-b border-stone-200/80 pb-4 last:border-b-0">
              <div className="flex items-baseline gap-2.5">
                <span className="font-mono-code text-xs font-semibold text-[#1E3A8A] tabular-nums">
                  {step.stepNo}
                </span>
                <h4 className="text-sm font-semibold text-stone-900">{step.heading}</h4>
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-stone-600">{step.detail}</p>
              {step.sqlOrValidation && (
                <p className="mt-2 font-mono-code text-xs text-stone-700 bg-[#F2EFE9] px-3 py-1.5 rounded">
                  Rule / SQL: {step.sqlOrValidation}
                </p>
              )}
            </li>
          ))}
        </ol>
      </div>

      <div className="lg:col-span-5 space-y-6">
        <div className="rounded-lg border border-stone-200 bg-[#171615] p-5 text-stone-100">
          <div className="flex items-center justify-between border-b border-stone-700/80 pb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-300">
              Structured Pseudocode
            </span>
            <span className="font-mono-code text-xs text-stone-400">
              {algorithm.functionsCovered[0]}
            </span>
          </div>
          <pre className="mt-4 overflow-x-auto font-mono-code text-xs leading-6 text-stone-200">
            <code>{algorithm.pseudocode}</code>
          </pre>
        </div>

        <div className="rounded-lg border border-stone-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            Analyst Complexity &amp; Invariant Note
          </p>
          <p className="mt-2 text-sm leading-relaxed text-stone-700">
            {algorithm.complexityAndConstraint}
          </p>
        </div>
      </div>
    </div>
  );
}

export function AlgorithmSection() {
  const [selectedId, setSelectedId] = useState<string>(ALGORITHMS[0].id);
  const [showAllOnScreen, setShowAllOnScreen] = useState(false);

  const activeAlgorithm = ALGORITHMS.find((a) => a.id === selectedId) ?? ALGORITHMS[0];

  return (
    <section id="algorithm" className="border-b border-stone-200 py-16 print-break-before">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#1E3A8A]">
            Section 01 <span aria-hidden="true">·</span> Algorithmic Architecture
          </p>
          <h2 className="font-serif-display mt-2 text-3xl font-semibold text-stone-900">
            Algorithm Explanation &amp; Logic Flow
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-stone-600">
            Detailed decomposition of the four core algorithms driving the Python electoral engine, from menu dispatch to tie-preserving result tabulation.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAllOnScreen((prev) => !prev)}
          className="no-print self-start sm:self-auto rounded-md border border-stone-300 bg-white px-4 py-2 text-xs font-semibold text-stone-800 transition-colors hover:bg-stone-100 whitespace-nowrap shrink-0 cursor-pointer"
        >
          {showAllOnScreen ? 'Single Algorithm View' : 'Expand All 4 Algorithms'}
        </button>
      </div>

      {!showAllOnScreen && (
        <div
          role="tablist"
          aria-label="Core algorithms"
          className="no-print mt-8 flex flex-wrap gap-2 border-b border-stone-200 pb-4"
        >
          {ALGORITHMS.map((alg) => {
            const isActive = alg.id === selectedId;
            return (
              <button
                key={alg.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setSelectedId(alg.id)}
                className={`rounded-md px-4 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[#1E3A8A] text-white'
                    : 'bg-[#F2EFE9] text-stone-700 hover:bg-stone-200/80'
                }`}
              >
                {alg.number}. {alg.title.split('&')[0].trim()}
              </button>
            );
          })}
        </div>
      )}

      {/* Interactive screen view */}
      <div className={showAllOnScreen ? 'space-y-12' : 'no-print'}>
        {showAllOnScreen ? (
          ALGORITHMS.map((alg) => <AlgorithmDetailCard key={alg.id} algorithm={alg} />)
        ) : (
          <AlgorithmDetailCard algorithm={activeAlgorithm} />
        )}
      </div>

      {/* Print view always includes all 4 algorithms when in single-tab screen mode */}
      {!showAllOnScreen && (
        <div className="hidden print:block space-y-10">
          {ALGORITHMS.map((alg) => (
            <AlgorithmDetailCard key={alg.id} algorithm={alg} />
          ))}
        </div>
      )}
    </section>
  );
}
