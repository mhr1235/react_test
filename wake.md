# Remote Wake‑Up & Display Access via SSH

This guide shows how to keep an M5 device awake, start a Moonlight remote‑desktop session, and cleanly shut everything down—all from an SSH connection.

## 1️⃣  Connect to the M5 device

```bash
ssh <user>@<M5‑IP‑or‑hostname>
```

*(Replace `<user>` and `<M5‑IP‑or‑hostname>` with your actual login name and address.)*

## 2️⃣  Prevent the system from sleeping

While you’re connected, run `caffeinate` to keep the device awake for a set period (e.g., 60 seconds).

```bash
caffeinate -u -t 60
```

- `-u`    : Simulate user activity.
- `-t 60` : Keep the system awake for 60 seconds (adjust as needed).

## 3️⃣  Launch Moonlight for a remote desktop session

After the device is “caffeinated,” start Moonlight to stream the desktop to your client.

```bash
moonlight stream
```

> **Tip:** If you need a specific resolution or framerate, add the appropriate flags (e.g., `--resolution 1280x720 --fps 60`).

## 4️⃣  End the session cleanly

When you’re finished, close Moonlight on the client side, then terminate the `caffeinate` process from the SSH session:

```bash
pkill caffeinate
```

This stops the wake‑lock, allowing the device to resume its normal sleep behavior.

---

### Quick one‑liner (run from any SSH session)

```bash
ssh <user>@<M5‑IP‑or‑hostname> "caffeinate -u -t 60 && moonlight stream" && pkill caffeinate
```

- The command logs in, keeps the device awake for 60 seconds, launches Moonlight, and, once you exit Moonlight, automatically kills the `caffeinate` process.

---

**Summary**

1. **SSH** into the M5 device.
2. Run `caffeinate -u -t <seconds>` to prevent sleep.
3. Launch `moonlight` for the remote desktop.
4. When finished, `pkill caffeinate` from the same SSH session.

Now you have a concise, well‑phrased guide saved as `wake.md` in the repository. Feel free to edit or expand it as your workflow evolves!