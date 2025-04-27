---
sidebar_label: SSH to WSL
tags: [How-to Guide, WSL, Windows]
last_update:
  date: 2025-04-22
---

# Enabling SSH Access to Windows Subsytem for Linux (WSL)

WSL provides a way to run a Linux environment within Windows, which can be useful for software development, especially when installing a full Linux system isn’t an option. Still, if Windows isn't exactly your favourite place to code and this kind of setup is inevitable, another workaround is to setup the WSL as a remote server and connect from your preferred development machine.

> This assume WSL already installed, and preferrably with Ubuntu.

### Enable SSH Server in WSL

First, install and configure the SSH Server:

```bash
sudo apt update && sudo apt install openssh-server -y
```

Edit the ssh server config:

```bash title="/etc/ssh/sshd_config.d/wsl.conf"
Port 2222
PasswordAuthentication yes
PubkeyAuthentication yes
```

This enable ssh in the port 2222, supporting password and key authentication methods.

Then start the ssh service and enable it on startup:

```bash
sudo systemctl enable ssh
```

### Forward Windows Port to WSL

In PowerShell terminal as Administrator, run:

```powershell
netsh interface portproxy add v4tov4 listenport=2222 listenaddress=0.0.0.0 connectport=2222 connectaddress=$(wsl hostname -I).split()[0].trim()
```

With `wsl hostname -I` it possible to make the ip discovery dynamic.

### Allow port in the Windows Firewall Host

Still in PowerShell, add a firewall rule:

```powershell
New-NetFirewallRule -DisplayName "WSL SSH Proxy" -Direction Inbound -LocalPort 2222 -Protocol TCP -Action Allow
```

### Connect Remotely via SSH

After setup, the WSL instance should be accessible via SSH from another machine:

```bash
ssh -p 2222 <wslusername>@<windowsip>
```

### Optional: Create Startup Script

To make WSL and port fowarding persist across reboots, create a simple script:

```powershell title="C:\scripts\wsl-portproxy.ps1"
# clean up existing rule
netsh interface portproxy delete v4tov4 listenport=2222 listenaddress=0.0.0.0

# get WSL IP + boot WSL at the same time
$wslIp = (wsl hostname -I).split()[0].trim()

# port forward from Windows:2222 -> WSL:2222
netsh interface portproxy add v4tov4 listenport=2222 listenaddress=0.0.0.0 connectport=2222 connectaddress=$wslIp
```

Then set it to run at startup in the task scheduler:

- Open **Task Scheduler**
- Click **Create Task**
- General Tab: Set name, e.g `WSL Port Forwarding` and check **Run with highest privileges**
- Triggers Tab: New -> Begin the task **At startup**
- Action Tab: New -> Start a program
  - Program/script: `powershell`
  - Add arguments: `-ExecutionPolicy Bypass -File "C:\scripts\wsl-portproxy.ps1"`

### Optional: Login with SSH Key

To enable key-based login, copy your SSH public key into the WSL instance:

```bash
ssh-copy-id -i /path/to/privatekey -p 2222 <wslusername>@<windowsip>
```

### Important : Disable WSL Auto-Shutdown

By default, WSL is configured to automatically shut down after a period of inactivity, which is controlled by the [`vmIdleTimeout`][wsl-config] setting. This can cause issues for continuous access to the WSL instance or to enable setup to persist across reboots.

> Setting `vmIdleTimeout` to `-1` doesn't helps.

A simple workaround for this is to install **Docker Desktop**. When you set up Docker Desktop with WSL2 as the backend, it ensures that WSL runs in the background even after you close the terminal.

After that, enable Docker Desktop to run on startup, and the setup should be good to go.

[wsl-config]: https://learn.microsoft.com/en-us/windows/wsl/wsl-config
