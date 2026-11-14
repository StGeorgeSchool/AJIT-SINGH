/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMemo } from 'react';
import { AlgorithmSection } from './components/AlgorithmSection';
import { CoverAndOverview } from './components/CoverAndOverview';
import { FutureScopeSection } from './components/FutureScopeSection';
import { Header } from './components/Header';
import { ScreenshotsSection } from './components/ScreenshotsSection';
import { SourceCodeSection } from './components/SourceCodeSection';
import { PROJECT_METADATA, PYTHON_SOURCE_CODE } from './data/pythonSource';
import { extractPythonFunctions } from './utils/projectAnalysis';

export default function App() {
  const functions = useMemo(() => extractPythonFunctions(PYTHON_SOURCE_CODE), []);
  const lineCount = useMemo(() => PYTHON_SOURCE_CODE.split('\n').length, []);

  return (
    <div className="min-h-screen bg-[#FAF8F4] text-[#1C1917]">
      <Header />

      <main className="mx-auto max-w-6xl px-6">
        <CoverAndOverview
          functionCount={functions.length}
          lineCount={lineCount}
        />
        <AlgorithmSection />
        <ScreenshotsSection />
        <FutureScopeSection />
        <SourceCodeSection functions={functions} />
      </main>

      <footer className="border-t border-stone-200 bg-[#F2EFE9]/60 py-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 text-xs text-stone-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            {PROJECT_METADATA.schoolName} <span aria-hidden="true">·</span> Computer Science Project Synopsis ({PROJECT_METADATA.academicYear})
          </p>
          <p>
            Submitted by <span className="font-medium text-stone-800">{PROJECT_METADATA.studentName}</span> <span aria-hidden="true">·</span> {PROJECT_METADATA.projectTitle}
          </p>
        </div>
      </footer>
    </div>
  );
}
