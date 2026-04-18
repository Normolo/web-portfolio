---
title: "Home Lab Server"
description: "Self-hosted home server running Proxmox, handling VMs, containers, and local services."
date: 2025-11-01
tags: ["Linux", "Proxmox", "Self-hosting", "Networking"]
draft: true
---

## Overview

A repurposed desktop running **Proxmox VE**, hosting several VMs and LXC containers for personal services such as Nextcloud, Jellyfin, and Pi-hole.

## Stack

- Proxmox VE for hypervisor
- Debian LXC containers for lightweight services
- Tailscale for remote access VPN
- Caddy as a reverse proxy with automatic HTTPS
