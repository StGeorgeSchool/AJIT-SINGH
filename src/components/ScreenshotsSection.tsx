import { useState, type FormEvent } from 'react';
import { Terminal, RotateCcw } from 'lucide-react';
import { SCREENSHOT_STEPS, type ScreenshotTrack } from '../data/reportContent';
import {
  castSimVote,
  computeConstituencyWinners,
  createInitialSimState,
  filterScreenshotSteps,
  registerSimVoter,
  type SimState,
} from '../utils/projectAnalysis';

function formatTerminalLine(line: string, index: number) {
  const isPrompt =
    line.startsWith('$') ||
    line.startsWith('Enter ') ||
    line.startsWith('Set ') ||
    line.startsWith('Please choose');
  const isBanner =
    line.startsWith('=====') ||
    line.startsWith('---') ||
    line.startsWith('======');
  const isTable = line.startsWith('+') || line.startsWith('|');

  let toneClass = 'text-stone-200';
  if (isBanner) toneClass = 'text-amber-300 font-semibold';
  else if (isPrompt) toneClass = 'text-sky-300';
  else if (isTable) toneClass = 'text-emerald-200';
  else if (line.includes('successfully') || line.includes('recorded') || line.includes('won with')) {
    toneClass = 'text-emerald-300 font-medium';
  }

  const wrapClass = isTable ? 'whitespace-pre' : 'whitespace-pre-wrap break-words';

  return (
    <div key={index} className={`${wrapClass} ${toneClass}`}>
      {line === '' ? '\u00A0' : line}
    </div>
  );
}

export function ScreenshotsSection() {
  const [track, setTrack] = useState<ScreenshotTrack>('all');
  const [simState, setSimState] = useState<SimState>(() => createInitialSimState());
  const [simMode, setSimMode] = useState<'register' | 'vote' | 'results'>('register');
  const [simOutput, setSimOutput] = useState<string[]>([
    '===== ONLINE VOTING SYSTEM (Interactive Sandbox) =====',
    'Select a workflow tab above to test real Python validation rules.',
  ]);
  const [simError, setSimError] = useState<string | null>(null);

  // Register form state
  const [regName, setRegName] = useState('Priyansh Dadariya');
  const [regFather, setRegFather] = useState('Sanjay Dadariya');
  const [regBlock, setRegBlock] = useState('Bhopal Central');
  const [regMobile, setRegMobile] = useState('9893011224');
  const [regDob, setRegDob] = useState('2005-06-15');
  const [regEmail, setRegEmail] = useState('priyansh.dadariya@gmail.com');
  const [regPassword, setRegPassword] = useState('vote_pass_01');

  // Vote form state
  const [voteVoterId, setVoteVoterId] = useState('7482910356');
  const [voteDob, setVoteDob] = useState('2004-08-14');
  const [voteCandidateId, setVoteCandidateId] = useState('214');

  const visibleSteps = filterScreenshotSteps(SCREENSHOT_STEPS, track);
  const winnersSummary = computeConstituencyWinners(simState.candidates, simState.blocks);

  const handleRegisterSubmit = (e: FormEvent) => {
    e.preventDefault();
    const res = registerSimVoter(simState, {
      name: regName,
      fatherName: regFather,
      block: regBlock,
      mobile: regMobile,
      dob: regDob,
      email: regEmail,
      password: regPassword,
    });
    setSimState(res.state);
    setSimOutput(res.terminalOutput);
    setSimError(res.ok ? null : (res.error ?? 'Validation error'));
    if (res.ok && res.state.activeVoterId) {
      setVoteVoterId(String(res.state.activeVoterId));
      setVoteDob(regDob);
    }
  };

  const handleVoteSubmit = (e: FormEvent) => {
    e.preventDefault();
    const res = castSimVote(simState, {
      voterId: Number(voteVoterId),
      dob: voteDob,
      candidateId: Number(voteCandidateId),
    });
    setSimState(res.state);
    setSimOutput(res.terminalOutput);
    setSimError(res.ok ? null : (res.error ?? 'Vote validation failed'));
  };

  const handleResetSim = () => {
    setSimState(createInitialSimState());
    setSimError(null);
    setVoteVoterId('7482910356');
    setVoteDob('2004-08-14');
    setVoteCandidateId('214');
    setSimOutput([
      '===== ONLINE VOTING SYSTEM (Sandbox Reset) =====',
      'Database restored to initial sample records.',
    ]);
  };

  const selectedVoterRecord = simState.voters.find(
    (v) => v.voterId === Number(voteVoterId)
  );
  const availableCandidatesForVoter = selectedVoterRecord
    ? simState.candidates.filter((c) => c.block === selectedVoterRecord.block)
    : simState.candidates;

  return (
    <section id="screenshots" className="border-b border-stone-200 py-16 print-break-before">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#1E3A8A]">
            Section 02 <span aria-hidden="true">·</span> Visual Execution Walkthrough
          </p>
          <h2 className="font-serif-display mt-2 text-3xl font-semibold text-stone-900">
            Step-by-Step Terminal Screenshots
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-stone-600">
            Sequential CLI execution plates reconstructed verbatim from the program’s <code className="font-mono-code text-xs">print()</code> prompts, input validations, and <code className="font-mono-code text-xs">tabulate</code> outputs.
          </p>
        </div>

        <div
          role="group"
          aria-label="Filter screenshot steps"
          className="no-print flex items-center gap-1 rounded-lg bg-[#F2EFE9] p-1 self-start"
        >
          {(
            [
              { id: 'all', label: 'All Steps (8)' },
              { id: 'voter', label: 'Voter Journey' },
              { id: 'admin', label: 'Admin Console' },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTrack(item.id)}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                track === item.id
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Annotated Screenshot Plates */}
      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-2">
        {visibleSteps.map((step) => (
          <figure
            key={step.id}
            className="print-avoid-break flex flex-col rounded-lg border border-stone-200 bg-white overflow-hidden"
          >
            <div className="border-b border-stone-200 bg-[#F2EFE9] px-5 py-3">
              <p className="text-xs font-semibold text-stone-900">
                {step.figureNumber} — {step.stepTitle}
              </p>
              <div className="mt-1 flex flex-wrap items-center justify-between gap-2 font-mono-code text-[11px] text-stone-500">
                <span>{step.functionRef}</span>
                <span className="text-stone-600">{step.commandOrEntry}</span>
              </div>
            </div>

            <div
              aria-label={`${step.figureNumber} terminal output`}
              className="bg-[#141312] p-4 font-mono-code text-[11px] leading-5 overflow-x-auto"
            >
              <div className="mb-2.5 flex items-center gap-1.5 border-b border-stone-800 pb-2 text-[10px] text-stone-400">
                <Terminal className="h-3 w-3 text-stone-400" aria-hidden="true" />
                <span>python3 — online_voting_system_e2f14e45.py</span>
              </div>
              {step.terminalLines.map((line, i) => formatTerminalLine(line, i))}
            </div>

            <figcaption className="flex-1 p-5 text-sm">
              <p className="leading-relaxed text-stone-700">{step.explanation}</p>
              <p className="mt-3 border-t border-stone-100 pt-3 text-xs leading-relaxed text-stone-500">
                <strong className="font-semibold text-stone-800">Analyst Note:</strong> {step.keyObservation}
              </p>
            </figcaption>
          </figure>
        ))}
      </div>

      {/* Interactive Python Logic Simulator */}
      <div className="no-print mt-14 rounded-lg border border-stone-200 bg-white p-6">
        <div className="flex flex-col gap-4 border-b border-stone-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#1E3A8A]">
              Interactive Verification Sandbox
            </p>
            <h3 className="font-serif-display mt-1 text-2xl font-semibold text-stone-900">
              Test the Python Electoral Rules Live
            </h3>
            <p className="mt-1 text-sm text-stone-600">
              Executes the exact age, Gmail, constituency, single-vote lock, and tie-aware tabulation logic from the script.
            </p>
          </div>
          <button
            type="button"
            onClick={handleResetSim}
            className="inline-flex items-center gap-1.5 self-start rounded-md border border-stone-300 bg-white px-3.5 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-100 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Reset Sandbox</span>
          </button>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {(
            [
              { id: 'register', label: '1. Register Voter (REGISTER_VOTER)' },
              { id: 'vote', label: '2. Cast Ballot (VOTER_MENU)' },
              { id: 'results', label: '3. Final Results (view_results)' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setSimMode(tab.id);
                setSimError(null);
              }}
              className={`rounded-md px-4 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                simMode === tab.id
                  ? 'bg-stone-900 text-white'
                  : 'bg-[#F2EFE9] text-stone-700 hover:bg-stone-200/80'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-6">
            {simMode === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="sim-name" className="block text-xs font-medium text-stone-700">
                      Elector Name
                    </label>
                    <input
                      id="sim-name"
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-900 focus:border-[#1E3A8A] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="sim-father" className="block text-xs font-medium text-stone-700">
                      Father&apos;s Name
                    </label>
                    <input
                      id="sim-father"
                      type="text"
                      value={regFather}
                      onChange={(e) => setRegFather(e.target.value)}
                      className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-900 focus:border-[#1E3A8A] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="sim-block" className="block text-xs font-medium text-stone-700">
                      Constituency (block)
                    </label>
                    <select
                      id="sim-block"
                      value={regBlock}
                      onChange={(e) => setRegBlock(e.target.value)}
                      className="mt-1 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 focus:border-[#1E3A8A] focus:outline-none"
                    >
                      {simState.blocks.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="sim-mobile" className="block text-xs font-medium text-stone-700">
                      10-Digit Mobile No.
                    </label>
                    <input
                      id="sim-mobile"
                      type="text"
                      value={regMobile}
                      onChange={(e) => setRegMobile(e.target.value)}
                      className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 font-mono-code text-sm text-stone-900 focus:border-[#1E3A8A] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="sim-dob" className="block text-xs font-medium text-stone-700">
                      Date of Birth (YYYY-MM-DD)
                    </label>
                    <input
                      id="sim-dob"
                      type="text"
                      value={regDob}
                      onChange={(e) => setRegDob(e.target.value)}
                      placeholder="YYYY-MM-DD"
                      className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 font-mono-code text-sm text-stone-900 focus:border-[#1E3A8A] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="sim-email" className="block text-xs font-medium text-stone-700">
                      Gmail Address
                    </label>
                    <input
                      id="sim-email"
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-900 focus:border-[#1E3A8A] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="sim-password" className="block text-xs font-medium text-stone-700">
                    Account Password
                  </label>
                  <input
                    id="sim-password"
                    type="text"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 font-mono-code text-sm text-stone-900 focus:border-[#1E3A8A] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="rounded-md bg-[#1E3A8A] px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#172D6B] cursor-pointer"
                >
                  Run REGISTER_VOTER()
                </button>
              </form>
            )}

            {simMode === 'vote' && (
              <form onSubmit={handleVoteSubmit} className="space-y-4">
                <div>
                  <label htmlFor="vote-voter-id" className="block text-xs font-medium text-stone-700">
                    Select / Enter Voter ID
                  </label>
                  <select
                    id="vote-voter-id"
                    value={voteVoterId}
                    onChange={(e) => {
                      const nextId = e.target.value;
                      setVoteVoterId(nextId);
                      const v = simState.voters.find((item) => String(item.voterId) === nextId);
                      if (v) {
                        setVoteDob(v.dob);
                        const firstCand = simState.candidates.find((c) => c.block === v.block);
                        if (firstCand) setVoteCandidateId(String(firstCand.candidateId));
                      }
                    }}
                    className="mt-1 w-full rounded-md border border-stone-300 bg-white px-3 py-2 font-mono-code text-sm text-stone-900 focus:border-[#1E3A8A] focus:outline-none"
                  >
                    {simState.voters.map((v) => (
                      <option key={v.voterId} value={v.voterId}>
                        {v.voterId} — {v.name} ({v.block}) [{v.hasVoted ? 'Voted' : 'Eligible'}]
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="vote-dob" className="block text-xs font-medium text-stone-700">
                    Confirm Date of Birth (YYYY-MM-DD)
                  </label>
                  <input
                    id="vote-dob"
                    type="text"
                    value={voteDob}
                    onChange={(e) => setVoteDob(e.target.value)}
                    className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 font-mono-code text-sm text-stone-900 focus:border-[#1E3A8A] focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="vote-candidate" className="block text-xs font-medium text-stone-700">
                    Constituency Candidates (show_candidates)
                  </label>
                  <select
                    id="vote-candidate"
                    value={voteCandidateId}
                    onChange={(e) => setVoteCandidateId(e.target.value)}
                    className="mt-1 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 focus:border-[#1E3A8A] focus:outline-none"
                  >
                    {availableCandidatesForVoter.map((c) => (
                      <option key={c.candidateId} value={c.candidateId}>
                        {c.candidateId} — {c.name} ({c.partyName}) · {c.votes} votes
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="rounded-md bg-[#1E3A8A] px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#172D6B] cursor-pointer"
                >
                  Run VOTER_MENU() Vote Commit
                </button>
              </form>
            )}

            {simMode === 'results' && (
              <div className="space-y-4">
                <p className="text-sm text-stone-600">
                  Live constituency winners computed using the exact descending sort and tie-handling logic from <code className="font-mono-code text-xs">view_results()</code> Option 4:
                </p>
                <div className="overflow-x-auto rounded-lg border border-stone-200">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-stone-200 bg-[#F2EFE9] text-stone-600 uppercase">
                      <tr>
                        <th className="px-3 py-2.5">Block</th>
                        <th className="px-3 py-2.5">Leading Candidate(s)</th>
                        <th className="px-3 py-2.5">Party</th>
                        <th className="px-3 py-2.5 text-right">Votes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200">
                      {winnersSummary.map((entry) =>
                        entry.winners.map((w) => (
                          <tr key={w.candidateId}>
                            <td className="px-3 py-2.5 font-medium text-stone-900">{entry.block}</td>
                            <td className="px-3 py-2.5 text-stone-800">
                              {w.name} {entry.winners.length > 1 ? '(Tied)' : ''}
                            </td>
                            <td className="px-3 py-2.5 font-mono-code text-stone-600">{w.partyName}</td>
                            <td className="px-3 py-2.5 text-right font-mono-code font-semibold text-stone-900 tabular-nums">
                              {w.votes}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {simError && (
              <p
                role="alert"
                className="mt-4 rounded-md border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-medium text-red-800"
              >
                Validation Blocked: {simError}
              </p>
            )}
          </div>

          <div className="lg:col-span-6">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-stone-500">
              Simulated CLI Output Stream
            </p>
            <div
              data-testid="sim-terminal-output"
              className="min-h-[260px] rounded-lg bg-[#141312] p-4 font-mono-code text-xs leading-6 overflow-x-auto"
            >
              {simOutput.map((line, i) => formatTerminalLine(line, i))}
            </div>
            <p className="mt-3 text-xs text-stone-500 tabular-nums">
              Active Simulated Records: {simState.voters.length} registered voters · {simState.voters.filter((v) => v.hasVoted).length} votes cast · {simState.candidates.length} candidates
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
