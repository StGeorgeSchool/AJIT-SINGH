import test from 'node:test';
import assert from 'node:assert/strict';
import { PYTHON_SOURCE_CODE } from '../data/pythonSource';
import { FUTURE_ASPECTS, SCREENSHOT_STEPS } from '../data/reportContent';
import {
  castSimVote,
  computeConstituencyWinners,
  createInitialSimState,
  extractPythonFunctions,
  filterFutureAspects,
  filterScreenshotSteps,
  generateUniqueCandidateId,
  generateUniqueVoterId,
  isEligibleVoterAge,
  isValidGmailAddress,
  registerSimVoter,
} from './projectAnalysis';

test('extractPythonFunctions finds all 12 functions and __main__ entry point', () => {
  const fns = extractPythonFunctions(PYTHON_SOURCE_CODE);
  const names = fns.map((f) => f.name);
  assert.deepEqual(names, [
    'admin_password',
    'BLOCK',
    'REGISTER_VOTER',
    'view_results',
    'view_registered_voters',
    'add_candidate',
    'view_candidates',
    'ADMIN_MENU',
    'show_candidates',
    'VOTER_MENU',
    'profile',
    'LOGIN',
    '__main__',
  ]);
  assert.ok(fns.every((f) => f.startLine >= 1 && f.endLine >= f.startLine));
});

test('isValidGmailAddress matches Python partition("@") logic', () => {
  assert.equal(isValidGmailAddress('priyansh@gmail.com'), true);
  assert.equal(isValidGmailAddress('@gmail.com'), false);
  assert.equal(isValidGmailAddress('user@yahoo.com'), false);
  assert.equal(isValidGmailAddress('invalid-email'), false);
});

test('isEligibleVoterAge checks exact 18+ age threshold', () => {
  const refDate = new Date('2026-11-13T00:00:00Z');
  assert.deepEqual(isEligibleVoterAge('2008-11-13', refDate), {
    validFormat: true,
    eligible: true,
  });
  assert.deepEqual(isEligibleVoterAge('2008-11-14', refDate), {
    validFormat: true,
    eligible: false,
  });
  assert.deepEqual(isEligibleVoterAge('13-11-2004', refDate), {
    validFormat: false,
    eligible: false,
  });
});

test('ID generators enforce 10-digit voter and 3-digit candidate bounds without collision', () => {
  let voterAttempt = 0;
  const voterId = generateUniqueVoterId([1000000000], () => (voterAttempt++ === 0 ? 0 : 0.25));
  assert.notEqual(voterId, 1000000000);
  assert.ok(voterId >= 1000000000 && voterId <= 9999999999);

  let candAttempt = 0;
  const candidateId = generateUniqueCandidateId([101], () => (candAttempt++ === 0 ? 0 : 0.5));
  assert.notEqual(candidateId, 101);
  assert.ok(candidateId >= 101 && candidateId <= 999);
});

test('computeConstituencyWinners preserves tied winners per block', () => {
  const winners = computeConstituencyWinners(
    [
      { candidateId: 101, name: 'A', partyName: 'P1', block: 'North', votes: 15 },
      { candidateId: 102, name: 'B', partyName: 'P2', block: 'North', votes: 15 },
      { candidateId: 103, name: 'C', partyName: 'P3', block: 'North', votes: 8 },
      { candidateId: 201, name: 'D', partyName: 'P4', block: 'South', votes: 22 },
    ],
    ['North', 'South', 'Empty']
  );

  assert.equal(winners.length, 2);
  assert.equal(winners[0].block, 'North');
  assert.deepEqual(
    winners[0].winners.map((w) => w.name),
    ['A', 'B']
  );
  assert.equal(winners[1].winners[0].name, 'D');
});

test('simulator prevents underage registration, casts single vote, and blocks duplicate voting', () => {
  const initial = createInitialSimState();
  const refDate = new Date('2026-11-13T00:00:00Z');

  const underageAttempt = registerSimVoter(
    initial,
    {
      name: 'young student',
      fatherName: 'parent name',
      block: 'Bhopal Central',
      mobile: '9988776655',
      dob: '2012-05-01',
      email: 'young@gmail.com',
      password: 'unique_pw_1',
    },
    refDate
  );
  assert.equal(underageAttempt.ok, false);
  assert.match(underageAttempt.error ?? '', /underage/i);

  const validReg = registerSimVoter(
    initial,
    {
      name: 'priyansh dadariya',
      fatherName: 'sanjay dadariya',
      block: 'Bhopal Central',
      mobile: '9988776655',
      dob: '2004-05-01',
      email: 'priyansh.d@gmail.com',
      password: 'unique_pw_1',
    },
    refDate
  );
  assert.equal(validReg.ok, true);
  const newVoterId = validReg.state.activeVoterId!;
  assert.ok(newVoterId >= 1000000000);

  const voteOnce = castSimVote(
    validReg.state,
    { voterId: newVoterId, dob: '2004-05-01', candidateId: 214 },
    refDate
  );
  assert.equal(voteOnce.ok, true);
  const updatedCandidate = voteOnce.state.candidates.find((c) => c.candidateId === 214)!;
  assert.equal(updatedCandidate.votes, 15);

  const voteTwice = castSimVote(
    voteOnce.state,
    { voterId: newVoterId, dob: '2004-05-01', candidateId: 214 },
    refDate
  );
  assert.equal(voteTwice.ok, false);
  assert.match(voteTwice.error ?? '', /already voted/i);
});

test('filterScreenshotSteps and filterFutureAspects return accurate subsets', () => {
  assert.equal(filterScreenshotSteps(SCREENSHOT_STEPS, 'all').length, SCREENSHOT_STEPS.length);
  const voterSteps = filterScreenshotSteps(SCREENSHOT_STEPS, 'voter');
  assert.ok(voterSteps.every((s) => s.track === 'voter' || s.track === 'system'));

  assert.equal(filterFutureAspects(FUTURE_ASPECTS, 'all').length, FUTURE_ASPECTS.length);
  const secAspects = filterFutureAspects(FUTURE_ASPECTS, 'security');
  assert.ok(secAspects.every((a) => a.category === 'security'));
});
