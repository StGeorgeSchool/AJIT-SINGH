import type { FutureAspect, FutureCategory, ScreenshotStep, ScreenshotTrack } from '../data/reportContent';

export interface PythonFunctionIndex {
  name: string;
  startLine: number;
  endLine: number;
  lineCount: number;
  role: 'Voter Workflow' | 'Admin Workflow' | 'Shared Helper' | 'Entry Point';
}

export interface SimVoter {
  voterId: number;
  name: string;
  fatherName: string;
  dob: string;
  mobile: string;
  email: string;
  password: string;
  block: string;
  hasVoted: boolean;
}

export interface SimCandidate {
  candidateId: number;
  name: string;
  partyName: string;
  block: string;
  votes: number;
}

export interface SimState {
  blocks: string[];
  voters: SimVoter[];
  candidates: SimCandidate[];
  activeVoterId: number | null;
}

export interface SimActionResult {
  ok: boolean;
  state: SimState;
  terminalOutput: string[];
  error?: string;
}

const FUNCTION_ROLES: Record<string, PythonFunctionIndex['role']> = {
  admin_password: 'Shared Helper',
  BLOCK: 'Shared Helper',
  REGISTER_VOTER: 'Voter Workflow',
  view_results: 'Admin Workflow',
  view_registered_voters: 'Admin Workflow',
  add_candidate: 'Admin Workflow',
  view_candidates: 'Admin Workflow',
  ADMIN_MENU: 'Admin Workflow',
  show_candidates: 'Voter Workflow',
  VOTER_MENU: 'Voter Workflow',
  profile: 'Voter Workflow',
  LOGIN: 'Voter Workflow',
  __main__: 'Entry Point',
};

export function extractPythonFunctions(source: string): PythonFunctionIndex[] {
  const lines = source.split('\n');
  const markers: { name: string; startLine: number }[] = [];

  lines.forEach((line, index) => {
    const defMatch = line.match(/^def\s+([A-Za-z0-9_]+)\s*\(/);
    if (defMatch) {
      markers.push({ name: defMatch[1], startLine: index + 1 });
    } else if (/^if\s+__name__\s*==\s*['"]__main__['"]\s*:/.test(line)) {
      markers.push({ name: '__main__', startLine: index + 1 });
    }
  });

  return markers.map((marker, idx) => {
    const nextStart = idx + 1 < markers.length ? markers[idx + 1].startLine - 1 : lines.length;
    let endLine = nextStart;
    while (endLine > marker.startLine && lines[endLine - 1].trim() === '') {
      endLine--;
    }
    return {
      name: marker.name,
      startLine: marker.startLine,
      endLine,
      lineCount: endLine - marker.startLine + 1,
      role: FUNCTION_ROLES[marker.name] ?? 'Shared Helper',
    };
  });
}

export function filterScreenshotSteps(
  steps: ScreenshotStep[],
  track: ScreenshotTrack
): ScreenshotStep[] {
  if (track === 'all') return steps;
  if (track === 'voter') {
    return steps.filter((step) => step.track === 'voter' || step.track === 'system');
  }
  return steps.filter((step) => step.track === 'admin' || step.track === 'system');
}

export function filterFutureAspects(
  aspects: FutureAspect[],
  category: FutureCategory
): FutureAspect[] {
  if (category === 'all') return aspects;
  return aspects.filter((aspect) => aspect.category === category);
}

export function isValidGmailAddress(email: string): boolean {
  const trimmed = email.trim();
  const atIndex = trimmed.indexOf('@');
  if (atIndex <= 0) return false;
  const domain = trimmed.slice(atIndex + 1);
  return domain === 'gmail.com';
}

export function isValidMobileNumber(mobile: string): boolean {
  return /^\d{10}$/.test(mobile.trim());
}

export function isEligibleVoterAge(dobStr: string, referenceDate: Date = new Date()): {
  validFormat: boolean;
  eligible: boolean;
} {
  const match = dobStr.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) {
    return { validFormat: false, eligible: false };
  }
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  if (
    parsed.getUTCFullYear() !== year ||
    parsed.getUTCMonth() !== month - 1 ||
    parsed.getUTCDate() !== day
  ) {
    return { validFormat: false, eligible: false };
  }

  const cutoff = new Date(
    Date.UTC(
      referenceDate.getUTCFullYear() - 18,
      referenceDate.getUTCMonth(),
      referenceDate.getUTCDate()
    )
  );
  return {
    validFormat: true,
    eligible: parsed.getTime() <= cutoff.getTime(),
  };
}

export function generateUniqueVoterId(
  existingIds: number[],
  rng: () => number = Math.random
): number {
  const existing = new Set(existingIds);
  for (let attempt = 0; attempt < 1000; attempt++) {
    const candidate = 1000000000 + Math.floor(rng() * 9000000000);
    if (!existing.has(candidate)) return candidate;
  }
  throw new Error('Unable to allocate unique 10-digit voter ID');
}

export function generateUniqueCandidateId(
  existingIds: number[],
  rng: () => number = Math.random
): number {
  const existing = new Set(existingIds);
  for (let attempt = 0; attempt < 900; attempt++) {
    const candidate = 101 + Math.floor(rng() * 899);
    if (!existing.has(candidate)) return candidate;
  }
  throw new Error('Unable to allocate unique 3-digit candidate ID');
}

export function computeConstituencyWinners(
  candidates: SimCandidate[],
  blocks: string[]
): { block: string; winners: SimCandidate[]; maxVotes: number }[] {
  const results: { block: string; winners: SimCandidate[]; maxVotes: number }[] = [];
  for (const block of blocks) {
    const inBlock = candidates
      .filter((c) => c.block === block)
      .sort((a, b) => b.votes - a.votes);
    if (inBlock.length === 0) continue;
    const maxVotes = inBlock[0].votes;
    const winners = inBlock.filter((c) => c.votes === maxVotes);
    results.push({ block, winners, maxVotes });
  }
  return results;
}

export function createInitialSimState(): SimState {
  return {
    blocks: ['Bhopal Central', 'Indore North', 'Jabalpur East'],
    voters: [
      {
        voterId: 7482910356,
        name: 'Aarav Sharma',
        fatherName: 'Rajesh Sharma',
        dob: '2004-08-14',
        mobile: '9876543210',
        email: 'aarav.sharma@gmail.com',
        password: 'password123',
        block: 'Bhopal Central',
        hasVoted: false,
      },
      {
        voterId: 8392014421,
        name: 'Priya Joshi',
        fatherName: 'Manoj Joshi',
        dob: '2003-02-22',
        mobile: '9822011223',
        email: 'priya.joshi@gmail.com',
        password: 'priya_secure',
        block: 'Indore North',
        hasVoted: true,
      },
    ],
    candidates: [
      { candidateId: 214, name: 'Ananya Verma', partyName: 'LOK DAL', block: 'Bhopal Central', votes: 14 },
      { candidateId: 589, name: 'Vikram Patel', partyName: 'JANATA SANGH', block: 'Bhopal Central', votes: 11 },
      { candidateId: 412, name: 'Meera Nair', partyName: 'JANTA MORCHA', block: 'Indore North', votes: 19 },
      { candidateId: 635, name: 'Rohan Tiwari', partyName: 'PROGRESSIVE FRONT', block: 'Jabalpur East', votes: 9 },
    ],
    activeVoterId: null,
  };
}

function toTitleCase(value: string): string {
  return value
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export function registerSimVoter(
  state: SimState,
  input: {
    name: string;
    fatherName: string;
    block: string;
    mobile: string;
    dob: string;
    email: string;
    password: string;
  },
  referenceDate: Date = new Date()
): SimActionResult {
  const name = toTitleCase(input.name);
  const fatherName = toTitleCase(input.fatherName);
  const block = toTitleCase(input.block);
  const mobile = input.mobile.trim();
  const email = input.email.trim();
  const password = input.password;

  if (!name || !fatherName) {
    return {
      ok: false,
      state,
      error: 'Elector name and father name are required.',
      terminalOutput: ['________________________________', 'Invalid name input. Try again.', '--------------------------------'],
    };
  }
  if (!state.blocks.includes(block)) {
    return {
      ok: false,
      state,
      error: 'Invalid constituency. Must match a row in the block table.',
      terminalOutput: ['________________________________', 'Invalid consistuency. Try again.', '--------------------------------'],
    };
  }
  if (!isValidMobileNumber(mobile) || state.voters.some((v) => v.mobile === mobile)) {
    return {
      ok: false,
      state,
      error: 'Mobile number must be a unique 10-digit number.',
      terminalOutput: ['________________________________', 'Invalid mobile number. Try again.', '--------------------------------'],
    };
  }
  const ageCheck = isEligibleVoterAge(input.dob, referenceDate);
  if (!ageCheck.validFormat) {
    return {
      ok: false,
      state,
      error: 'Invalid date format. Please use YYYY-MM-DD.',
      terminalOutput: ['________________________________', 'Invalid input fill date as (YYYY-MM-DD)hypen not negotiable.', '--------------------------------'],
    };
  }
  if (!ageCheck.eligible) {
    return {
      ok: false,
      state,
      error: 'Applicant is underage (must be 18 or above to vote).',
      terminalOutput: ['________________________________', 'You are underage,must be 18 or above to vote.', '--------------------------------'],
    };
  }
  if (!isValidGmailAddress(email) || state.voters.some((v) => v.email === email)) {
    return {
      ok: false,
      state,
      error: 'Email must be a unique @gmail.com address.',
      terminalOutput: ['________________________________', 'Enter valid email id as(abc456@gmail.com)', '--------------------------------'],
    };
  }
  if (!password || state.voters.some((v) => v.password === password)) {
    return {
      ok: false,
      state,
      error: 'Password must be non-empty and unique per Python REGISTER_VOTER() rules.',
      terminalOutput: ['________________________________', 'Invalid password. Try again.', '--------------------------------'],
    };
  }

  const voterId = generateUniqueVoterId(state.voters.map((v) => v.voterId));
  const newVoter: SimVoter = {
    voterId,
    name,
    fatherName,
    dob: input.dob.trim(),
    mobile,
    email,
    password,
    block,
    hasVoted: false,
  };

  return {
    ok: true,
    state: {
      ...state,
      voters: [...state.voters, newVoter],
      activeVoterId: voterId,
    },
    terminalOutput: [
      '--- Voter Registration ---',
      `Enter your name: ${name}`,
      `Enter your father name: ${fatherName}`,
      `Enter your consistuency: ${block}`,
      `Enter your mobile no. : ${mobile}`,
      `Enter date of birth as (YYYY-MM-DD): ${input.dob.trim()}`,
      `Enter email id as (abc456@gmail.com): ${email}`,
      '- Generating voter ID please wait -',
      `The voter id sanctioned to you – ${voterId}`,
      'You have registered successfully.',
    ],
  };
}

export function castSimVote(
  state: SimState,
  input: { voterId: number; dob: string; candidateId: number },
  referenceDate: Date = new Date()
): SimActionResult {
  const voter = state.voters.find((v) => v.voterId === input.voterId);
  if (!voter) {
    return {
      ok: false,
      state,
      error: 'Voter ID not found.',
      terminalOutput: ['________________________________', 'Voter ID not found. Please check your Voter ID and try again.', '--------------------------------'],
    };
  }
  if (voter.hasVoted) {
    return {
      ok: false,
      state,
      error: 'You have already voted. Multiple votes are not allowed.',
      terminalOutput: ['________________________________', 'You have already voted. Multiple votes are not allowed.', '--------------------------------'],
    };
  }
  if (voter.dob !== input.dob.trim()) {
    return {
      ok: false,
      state,
      error: 'Incorrect Date Of Birth.',
      terminalOutput: ['________________________________', 'Incorrect Date Of Birth. Try again.', '--------------------------------'],
    };
  }
  const ageCheck = isEligibleVoterAge(voter.dob, referenceDate);
  if (!ageCheck.eligible) {
    return {
      ok: false,
      state,
      error: 'You are underage. Must be 18 or above to vote.',
      terminalOutput: ['________________________________', 'You are underage. Must be 18 or above to vote.', '--------------------------------'],
    };
  }
  const candidate = state.candidates.find(
    (c) => c.candidateId === input.candidateId && c.block === voter.block
  );
  if (!candidate) {
    return {
      ok: false,
      state,
      error: 'Invalid candidate ID for your constituency.',
      terminalOutput: ['________________________________', 'Invalid candidate ID.Try again.', '--------------------------------'],
    };
  }

  return {
    ok: true,
    state: {
      ...state,
      voters: state.voters.map((v) =>
        v.voterId === voter.voterId ? { ...v, hasVoted: true } : v
      ),
      candidates: state.candidates.map((c) =>
        c.candidateId === candidate.candidateId ? { ...c, votes: c.votes + 1 } : c
      ),
    },
    terminalOutput: [
      '---Voter Menu---',
      `Enter your Voter ID: ${voter.voterId}`,
      `Enter your date of birth (YYYY-MM-DD): ${voter.dob}`,
      'Available Candidates:',
      ...state.candidates
        .filter((c) => c.block === voter.block)
        .map((c) => `${c.candidateId} - ${c.name}`),
      `Enter the candidate ID you want to vote for: ${candidate.candidateId}`,
      `${voter.name} has voted succesfully.`,
      'Your vote has been recorded. Thank you for voting!',
    ],
  };
}
