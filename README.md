# StudyFlow 🎓
> *"Turn study chaos into a clear plan."*

StudyFlow is a modern, student-first productivity and syllabus mastery web application designed to help university and college students organize coursework, manage exam countdowns, build consistent study streaks, and parse chaotic study thoughts into structured tasks—all completely offline and client-side.

---

## 🌟 Key Highlights

- **🧠 Local "Study Dump" NLP Engine**: Type natural unstructured study thoughts like *"Complete DAA backtracking tomorrow"* or *"I need to complete DBMS normalization tomorrow"*. The built-in deterministic local parser automatically extracts the task, subject, priority, deadline, and syllabus tags—with **zero external AI API dependencies**.
- **📚 Coursework & Syllabus Tracker**: Deep curriculum breakdown for college subjects (preloaded with **DBMS**, **Java**, **DAA**, and **Data Structures**). Track topics covered, calculate dynamic syllabus completion percentages, and manage course credits.
- **🎯 Task Manager**: Filter tasks by *Pending*, *Completed*, *High Priority*, and *Due Today*. Toggle tasks with sound synthesis chimes and celebratory confetti.
- **⏳ Exam Countdown Radar**: Real-time countdowns (`DBMS — 12 days left`) with color-coded urgency alerts (Critical, Approaching, Scheduled).
- **⏱️ Study Planner & Focus Sprint**: Plan study sessions by subject, topic, and duration. Includes an integrated 25-minute Deep Study Sprint / 5-minute break Pomodoro focus timer with audio cues.
- **📊 Analytics & Visual Insights**: Interactive SVG weekly productivity charts, subject mastery comparison bars, and a 28-day study consistency streak heatmap.
- **🔍 Instant Unified Search (Ctrl+K)**: Instant keyboard-driven search across tasks, subjects, exams, and dumped notes.
- **🎨 Material 3 Polish**: Supports dark/light mode, mobile bottom navigation, speed-dial Floating Action Button (FAB), smooth animations via Motion, and responsive layouts.
- **💾 Local Persistence & Data Portability**: 100% private, client-side LocalStorage storage with full JSON export and import capabilities.

---

## 🚀 Live Demo & Screenshots

```
+-----------------------------------------------------------------------------------+
|  🎓 StudyFlow [PRO]   Dashboard  Tasks  Subjects  Planner  Insights  [✨ Study Dump] 🔥5d  |
+-----------------------------------------------------------------------------------+
|  Good morning, Alex Rivera                                                         |
|  "Turn study chaos into a clear plan."                                            |
|                                                                                   |
|  [ 🚨 Upcoming Exam: DBMS End-Semester Theory — 12 days left ]                   |
|                                                                                   |
|  +--------------------+  +--------------------+  +--------------------+           |
|  | Today's Progress   |  | Study Momentum     |  | Coursework         |           |
|  |  2 / 2 tasks (100%)|  |  5 Days Streak 🔥  |  |  4 Subjects        |           |
|  +--------------------+  +--------------------+  +--------------------+           |
|                                                                                   |
|  [ ✨ Study Dump: "Got messy thoughts? Type naturally and auto-extract tasks" ]   |
|                                                                                   |
|  Today's Tasks:                                                                   |
|  [x] Complete DBMS Normalization 3NF & BCNF practice questions                    |
|  [x] DAA Backtracking problem set: N-Queens & Hamiltonian Cycle                   |
+-----------------------------------------------------------------------------------+
```

---

## 🛠️ Tech Stack

- **Framework**: React 19 (TypeScript)
- **Styling**: Tailwind CSS v4
- **Motion & Animations**: `motion` (Framer Motion v12)
- **Icons**: Lucide React
- **Celebrations**: `canvas-confetti` + Web Audio API synthesizer chimes
- **Storage**: Client-Side LocalStorage with JSON backup/restore
- **Build Tool**: Vite 8

---

## 📂 Project Architecture

```
/
├── index.html                  # HTML entry point with meta tags & dark mode bootstrapper
├── package.json                # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Vite + Tailwind plugins
├── src/
│   ├── main.tsx                # React root mount
│   ├── App.tsx                 # Root component with providers & view routing
│   ├── index.css               # Global styling, Tailwind v4 imports, fonts
│   │
│   ├── models/
│   │   └── types.ts            # Subject, Topic, Task, Exam, StudySession, StudyDump types
│   │
│   ├── services/
│   │   ├── nlpParserService.ts # Local deterministic keyword/pattern extractor
│   │   └── storageService.ts   # LocalStorage manager, seed data & backup exporter
│   │
│   ├── context/
│   │   └── AppContext.tsx      # Central application state & action handlers
│   │
│   ├── utils/
│   │   └── audioAndConfetti.ts # Web Audio API chimes & celebratory particle bursts
│   │
│   └── components/
│       ├── layout/
│       │   ├── Navbar.tsx      # Desktop header with search, theme toggle, streak
│       │   └── BottomNav.tsx   # Mobile-friendly thumb navigation bar
│       │
│       ├── common/
│       │   ├── Badge.tsx               # Status & priority pills
│       │   ├── ProgressBar.tsx         # Animated progress bar
│       │   ├── CircularProgress.tsx    # SVG circular progress ring
│       │   ├── Modal.tsx               # Motion modal container
│       │   ├── ConfirmationDialog.tsx  # Accessible destructive action confirmation
│       │   ├── Snackbar.tsx            # Floating toast alert banners
│       │   ├── EmptyState.tsx          # Clean empty state placeholders
│       │   └── FloatingActionButton.tsx # Speed-dial FAB
│       │
│       ├── dashboard/
│       │   └── DashboardView.tsx       # Main hub: greeting, date, progress, streak
│       │
│       ├── tasks/
│       │   ├── TasksView.tsx   # Filter tabs (Pending, Done, Today, High), search & sort
│       │   ├── TaskCard.tsx    # Interactive task item with checkbox & metadata
│       │   └── TaskModal.tsx   # Add/Edit task dialog
│       │
│       ├── subjects/
│       │   ├── SubjectsView.tsx       # Subject grid & syllabus KPI stats
│       │   ├── SubjectCard.tsx        # Individual course card with progress bar
│       │   ├── SubjectModal.tsx       # Add/Edit subject with color picker
│       │   └── SubjectDetailModal.tsx # Full syllabus topic checklist manager
│       │
│       ├── dump/
│       │   ├── StudyDumpModal.tsx     # Large input for local NLP pattern matching
│       │   └── StudyDumpVault.tsx     # Dump vault history & conversion to tasks
│       │
│       ├── exams/
│       │   ├── ExamCard.tsx           # Countdown card with urgency status
│       │   └── ExamModal.tsx          # Exam scheduler dialog
│       │
│       ├── planner/
│       │   ├── PlannerView.tsx        # Daily schedule timeline & exams
│       │   ├── PomodoroTimer.tsx      # 25m Focus / 5m Break study timer
│       │   └── SessionModal.tsx       # Study block scheduling modal
│       │
│       ├── insights/
│       │   └── InsightsView.tsx       # Weekly charts, subject bars, streak heatmap
│       │
│       ├── search/
│       │   └── GlobalSearchModal.tsx  # Unified search dialog (Ctrl+K)
│       │
│       └── settings/
│           └── SettingsModal.tsx      # Dark mode, name profile, export/import, wipe
```

---

## ⚡ Getting Started

### Prerequisites
- Node.js (version 18+ recommended)
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/studyflow.git
   cd studyflow
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

### Building for Production
```bash
npm run build
```

---

## 🔍 How the Local Study Dump Engine Works

When a student types a thought into Study Dump:
```
"Complete DAA backtracking tomorrow"
```
The internal pattern engine executes in browser memory in under **1 millisecond**:
1. **Subject Detection**: Matches against registered student subjects and a dictionary of common subjects (`DAA` -> Design & Analysis of Algorithms).
2. **Priority Detection**: Analyzes linguistic cues (`urgent`, `critical`, `important`, `chill`, `exam tomorrow`).
3. **Deadline Parsing**: Parses expressions (`today`, `tomorrow`, `in 2 days`, `next monday`, `on friday`) into clean ISO dates.
4. **Action Extraction**: Filters filler phrases (`I need to`, `Remember to`) and isolates the clean study task name (`Complete DAA backtracking`).
5. **Keyword Tagging**: Identifies syllabus terms (`#backtracking`).

Students can review the detected result, adjust fields inline, and choose between:
- **[Create Task]**: Automatically adds to the active task list.
- **[Save Note]**: Stores in the Study Dump vault for future scheduling.

---

## 🔮 Future Enhancements
- [ ] Export schedule to iCal / Google Calendar `.ics` files
- [ ] Flashcard generator directly from subject topics
- [ ] Spaced repetition (SM-2 algorithm) intervals for topics
- [ ] Audio background ambient sounds (White Noise, Rain, Cafe) for the Pomodoro timer

---

## 📄 License
Licensed under the Apache-2.0 License.
