export interface DatabaseTableSpec {
  tableName: string;
  purpose: string;
  columns: { name: string; inferredType: string; role: string }[];
  referencedIn: string[];
}

export interface AlgorithmSpec {
  id: string;
  number: string;
  title: string;
  functionsCovered: string[];
  lineRange: string;
  summary: string;
  inputs: string[];
  outputs: string[];
  steps: {
    stepNo: string;
    heading: string;
    detail: string;
    sqlOrValidation?: string;
  }[];
  pseudocode: string;
  complexityAndConstraint: string;
}

export type ScreenshotTrack = 'all' | 'voter' | 'admin';

export interface ScreenshotStep {
  id: string;
  figureNumber: string;
  stepTitle: string;
  track: 'voter' | 'admin' | 'system';
  functionRef: string;
  commandOrEntry: string;
  terminalLines: string[];
  explanation: string;
  keyObservation: string;
}

export type FutureCategory = 'all' | 'security' | 'architecture' | 'analytics';

export interface FutureAspect {
  id: string;
  index: string;
  title: string;
  category: 'security' | 'architecture' | 'analytics';
  currentObservation: string;
  proposedUpgrade: string;
  expectedImpact: string;
  implementationStack: string;
}

export const DATABASE_TABLES: DatabaseTableSpec[] = [
  {
    tableName: 'admin',
    purpose: 'Stores the administrative credential checked prior to opening the management console.',
    columns: [
      { name: 'password', inferredType: 'VARCHAR (A[0])', role: 'Master admin password fetched by admin_password()' },
    ],
    referencedIn: ['admin_password()'],
  },
  {
    tableName: 'block',
    purpose: 'Master lookup table of authorized electoral constituencies used to validate voters and candidates.',
    columns: [
      { name: 'block_name', inferredType: 'VARCHAR (Primary Key)', role: 'Constituency identifier joined with candidates.block' },
    ],
    referencedIn: ['BLOCK()', 'view_candidates()'],
  },
  {
    tableName: 'voters',
    purpose: 'Stores registered citizen identities, contact credentials, assigned constituency, and vote status.',
    columns: [
      { name: 'voter_id', inferredType: 'BIGINT (10-digit)', role: 'Unique random ID between 1000000000 and 9999999999' },
      { name: 'voter_name', inferredType: 'VARCHAR', role: 'Title-cased elector full name' },
      { name: 'father_name', inferredType: 'VARCHAR', role: 'Title-cased parent/guardian name' },
      { name: 'dob', inferredType: 'DATE (YYYY-MM-DD)', role: 'Used for 18+ age verification at registration & voting' },
      { name: 'mobile_no', inferredType: 'BIGINT (10-digit)', role: 'Unique 10-digit contact number' },
      { name: 'email_id', inferredType: 'VARCHAR', role: 'Unique @gmail.com login identifier' },
      { name: 'password', inferredType: 'VARCHAR', role: 'Unique account password verified at LOGIN()' },
      { name: 'block', inferredType: 'VARCHAR (FK -> block)', role: 'Assigned electoral constituency' },
      { name: 'has_voted', inferredType: 'BOOLEAN / TINYINT(1)', role: 'Initialized to 0; set to TRUE after casting vote' },
    ],
    referencedIn: ['REGISTER_VOTER()', 'LOGIN()', 'profile()', 'VOTER_MENU()', 'view_registered_voters()', 'ADMIN_MENU()'],
  },
  {
    tableName: 'candidates',
    purpose: 'Maintains nominated candidates per party and constituency along with live cumulative vote counts.',
    columns: [
      { name: 'candidate_id', inferredType: 'INT (3-digit)', role: 'Unique random ID between 101 and 999' },
      { name: 'candidate_name', inferredType: 'VARCHAR', role: 'Title-cased candidate name' },
      { name: 'party_name', inferredType: 'VARCHAR', role: 'Uppercase party code (unique per constituency)' },
      { name: 'block', inferredType: 'VARCHAR (FK -> block)', role: 'Constituency where candidate contests' },
      { name: 'votes', inferredType: 'INT', role: 'Initialized to 0; incremented atomically on vote submission' },
    ],
    referencedIn: ['add_candidate()', 'view_candidates()', 'show_candidates()', 'VOTER_MENU()', 'view_results()'],
  },
];

export const ALGORITHMS: AlgorithmSpec[] = [
  {
    id: 'master-control',
    number: '01',
    title: 'Master Control Loop & Role-Based Authentication',
    functionsCovered: ['__main__', 'admin_password()', 'LOGIN()', 'profile()'],
    lineRange: 'Lines 15–19, 615–741',
    summary:
      'Establishes the continuous CLI event loop that partitions the application into Administrative Control and Voter Self-Service pathways after verifying credentials against MySQL.',
    inputs: ['Menu selection (1–4)', 'Admin password OR Voter email (@gmail.com) & password'],
    outputs: ['Authenticated session state (ADMIN_MENU or global profile_details)', 'Formatted Voter Profile readout'],
    steps: [
      {
        stepNo: 'Step 1',
        heading: 'Initialize Database Cursor & Main Event Loop',
        detail:
          'At startup, mysql.connector opens a persistent connection to the online_voting_system database with buffered=True. The __main__ block enters an infinite while True loop printing the four top-level entry options.',
      },
      {
        stepNo: 'Step 2',
        heading: 'Admin Credential Verification Branch (Choice 1)',
        detail:
          'Prompts for admin password and invokes admin_password(), which executes SELECT * FROM admin and compares A[0] against user input. Only an exact match transfers control to ADMIN_MENU().',
        sqlOrValidation: 'SELECT * FROM admin -> compares input == A[0]',
      },
      {
        stepNo: 'Step 3',
        heading: 'Voter Login & Email Domain Validation (Choice 3)',
        detail:
          'LOGIN() enforces a two-stage loop: first validating that the email partitions cleanly into ("...", "@", "gmail.com") and exists in voters; second matching the entered password against the stored record.',
        sqlOrValidation: 'email.partition("@")[2] == "gmail.com" AND SELECT password FROM voters',
      },
      {
        stepNo: 'Step 4',
        heading: 'Session Hydration & Profile/Ballot Dispatch',
        detail:
          'Upon authentication, SELECT * FROM voters fetches the full 9-column tuple into global profile_details. The voter chooses 1 to view profile() (translating boolean index 8 into Yes/No) or 2 to enter VOTER_MENU().',
      },
    ],
    pseudocode: `ALGORITHM MasterControlAndLogin
BEGIN
  LOOP forever
    DISPLAY Menu (1:Admin, 2:Register, 3:Login, 4:Exit)
    READ choice
    IF choice == '1' THEN
      READ pwd
      admin_pw <- FETCH_ONE("SELECT * FROM admin")[0]
      IF pwd == admin_pw THEN CALL ADMIN_MENU()
      ELSE PRINT "Incorrect Password."
    ELSE IF choice == '2' THEN
      CALL REGISTER_VOTER()
    ELSE IF choice == '3' THEN
      REPEAT
        READ email
        VALIDATE email.partition("@") == (_, "@", "gmail.com")
        rec <- FETCH("SELECT password FROM voters ...")
      UNTIL rec IS NOT NULL
      VALIDATE input_password == rec.password
      profile_details <- FETCH("SELECT * FROM voters ...")
      DISPATCH 1 -> profile() OR 2 -> VOTER_MENU()
    ELSE IF choice == '4' THEN
      BREAK
  END LOOP
END`,
    complexityAndConstraint:
      'Time Complexity: O(1) per authentication lookup (indexed/small lookup per email); relies on global state profile_details to pass authenticated context between LOGIN(), profile(), show_candidates(), and VOTER_MENU().',
  },
  {
    id: 'voter-registration',
    number: '02',
    title: 'Voter Registration, Validation & Unique ID Allocation',
    functionsCovered: ['REGISTER_VOTER()', 'BLOCK()'],
    lineRange: 'Lines 21–181',
    summary:
      'Implements a multi-gate validation pipeline ensuring every registered voter belongs to an approved constituency, owns unique contact credentials, satisfies the 18-year age threshold, and receives a collision-free 10-digit Voter ID.',
    inputs: ['Elector Name', 'Father Name', 'Constituency', '10-digit Mobile', 'DOB (YYYY-MM-DD)', 'Gmail ID', 'Password'],
    outputs: ['Unique 10-digit voter_id', 'Committed row in voters table with has_voted = 0'],
    steps: [
      {
        stepNo: 'Step 1',
        heading: 'Name Normalization & Constituency Membership Check',
        detail:
          'Elector and father names are sanitized via .strip().title(). BLOCK() loads all constituencies from the block table into global list b, and rejects any input not present in b (allowing graceful exit with "0").',
        sqlOrValidation: 'SELECT * FROM block -> block in b',
      },
      {
        stepNo: 'Step 2',
        heading: '10-Digit Mobile Parsing & Uniqueness Gate',
        detail:
          'Casts mobile input to int inside try/except, verifies string length == 10, and queries voters to ensure no duplicate mobile number exists in the database.',
        sqlOrValidation: 'len(str(mobile_no)) == 10 AND SELECT * FROM voters WHERE mobile_no=...',
      },
      {
        stepNo: 'Step 3',
        heading: 'Date Parsing & Minimum Age Threshold (18+)',
        detail:
          'Parses DOB strictly using datetime.strptime(DOB, "%Y-%m-%d"). Computes year1 - year2 against datetime.today(). If strictly under 18, registration aborts immediately.',
      },
      {
        stepNo: 'Step 4',
        heading: 'Email/Password Uniqueness & Collision-Free 10-Digit ID Generation',
        detail:
          'Verifies unique @gmail.com email and unique confirmed password. After explicit confirmation (y/Y), generates random.randint(1000000000, 9999999999) in a loop until the ID is absent from existing voter_id records, then commits the INSERT.',
        sqlOrValidation: 'INSERT INTO voters VALUES (voter_id, ..., block, 0)',
      },
    ],
    pseudocode: `ALGORITHM RegisterVoter
BEGIN
  READ elector_name, father_name (title-cased)
  CALL BLOCK() -> load valid constituencies b
  WHILE block NOT IN b: PROMPT retry or exit('0')
  WHILE mobile invalid OR len != 10 OR EXISTS:
    PROMPT retry or exit('0')
  PARSE DOB with "%Y-%m-%d"
  IF (today.year - DOB.year) < 18 THEN
    RETURN "underage"
  VALIDATE email ends with "@gmail.com" & unique
  VALIDATE password unique AND password == confirm
  IF confirm IN ['y', 'Y'] THEN
    ids <- FETCH_ALL("SELECT voter_id FROM voters")
    REPEAT
      voter_id <- RANDOM(1000000000, 9999999999)
    UNTIL voter_id NOT IN ids
    INSERT INTO voters VALUES (voter_id, ..., 0)
    COMMIT
  END IF
END`,
    complexityAndConstraint:
      'Collision probability for random 10-digit IDs (9 × 10^9 keyspace) is negligible for school/regional datasets; note that year-difference age check at registration is tightened to exact month/day date comparison inside VOTER_MENU().',
  },
  {
    id: 'balloting',
    number: '03',
    title: 'Constituency-Scoped Balloting & Double-Vote Prevention',
    functionsCovered: ['VOTER_MENU()', 'show_candidates()'],
    lineRange: 'Lines 466–613',
    summary:
      'Enforces identity re-verification, exact calendar-day 18+ eligibility, single-vote locking via has_voted, constituency-filtered candidate presentation, and transactional vote commitment.',
    inputs: ['Voter ID confirmation', 'DOB re-verification', 'Selected Candidate ID'],
    outputs: ['Incremented candidate votes (+1)', 'Locked voter record (has_voted = TRUE)'],
    steps: [
      {
        stepNo: 'Step 1',
        heading: 'Session Voter ID & Duplicate-Vote Guard',
        detail:
          'Requires the logged-in user to re-enter their 10-digit Voter ID and verifies it matches profile_details[0]. Queries SELECT has_voted FROM voters; if truthy, blocks execution with "Multiple votes are not allowed."',
        sqlOrValidation: 'profile_details[0] == voter_id AND result[0] == 0',
      },
      {
        stepNo: 'Step 2',
        heading: 'Exact Calendar-Day Age & Identity Check',
        detail:
          'Computes eighteen_year_ago = date(today.year - 18, today.month, today.day) and checks both that stored dob <= eighteen_year_ago and that the entered DOB matches the stored database date.',
      },
      {
        stepNo: 'Step 3',
        heading: 'Constituency Candidate Filtering',
        detail:
          'show_candidates() extracts the voter constituency from profile_details[7] and displays only candidates registered in that constituency (ID - Name). Returns None if the constituency has no candidates.',
        sqlOrValidation: 'SELECT * FROM candidates WHERE block = profile_details[7]',
      },
      {
        stepNo: 'Step 4',
        heading: 'Atomic Ballot Commit',
        detail:
          'Validates candidate_id existence via parameterized query, executes UPDATE candidates SET votes=votes+1, flips has_voted=TRUE on voters, and commits both updates in one transaction.',
        sqlOrValidation: 'UPDATE candidates SET votes=votes+1; UPDATE voters SET has_voted=TRUE; COMMIT',
      },
    ],
    pseudocode: `ALGORITHM CastBallot
BEGIN
  READ voter_id
  IF voter_id != profile_details[0] THEN RETRY
  voted <- FETCH("SELECT has_voted FROM voters ...")
  IF voted IS TRUE THEN
    RETURN "Multiple votes are not allowed"
  READ dob_str -> PARSE dob
  cutoff <- DATE(today.year - 18, today.month, today.day)
  db_dob <- FETCH("SELECT dob FROM voters ...")
  IF cutoff < db_dob THEN RETURN "Underage"
  IF dob != db_dob THEN RETRY
  IF show_candidates(profile_details[7]) IS EMPTY:
    RETURN
  READ candidate_id
  IF EXISTS candidate_id IN candidates THEN
    UPDATE candidates SET votes = votes + 1
    UPDATE voters SET has_voted = TRUE
    COMMIT
  END IF
END`,
    complexityAndConstraint:
      'Both UPDATE queries commit together on the same MySQL connection, preventing partial state where a vote increments without marking has_voted.',
  },
  {
    id: 'admin-tabulation',
    number: '04',
    title: 'Candidate Nomination, Analytics & Tie-Aware Winner Resolution',
    functionsCovered: ['ADMIN_MENU()', 'add_candidate()', 'view_candidates()', 'view_registered_voters()', 'view_results()'],
    lineRange: 'Lines 183–464',
    summary:
      'Provides administrative controls for single-party-per-constituency nomination, relational JOIN reporting, constituency voter roll filtering, and descending vote-sort winner resolution that preserves tied leaders.',
    inputs: ['Admin action (1–5)', 'Candidate details (Name, Block, Party)', 'Result filter mode (1, 2, 4, 5)'],
    outputs: ['3-digit candidate_id (101–999)', 'Formatted tabulate fancy_grid & psql ASCII reports'],
    steps: [
      {
        stepNo: 'Step 1',
        heading: 'Single-Party-Per-Constituency Nomination Check',
        detail:
          'add_candidate() validates constituency via BLOCK(), normalizes party_name to UPPERCASE, and rejects registration if that party already fielded a candidate in the same block. Assigns a unique 3-digit ID (101–999).',
        sqlOrValidation: 'SELECT party_name FROM candidates WHERE block=... -> INSERT (101..999)',
      },
      {
        stepNo: 'Step 2',
        heading: 'Voter Roll Aggregation & Surname Search',
        detail:
          'ADMIN_MENU option 3 supports GROUP BY block HAVING voted_count > 0 counts, full/block-filtered voter tables via tabulate(..., tablefmt="psql"), and wildcard suffix search using LIKE %title.',
      },
      {
        stepNo: 'Step 3',
        heading: 'Relational Candidate Registry (INNER JOIN)',
        detail:
          'view_candidates() executes an INNER JOIN between candidates and block on c.block = b.block_name, formatting output as a fancy_grid table.',
      },
      {
        stepNo: 'Step 4',
        heading: 'Tie-Aware Final Result Tabulation (Choice 4)',
        detail:
          'Iterates across every constituency in b, querying candidates ordered by votes DESC. Captures max_votes = results[0][2] and appends every candidate matching max_votes before breaking—accurately surfacing ties in the final fancy_grid summary.',
        sqlOrValidation: 'ORDER BY votes DESC -> collect all rows where r[2] == max_votes',
      },
    ],
    pseudocode: `ALGORITHM TabulateFinalResults
BEGIN
  CALL BLOCK() -> b
  final_result <- []
  FOR EACH block IN b DO
    rows <- FETCH_ALL(
      "SELECT candidate_id, candidate_name, votes,
              party_name, block
       FROM candidates WHERE block = block
       ORDER BY votes DESC"
    )
    IF rows IS EMPTY THEN CONTINUE
    max_votes <- rows[0].votes
    FOR EACH row IN rows DO
      IF row.votes == max_votes THEN
        APPEND row TO final_result
      ELSE
        BREAK
      END IF
    END FOR
  END FOR
  PRINT tabulate(final_result, tablefmt="fancy_grid")
END`,
    complexityAndConstraint:
      'Time Complexity: O(B · C log C) where B is the number of constituencies and C is candidates per block; handles exact vote ties without silently dropping co-winners.',
  },
];

export const SCREENSHOT_STEPS: ScreenshotStep[] = [
  {
    id: 'step-1',
    figureNumber: 'Fig. 1',
    stepTitle: 'Application Launch & Main Menu Dispatch',
    track: 'system',
    functionRef: '__main__ (Lines 713–741)',
    commandOrEntry: 'python online_voting_system_e2f14e45.py',
    terminalLines: [
      '$ python online_voting_system_e2f14e45.py',
      '',
      '===== ONLINE VOTING SYSTEM =====',
      '1. Admin Login',
      '2. Register as Voter',
      '3. Login',
      '4. Exit',
      'Enter your choice: 2',
    ],
    explanation:
      'Upon launching the Python script, the MySQL connector initializes a buffered cursor against the online_voting_system database and presents the primary 4-option CLI menu.',
    keyObservation:
      'Entry options isolate administrative authority (1), citizen onboarding (2), and authenticated balloting (3).',
  },
  {
    id: 'step-2',
    figureNumber: 'Fig. 2',
    stepTitle: 'New Voter Registration & 10-Digit Voter ID Allocation',
    track: 'voter',
    functionRef: 'REGISTER_VOTER() (Lines 30–181)',
    commandOrEntry: 'Main Menu -> 2 (Register as Voter)',
    terminalLines: [
      '--- Voter Registration ---',
      '',
      '...',
      'Enter your name: Aarav Sharma',
      'Enter your father name: Rajesh Sharma',
      'Enter your consistuency: Bhopal Central',
      'Enter your mobile no. : 9876543210',
      'Enter date of birth as (YYYY-MM-DD): 2004-08-14',
      'Enter email id as (abc456@gmail.com): aarav.sharma@gmail.com',
      'Set a password: ********',
      'Enter the password again: ********',
      '',
      'WARNING: The details you filled are permanent. You cannot change it later.',
      '',
      'Enter y/Y to continue or Enter anything else to return: y',
      '',
      '- Generating voter ID please wait -',
      'The voter id sanctioned to you –  7482910356',
      '',
      'You have registered successfully.',
      'Start voting through the online_voting_system and immortalize the democracy by alligning it with digital platforms.',
      '...',
    ],
    explanation:
      'The registration workflow validates constituency membership via BLOCK(), enforces a 10-digit unique mobile number, checks age >= 18 from YYYY-MM-DD, validates @gmail.com syntax, confirms password match, and issues a collision-checked 10-digit Voter ID.',
    keyObservation:
      'Underage applicants (< 18 years) or duplicate email/mobile entries are immediately halted before reaching the INSERT statement.',
  },
  {
    id: 'step-3',
    figureNumber: 'Fig. 3',
    stepTitle: 'Voter Login & Profile Verification Readout',
    track: 'voter',
    functionRef: 'LOGIN() -> profile() (Lines 615–711)',
    commandOrEntry: 'Main Menu -> 3 (Login) -> 1 (View Profile)',
    terminalLines: [
      'Enter Email ID as (abc456@gmail.com): aarav.sharma@gmail.com',
      'Enter your password: ********',
      '',
      '--------------------------------',
      '1. Choose 1 to see your profile.',
      '2. Choose 2 to vote.',
      '--------------------------------',
      'Enter your choice: 1',
      '',
      '________________________________',
      '',
      "- Voter's Profile -",
      '',
      'VOTER ID –  7482910356',
      'NAME –  Aarav Sharma',
      "FATHER'S NAME –  Rajesh Sharma",
      'DATE OF BIRTH –  2004-08-14',
      'MOBILE NUMBER –  9876543210',
      'E-MAIL ID –  aarav.sharma@gmail.com',
      'CONSISTUENCY –  Bhopal Central',
      'VOTED –  No',
      '________________________________',
    ],
    explanation:
      'After verifying the registered Gmail ID and password, LOGIN() populates the global profile_details tuple from MySQL. Choosing option 1 invokes profile(), displaying all identity fields and translating has_voted (0/1) into Yes/No.',
    keyObservation:
      'Voters can inspect their assigned constituency and current ballot status (VOTED – No) before entering the ballot booth.',
  },
  {
    id: 'step-4',
    figureNumber: 'Fig. 4',
    stepTitle: 'Constituency Ballot Casting & Atomic Vote Commit',
    track: 'voter',
    functionRef: 'VOTER_MENU() -> show_candidates() (Lines 466–613)',
    commandOrEntry: 'Login Menu -> 2 (Vote)',
    terminalLines: [
      '---Voter Menu---',
      'Enter your Voter ID: 7482910356',
      'Enter your date of birth (YYYY-MM-DD): 2004-08-14',
      '',
      'Available Candidates:',
      '214 - Ananya Verma',
      '589 - Vikram Patel',
      '',
      'Enter the candidate ID you want to vote for: 214',
      '',
      'Aarav Sharma has voted succesfully.',
      'Your vote has been recorded. Thank you for voting!',
    ],
    explanation:
      'VOTER_MENU() re-verifies the Voter ID against the active session, confirms has_voted is False, enforces exact calendar-day 18+ DOB validation, lists candidates exclusively from Bhopal Central via show_candidates(), increments candidate 214’s vote tally, and sets has_voted = TRUE.',
    keyObservation:
      'Attempting to log back in and vote a second time triggers: "You have already voted. Multiple votes are not allowed."',
  },
  {
    id: 'step-5',
    figureNumber: 'Fig. 5',
    stepTitle: 'Admin Authentication & Control Console',
    track: 'admin',
    functionRef: 'admin_password() -> ADMIN_MENU() (Lines 15–19, 406–464)',
    commandOrEntry: 'Main Menu -> 1 (Admin Login)',
    terminalLines: [
      '===== ONLINE VOTING SYSTEM =====',
      '1. Admin Login',
      '2. Register as Voter',
      '3. Login',
      '4. Exit',
      'Enter your choice: 1',
      'Enter admin password: ********',
      '',
      '--- Admin Menu ---',
      '1. Add Candidate',
      '2. View Results',
      '3. View Registered Voters',
      '4. View Registered Candidates',
      '5. Exit to Main Menu',
      'Enter your choice: 1',
    ],
    explanation:
      'Admin login compares the entered password against the admin table in MySQL. Once authenticated, ADMIN_MENU() grants access to candidate nomination, electoral result queries, voter roll audits, and relational candidate listings.',
    keyObservation:
      'Separates election administration from voter interaction using database-backed credential checking.',
  },
  {
    id: 'step-6',
    figureNumber: 'Fig. 6',
    stepTitle: 'Admin Candidate Nomination & 3-Digit ID Assignment',
    track: 'admin',
    functionRef: 'add_candidate() (Lines 331–386)',
    commandOrEntry: 'Admin Menu -> 1 (Add Candidate)',
    terminalLines: [
      'Enter candidate name: Meera Nair',
      'Enter the consistuency: Indore North',
      'Enter Party name: JANTA MORCHA',
      '',
      'WARNING: The details you filled are permanent. You cannot change it later.',
      '',
      'Enter y/Y to continue or Enter anything else to return: y',
      '',
      'Candidate ID - 412',
      'Party name - JANTA MORCHA',
      'Block - Indore North',
      '',
      "Candidate 'Meera Nair' added successfully.",
    ],
    explanation:
      'add_candidate() verifies that the target constituency exists in the block table and guarantees one candidate per political party within each constituency. Upon confirmation, it assigns a unique 3-digit candidate_id (101–999) with votes initialized to 0.',
    keyObservation:
      'If JANTA MORCHA already exists in Indore North, the system prints a conflict notice and aborts insertion.',
  },
  {
    id: 'step-7',
    figureNumber: 'Fig. 7',
    stepTitle: 'Registered Voters & Candidates Tabular Audit (psql & fancy_grid)',
    track: 'admin',
    functionRef: 'view_registered_voters() & view_candidates() (Lines 276–404)',
    commandOrEntry: 'Admin Menu -> 3 -> 2 (View Registered Voters)',
    terminalLines: [
      '--- Registered Voters ---',
      '',
      '1. Bhopal Central',
      '2. Indore North',
      '3. All Consistuency',
      '',
      'Please choose the consistuency of voters you want to see : 1',
      '+------------+--------------+---------------+---------------+---------------+------------------------+----------+----------------+-------+',
      "|   Voter ID | Name         | Father's Name | Date of Birth | Mobile Number | E-mail address         | password | block          | voted |",
      '+------------+--------------+---------------+---------------+---------------+------------------------+----------+----------------+-------+',
      '| 7482910356 | Aarav Sharma | Rajesh Sharma | 2004-08-14    |    9876543210 | aarav.sharma@gmail.com | ******** | Bhopal Central |     1 |',
      '| 8392014421 | Priya Joshi  | Manoj Joshi   | 2003-02-22    |    9822011223 | priya.joshi@gmail.com  | ******** | Bhopal Central |     0 |',
      '+------------+--------------+---------------+---------------+---------------+------------------------+----------+----------------+-------+',
      '',
      'Your voice matters. Your vote counts.',
    ],
    explanation:
      'Using the Python tabulate library, administrators can inspect voters filtered by constituency or across all blocks in PostgreSQL-style ASCII grid format (tablefmt="psql"), alongside INNER JOIN candidate rosters in fancy_grid format.',
    keyObservation:
      'The voted column clearly distinguishes voters who have completed balloting (1) from pending voters (0).',
  },
  {
    id: 'step-8',
    figureNumber: 'Fig. 8',
    stepTitle: 'Tie-Aware Final Election Results Summary',
    track: 'admin',
    functionRef: 'view_results() Option 4 (Lines 183–274)',
    commandOrEntry: 'Admin Menu -> 2 (View Results) -> 4 (Final Results)',
    terminalLines: [
      '---------------------------------',
      'Choose 1 to view the votes given to a individual candidate of particular block.',
      'Choose 2 to view the votes given to all candidates of a particular block.',
      'Choose 4 to view the final results.',
      'Choose 5 to exit.',
      '---------------------------------',
      'Enter your choice: 4',
      '',
      'In Bhopal Central block:',
      'Ananya Verma won with 142 votes (LOK DAL)',
      '',
      'In Indore North block:',
      'Meera Nair won with 118 votes (JANTA MORCHA)',
      '',
      '====== FINAL RESULTS ======',
      '+----------------+------------------+---------+--------------+----------------+',
      '|   Candidate ID | Candidate Name   |   Votes | Party        | Block          |',
      '+================+==================+=========+==============+================+',
      '|            214 | Ananya Verma     |     142 | LOK DAL      | Bhopal Central |',
      '+----------------+------------------+---------+--------------+----------------+',
      '|            412 | Meera Nair       |     118 | JANTA MORCHA | Indore North   |',
      '+----------------+------------------+---------+--------------+----------------+',
    ],
    explanation:
      'Option 4 iterates over every constituency in b, sorts candidates by votes DESC, captures the highest vote count max_votes, prints every leading/tied winner per block, and renders the consolidated winners table with tabulate(..., tablefmt="fancy_grid").',
    keyObservation:
      'Notice the menu intentionally offers choices 1, 2, 4, and 5; if two candidates tie for max_votes in the same constituency, both are included in the final_result grid.',
  },
];

export const FUTURE_ASPECTS: FutureAspect[] = [
  {
    id: 'security-hashing',
    index: '01',
    title: 'Cryptographic Password Hashing & Full SQL Parameterization',
    category: 'security',
    currentObservation:
      'In online_voting_system_e2f14e45.py, voter and admin passwords are stored and queried as plaintext strings (including a uniqueness check on password in REGISTER_VOTER()), and several queries use f-strings or .format() interpolation.',
    proposedUpgrade:
      'Replace plaintext password storage with salted bcrypt or Argon2id digests, remove the password uniqueness constraint, and convert 100% of SQL statements to parameterized placeholders (%s) with least-privilege MySQL user roles.',
    expectedImpact:
      'Eliminates credential exposure in administrative voter tables (view_registered_voters) and prevents SQL injection vulnerabilities across all input prompts.',
    implementationStack: 'bcrypt / passlib · MySQL prepared statements · python-dotenv',
  },
  {
    id: 'constituency-integrity',
    index: '02',
    title: 'Strict Constituency-Bound Ballot Validation & Receipt Hashing',
    category: 'security',
    currentObservation:
      'While show_candidates() filters displayed candidates by the voter’s constituency (profile_details[7]), the subsequent check in VOTER_MENU() queries candidate_id without re-verifying that the chosen candidate belongs to the voter’s block.',
    proposedUpgrade:
      'Enforce WHERE candidate_id=%s AND block=%s during vote submission inside a MySQL transaction with row-level locking, and issue a SHA-256 anonymized verification receipt to the voter without revealing ballot choice.',
    expectedImpact:
      'Guarantees cross-constituency vote tampering is impossible even at the database query layer and enables verifiable election audits.',
    implementationStack: 'MySQL InnoDB Transactions · hashlib (SHA-256) · Foreign Key Constraints',
  },
  {
    id: 'mfa-otp',
    index: '03',
    title: 'Multi-Factor OTP & Institutional ID Verification',
    category: 'security',
    currentObservation:
      'Voter registration currently validates @gmail.com syntax and 10-digit mobile length locally without confirming whether the registrant actually controls the phone number or email inbox.',
    proposedUpgrade:
      'Integrate time-bound 6-digit OTP verification via SMTP/SMS gateway during REGISTER_VOTER() and LOGIN(), plus optional school roll-number or government Voter ID format validation.',
    expectedImpact:
      'Prevents impersonation and automated fake voter registrations while keeping onboarding accessible.',
    implementationStack: 'smtplib / OAuth2 · Time-based OTP (pyotp) · Email verification tokens',
  },
  {
    id: 'web-architecture',
    index: '04',
    title: 'Migration from Local CLI to Web & Mobile REST Architecture',
    category: 'architecture',
    currentObservation:
      'The current application opens a fresh localhost MySQL connection inside almost every function (REGISTER_VOTER, LOGIN, ADMIN_MENU, etc.) and interacts solely via standard terminal input/output.',
    proposedUpgrade:
      'Refactor core validation and balloting logic into a FastAPI or Flask REST backend backed by a connection pool, paired with a responsive React web interface for remote voting on campus or organizational networks.',
    expectedImpact:
      'Transforms the system from a single-terminal lab utility into a concurrent multi-user web platform with persistent connection pooling.',
    implementationStack: 'FastAPI / Flask · MySQL Connection Pool · React + TypeScript UI',
  },
  {
    id: 'analytics-governance',
    index: '05',
    title: 'Scheduled Polling Windows, Audit Logs & Live Turnout Analytics',
    category: 'analytics',
    currentObservation:
      'Voting remains permanently open whenever the script runs, and results can be inspected mid-election via view_results() without an official polling schedule or turnout percentage breakdown.',
    proposedUpgrade:
      'Add start/end election timestamps in MySQL, lock result publication until polling closes, record timestamped administrative actions in an audit_log table, and compute constituency-wise voter turnout percentages and CSV/PDF result exports.',
    expectedImpact:
      'Prevents premature result bias during active polling and provides school or institutional election committees with formal, auditable reports.',
    implementationStack: 'Scheduled Election State Machine · Immutable Audit Table · Pandas / ReportLab PDF Export',
  },
];

export const CODE_AUDIT_MATRIX = [
  {
    dimension: 'Database Connection Handling',
    currentState: 'New conn.connect() per function targeting localhost root/admin',
    recommendedEvolution: 'Centralized connection pool with environment-variable credentials (.env)',
  },
  {
    dimension: 'Credential Storage',
    currentState: 'Plaintext passwords displayed in view_registered_voters() psql table',
    recommendedEvolution: 'Salted bcrypt hashes; password column excluded from admin roll queries',
  },
  {
    dimension: 'Query Parameterization',
    currentState: 'Mixed: %s placeholders in view_results/ADMIN_MENU, .format()/f-strings elsewhere',
    recommendedEvolution: 'Uniform %s parameterized SQL statements across all 4 tables',
  },
  {
    dimension: 'Age Verification',
    currentState: 'Year-only delta in REGISTER_VOTER(); exact calendar date check in VOTER_MENU()',
    recommendedEvolution: 'Shared exact calendar-day 18+ validator applied identically at registration & voting',
  },
  {
    dimension: 'Ballot Scope Enforcement',
    currentState: 'Candidates filtered in show_candidates() display only',
    recommendedEvolution: 'Server-side SQL constraint checking candidate.block == voter.block on UPDATE',
  },
];
