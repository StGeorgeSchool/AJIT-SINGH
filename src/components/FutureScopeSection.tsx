import { useState } from 'react';
import { CODE_AUDIT_MATRIX, FUTURE_ASPECTS, type FutureCategory } from '../data/reportContent';
import { filterFutureAspects } from '../utils/projectAnalysis';

export function FutureScopeSection() {
  const [category, setCategory] = useState<FutureCategory>('all');
  const visibleAspects = filterFutureAspects(FUTURE_ASPECTS, category);

  return (
    <section id="future-scope" className="border-b border-stone-200 py-16 print-break-before">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#1E3A8A]">
            Section 03 <span aria-hidden="true">·</span> Engineering Roadmap
          </p>
          <h2 className="font-serif-display mt-2 text-3xl font-semibold text-stone-900">
            Future Aspects &amp; Technical Evolution
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-stone-600">
            Evidence-based enhancements derived directly from static code analysis of the current CLI implementation.
          </p>
        </div>

        <div
          role="group"
          aria-label="Filter future aspects by category"
          className="no-print flex flex-wrap items-center gap-1 rounded-lg bg-[#F2EFE9] p-1 self-start"
        >
          {(
            [
              { id: 'all', label: 'All (5)' },
              { id: 'security', label: 'Security' },
              { id: 'architecture', label: 'Architecture' },
              { id: 'analytics', label: 'Analytics' },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setCategory(item.id)}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                category === item.id
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10 divide-y divide-stone-200 border-t border-stone-200">
        {visibleAspects.map((aspect) => (
          <article key={aspect.id} className="print-avoid-break py-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <div className="flex items-center gap-2 text-xs text-stone-500">
                <span className="font-mono-code font-semibold text-[#1E3A8A] tabular-nums">
                  {aspect.index}
                </span>
                <span aria-hidden="true">·</span>
                <span className="capitalize">{aspect.category}</span>
              </div>
              <h3 className="font-serif-display mt-2 text-xl font-semibold text-stone-900">
                {aspect.title}
              </h3>
              <p className="mt-3 font-mono-code text-xs text-stone-500">
                Stack: {aspect.implementationStack}
              </p>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Current Code Observation
                </p>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">
                  {aspect.currentObservation}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#1E3A8A]">
                  Proposed Enhancement &amp; Impact
                </p>
                <p className="mt-2 text-sm leading-relaxed text-stone-800">
                  {aspect.proposedUpgrade}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-stone-500">
                  Outcome: {aspect.expectedImpact}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Comparative Audit Table */}
      <div className="mt-10 print-avoid-break">
        <h3 className="font-serif-display text-2xl font-semibold text-stone-900">
          Comparative System Audit Matrix
        </h3>
        <div className="mt-4 overflow-x-auto rounded-lg border border-stone-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-stone-200 bg-[#F2EFE9] text-xs font-semibold uppercase tracking-wider text-stone-600">
                <th className="px-4 py-3">Architectural Dimension</th>
                <th className="px-4 py-3">Current Implementation</th>
                <th className="px-4 py-3">Recommended Future Standard</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {CODE_AUDIT_MATRIX.map((row) => (
                <tr key={row.dimension} className="align-top">
                  <td className="px-4 py-3.5 font-semibold text-stone-900 whitespace-nowrap">
                    {row.dimension}
                  </td>
                  <td className="px-4 py-3.5 text-stone-600">{row.currentState}</td>
                  <td className="px-4 py-3.5 text-stone-800">{row.recommendedEvolution}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
