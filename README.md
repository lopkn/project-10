# project-10

**Central repo for random stuff I make**
*One Node server, a couple dozen browser games and toys.*

Live at **[game.lopkn.dev](https://game.lopkn.dev/)** (almost always online) · Discord: **[discord.gg/RtP4GnM8](https://discord.gg/RtP4GnM8)**

This is a personal sandbox repo. Everything in `public/` is served by a single `server.js`;
each path below is its own self-contained experiment — multiplayer games, physics sims,
weird little tools. A few non-web C++ utilities also live here (see [Other tools](#other-tools)).

---

## Contents

- [Play now](#play-now)
  - [3D flight & movement](#3d-flight--movement)
  - [Multiplayer & combat](#multiplayer--combat)
  - [Toys & tools](#toys--tools)
  - [Experiments](#experiments)
- [Run it yourself](#run-it-yourself)
- [Repo layout](#repo-layout)
- [Other tools](#other-tools)
- [License](#license)

---

## Play now

All URLs are relative to `https://game.lopkn.dev`.

### 3D flight & movement

| Path | What it is |
|------|------------|
| [`/quick/fighter`](https://game.lopkn.dev/quick/fighter) | 3D flight simulator with surprisingly good dynamic AI |
| [`/quick/three`](https://game.lopkn.dev/quick/three) | older 3D flight simulator |
| [`/quick/FPV`](https://game.lopkn.dev/quick/FPV) | 3D FPV drone flight simulator |
| [`/quick/lapple`](https://game.lopkn.dev/quick/lapple) | 3D grapple simulator — free camera spin, physics with no speed cap |

### Multiplayer & combat

| Path | What it is |
|------|------------|
| [`/re8`](https://game.lopkn.dev/re8) | Real-time strategy game with ridiculous unit movement and economy |
| [`/shooter2`](https://game.lopkn.dev/shooter2) | 2D shooter with bullet ricochet off walls at any angle |
| [`/quick/ball`](https://game.lopkn.dev/quick/ball) | 2D multiplayer bonk, but with HP instead of ring-outs |

### Toys & tools

| Path | What it is |
|------|------------|
| [`/timer`](https://game.lopkn.dev/timer) | Test how wrong your internal clock is (10s) |
| [`/quick/impact`](https://game.lopkn.dev/quick/impact) | "Bonk" toy with destruction physics (mobile) |
| [`/quick/rec`](https://game.lopkn.dev/quick/rec) | Ad-free browser voice-to-text recorder |
| [`/quick/trueMirror`](https://game.lopkn.dev/quick/trueMirror) | Dead-simple, ad-free true mirror |
| [`/quick/musicbox`](https://game.lopkn.dev/quick/musicbox) | Music box with particle effects |
| [`/quick/particles`](https://game.lopkn.dev/quick/particles) | 2D particle-system universe (installable PWA) |
| [`/quick/zchess`](https://game.lopkn.dev/quick/zchess) | 2D real-time single-player chess (installable PWA) |
| [`/quick/epcut`](https://game.lopkn.dev/quick/epcut) | Fruit Ninja on steroids |
| [`/quick/epcounter`](https://game.lopkn.dev/quick/epcounter) | Stare at random on-screen objects to pass the time |

### Experiments

| Path | What it is |
|------|------------|
| [`/quick/quantum`](https://game.lopkn.dev/quick/quantum) | Multiplayer Bell-inequality-violation demonstrator |
| [`/quick/bsmeter`](https://game.lopkn.dev/quick/bsmeter) | "Bullsh\*t meter" that somehow uses your mic |
| [`/quick/flashing`](https://game.lopkn.dev/quick/flashing) | Rapid full-screen strobe. Exploit your friends epilepsy to a whole new level! |
| [`/quick/argAccel`](https://game.lopkn.dev/quick/argAccel) | Argument-based online text channel *(deprecated)* |

---

## Run it yourself

**Prerequisites:** Node.js 20+ (`node --version`).

```bash
git clone git@github.com:lopkn/project-10.git
cd project-10
npm install
```

**Start the server:**

```bash
node -e "$(cat server.js)" -i
```

This is the only way it starts. `node server.js` (and therefore `npm start`) does
**not** work — the server must be loaded via `node -e` with an interactive REPL
attached (`-i`). `dev.sh` is exactly this one-liner:

```bash
./dev.sh
```

**With auto-restart:** `run.sh` relaunches the server if it crashes, logging each
crash to `dynamics/errorlog3.txt`.

```bash
./run.sh
```

Once running, open `http://localhost:<port>` and append any path from
[Play now](#play-now) (e.g. `/quick/fighter`).

---

## Repo layout

```
server.js            Central HTTP + socket server for everything in public/
public/              All served front-ends
  quick/<name>/        Most games and toys live here → /quick/<name>
  re8/  shooter2/       Larger games with their own top-level route
  timer/               → /timer
small_servers/       Standalone side servers, run independently of server.js
CProject/            C / C++ utilities (see Other tools)
scripts/  python/    Assorted helper scripts
dynamics/            Runtime logs and crash dumps (gitignored where possible)
node_modules/        Dependencies (gitignored)
```

---

## Other stuff

Not served by `server.js`, but kept in this repo:

- **`CProject/keyReader/`** — X11 C++ utility. Global keystroke logging (captures
  input even when its window isn't focused), transparent overlays, and an
  anti-recoil helper built for Apex Legends, plus assorted other functions.
- **`skript/`** — C++ script that rewrites your text mid-argument: every time you
  type "stupid" it swaps in a stronger phrase that means roughly the same thing.

---


