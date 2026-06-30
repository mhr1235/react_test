# Memory Management Cheat‑Sheet for GPD Pocket 4 (cachyOS)

Below is a compact “cheat‑sheet” you can paste into a markdown file (or keep in a notes app) for quick reference on the GPD Pocket 4 while you’re running **cachyOS** (Arch‑based).  All the commands are available in the default repositories, so you can install them with `pacman` (or `yay`/`paru` for AUR packages).

---

## 1️⃣  Quick‑look at running Ollama containers / models

```bash
# Show every Ollama process (including the internal server that keeps
# the model in RAM) – great for spotting stray or zombie jobs
ollama ps
```

- **Why it helps** – Ollama keeps a lightweight “server” for each model you load. Each entry shows the model name, PID, RAM usage and how long it has been up.
- **Typical usage** – If you notice RAM climbing after a while, run `ollama ps` first; stop the model you don’t need:

```bash
ollama stop <model‑name>
```

> *Install*: `pacman -S ollama` (or follow the official Ollama install script).

---

## 2️⃣  System‑wide interactive process monitor

| Tool | Install | How to start | What you see |
|------|---------|--------------|--------------|
| **htop** | `pacman -S htop` | `htop` | Color‑coded CPU, RAM, swap bars; can sort, kill, renice, tree view |
| **bottom** (modern “htop” for terminals) | `pacman -S bottom` | `btm` | Same info as `htop` but with richer graphs and a cleaner UI |
| **glances** (multi‑platform) | `pacman -S glances` | `glances` | Full‑screen dashboard, can run in web‑mode (`glances -w`) |
| **bpytop** (Python‑based, very slick) | `yay -S bpytop` | `bpytop` | Animated bars, easy keyboard shortcuts |

> **Tip** – Press **F6** in `htop`/`bottom`/`glances` to change the sort column (e.g., sort by RES‑memory to see the biggest “resident” consumers).

---

## 2️⃣  Classic “who’s hogging RAM?”

```bash
# Simple, always‑present view
free -h                # total/used/free memory (+ swap) in human‑readable units
```

```bash
# Same info, but with a nicer layout
vmstat -s              # one‑line summary of memory pages, swaps, buffers, etc.
```

```bash
# Full‑blown process table (the original Unix `top`)
 top                     # press **M** to sort by memory usage
```

```bash
# If you want a per‑process breakdown of *shared* vs *private* memory
sudo pacman -S smem    # then:
smem -r                # “‑r” = report RSS/USS/PSS for each process
```

---

## 3️⃣  Spot the “memory‑leak” culprits

| Command | What it tells you | Typical usage |
|---------|-------------------|----------------|
| `ps aux --sort=-%mem | head -n 10` | Shows the top 10 processes by **% of RAM** they’re using. | |
| `pmap <PID>` | Displays a process’s memory map (heap, stack, libs, anon, …). Useful for debugging a single PID. |
| `cat /proc/meminfo` | Raw kernel memory statistics – swap‑cached, shmem, slab, etc. |
| `cat /sys/fs/cgroup/memory/memory.usage_in_bytes` | Direct cgroup memory usage (works for any systemd‑managed service). |
| `dmesg | grep -i oom` | Look for recent Out‑Of‑Memory (OOM) kills. |

---

## 4️⃣  Reduce RAM pressure (quick actions)

| Action | Command | What it does |
|--------|---------|--------------|
| **Clear page‑cache, dentries & inodes** (safe, frees up clean cache) | `sudo sync && sudo sysctl -w vm.drop_caches=3` | Drops *all* caches – great after a heavy build or after you’ve just closed a big Ollama model. |
| **Compress swap** (zswap) – already enabled on many CachyOS kernels. Verify / tune: | `cat /sys/module/zswap/parameters/enabled` <br> `sudo sysctl -w vm.zswap.enabled=1` | Gives you a compressed‑in‑RAM swap that can delay hitting the SSD swap partition. |
| **Resize / add swap** (if you’re using a swap file) | ```bash
sudo fallocate -l 2G /swapfile   # 2 GiB swap file
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
``` | Adjust the size to fit your workload (e.g., 2‑4 GiB for heavy LLM inference). |
| **Limit Ollama RAM usage** | ```bash
ollama run <model> --max-ram 2GB   # example flag (depends on Ollama version)
``` | Prevent a single model from swallowing all RAM. |
| **Kill stray processes** | `kill -9 <PID>` or use the **“F9 → SIGKILL”** shortcut in `htop`/`bottom`. | Only as a last resort – always try graceful shutdown first (`kill <PID>`). |

---

## 5️⃣  One‑liner to capture a snapshot (good for bug‑reports)

```bash
{
  echo "=== free -h ==="
  free -h
  echo -e "\n=== ollama ps ==="
  ollama ps
  echo -e "\n=== htop (sorted by RES) ==="
  htop -d 2 -s RES
  echo -e "\n=== top 5 memory hogs ==="
  ps aux --sort=-%mem | head -n 6
} > ~/memory-snapshot-$(date +%F_%H%M).txt
```

- Saves a human‑readable snapshot to your home folder.
- You can later `cat` or attach the file when asking for help.

---

### TL;DR (the three commands you were looking for)

| # | Command | What it does |
|---|---------|--------------|
| 1 | `ollama ps` | Lists every Ollama model / container and its RAM usage. |
| 2 | `htop` (or `bottom`/`btm`) | Interactive process monitor – sort by RES memory to see the biggest consumers. |
| 3 | `free -h` *(or `ps aux --sort=-%mem`)* – the quick overview of total, used, free and cached memory plus swap. |

Keep this sheet handy and you’ll never lose track of memory again on your Pocket 4! 🚀
