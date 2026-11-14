import { Download } from 'lucide-react';
import { PROJECT_METADATA } from '../data/pythonSource';
import { DATABASE_TABLES } from '../data/reportContent';

interface CoverAndOverviewProps {
  functionCount: number;
  lineCount: number;
}

export function CoverAndOverview({ functionCount, lineCount }: CoverAndOverviewProps) {
  return (
    <section id="overview" className="border-b border-stone-200 pb-16 pt-12">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start">
        <div className="lg:col-span-7">
          <p className="text-xs font-medium uppercase tracking-widest text-stone-500">
            Academic Project Synopsis <span aria-hidden="true">·</span> Session {PROJECT_METADATA.academicYear} <span aria-hidden="true">·</span> Python &amp; MySQL
          </p>

          <h1 className="font-serif-display mt-4 text-4xl font-semibold tracking-tight text-stone-900 sm:text-5xl text-balance leading-[1.12]">
            {PROJECT_METADATA.projectTitle}
          </h1>

          <p className="mt-4 max-w-2xl text-lg text-stone-600 leading-relaxed">
            {PROJECT_METADATA.subtitle}. An analytical documentation of database architecture, voter eligibility algorithms, step-by-step terminal execution, and future engineering scope.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4 no-print">
            <a
              href="#algorithm"
              className="inline-flex items-center rounded-md bg-stone-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-stone-800 whitespace-nowrap shrink-0"
            >
              Read Algorithmic Analysis
            </a>
            <a
              href={PROJECT_METADATA.downloadUrl}
              download="online_voting_system.py"
              className="inline-flex items-center gap-2 rounded-md border border-stone-300 bg-white px-5 py-2.5 text-sm font-medium text-stone-800 transition-colors hover:bg-stone-100 whitespace-nowrap shrink-0"
            >
              <Download className="h-4 w-4 text-stone-600" aria-hidden="true" />
              <span>Download Python File</span>
            </a>
          </div>
        </div>

        <div className="lg:col-span-5 rounded-lg border border-stone-200 bg-white p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#1E3A8A]">
            Submission Cover Sheet
          </p>
          <dl className="mt-4 divide-y divide-stone-200 text-sm">
            <div className="flex items-baseline justify-between gap-4 py-3">
              <dt className="text-stone-500">Institution</dt>
              <dd className="text-right font-semibold text-stone-900">{PROJECT_METADATA.schoolName}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 py-3">
              <dt className="text-stone-500">Submitted By</dt>
              <dd className="text-right font-semibold text-stone-900">Ajit Singh</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 py-3">
              <dt className="text-stone-500">Project Title</dt>
              <dd className="text-right font-medium text-stone-900">{PROJECT_METADATA.projectTitle}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 py-3">
              <dt className="text-stone-500">Source Artifact</dt>
              <dd className="text-right font-mono-code text-xs text-stone-800">{PROJECT_METADATA.fileName}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 py-3">
              <dt className="text-stone-500">Database Schema</dt>
              <dd className="text-right font-mono-code text-xs text-stone-800">{PROJECT_METADATA.databaseName}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 py-3">
              <dt className="text-stone-500">Dependencies</dt>
              <dd className="text-right text-stone-700">{PROJECT_METADATA.libraries.join(', ')}</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* 4-column quantitative specification strip */}
      <div className="mt-12 grid grid-cols-2 gap-6 border-y border-stone-200 py-6 sm:grid-cols-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-stone-500">Relational Tables</p>
          <p className="mt-1 font-serif-display text-3xl font-semibold text-stone-900 tabular-nums">
            {DATABASE_TABLES.length}
          </p>
          <p className="mt-0.5 text-xs text-stone-500">admin, block, voters, candidates</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-stone-500">Program Modules</p>
          <p className="mt-1 font-serif-display text-3xl font-semibold text-stone-900 tabular-nums">
            {functionCount}
          </p>
          <p className="mt-0.5 text-xs text-stone-500">12 functions + __main__ loop</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-stone-500">Source Footprint</p>
          <p className="mt-1 font-serif-display text-3xl font-semibold text-stone-900 tabular-nums">
            {lineCount}
          </p>
          <p className="mt-0.5 text-xs text-stone-500">Verified Python 3 lines</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-stone-500">Execution Figures</p>
          <p className="mt-1 font-serif-display text-3xl font-semibold text-stone-900 tabular-nums">
            8
          </p>
          <p className="mt-0.5 text-xs text-stone-500">Annotated CLI walkthrough plates</p>
        </div>
      </div>

      {/* Executive Abstract & Database Schema */}
      <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h2 className="font-serif-display text-2xl font-semibold text-stone-900">
            Executive Abstract
          </h2>
          <p className="mt-4 text-[15px] leading-7 text-stone-700 first-letter:font-serif-display first-letter:text-5xl first-letter:font-semibold first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:leading-none first-letter:text-stone-900">
            The Online Voting System is a terminal-based electoral application engineered in Python 3 with persistent relational storage on MySQL. Designed to digitize constituency-level elections, it separates administrative oversight from citizen balloting through role-gated menus, automated 10-digit Voter ID generation, 18-year eligibility enforcement, and one-person-one-vote database locking.
          </p>
          <p className="mt-4 text-[15px] leading-7 text-stone-700">
            Through static inspection of the submitted script, this synopsis documents the exact algorithmic workflows governing registration, authentication, vote commitment, and tie-aware result tabulation via the <code className="font-mono-code text-xs bg-stone-200/70 px-1.5 py-0.5 rounded">tabulate</code> library.
          </p>
        </div>

        <div className="lg:col-span-7">
          <h2 className="font-serif-display text-2xl font-semibold text-stone-900">
            Inferred MySQL Database Architecture
          </h2>
          <p className="mt-2 text-sm text-stone-600">
            Schema reconstructed from all SQL <code className="font-mono-code text-xs">SELECT</code>, <code className="font-mono-code text-xs">INSERT</code>, <code className="font-mono-code text-xs">UPDATE</code>, and <code className="font-mono-code text-xs">INNER JOIN</code> statements in the source file.
          </p>

          <div className="mt-5 overflow-x-auto rounded-lg border border-stone-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-stone-200 bg-[#F2EFE9] text-xs font-semibold uppercase tracking-wider text-stone-600">
                  <th className="px-4 py-3">Table</th>
                  <th className="px-4 py-3">Key Columns</th>
                  <th className="px-4 py-3">Functional Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {DATABASE_TABLES.map((table) => (
                  <tr key={table.tableName} className="align-top">
                    <td className="px-4 py-3.5 font-mono-code text-xs font-semibold text-[#1E3A8A] whitespace-nowrap">
                      {table.tableName}
                    </td>
                    <td className="px-4 py-3.5 font-mono-code text-xs text-stone-700">
                      {table.columns.map((c) => c.name).join(', ')}
                    </td>
                    <td className="px-4 py-3.5 text-xs leading-relaxed text-stone-600">
                      {table.purpose}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
