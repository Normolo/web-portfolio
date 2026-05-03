---
title: "Hands on with quantum key distribution at the PRISM EuroQCI Hackathon"
description: "What does it feel like to build code that talks directly to quantum hardware? I found out at the University of Malta."
date: 2025-07-30
tags: ["QKD", "PRISM EuroQCI", "ETSI GS QKD 014", "Cryptography", "University of Malta"]
skills: ["cryptography"]
image: "https://github.com/user-attachments/assets/20625fae-ff6c-47d0-88d5-f92771ff622c"
draft: false
---

It's not every day you get to write code that talks directly to quantum hardware. On 30 July 2025, the [PRISM EuroQCI consortium](https://prism-euroqci.eu/) gave me exactly that opportunity: a full-day, in-person hackathon centred on live Quantum Key Distribution (QKD) devices and the practical realities of quantum-secure communication.

## Two challenges, one testbed

The day was structured around two non-competitive challenges, setting a collaborative tone from the outset. Nobody was racing; everyone was figuring things out together.

**Challenge 01: Encryption application development**

Building applications to retrieve QKD keys via ETSI GS QKD 014-compliant protocols, validated against Merqury Cybersecurity's reference implementation and tested on real devices on-site.

**Challenge 02: Quantum link monitoring and switching**

Detecting fibre loss events and implementing logic to dynamically reroute traffic to alternate channels, which was the challenge I found most immediately engaging.

Getting the API calls right and handling key material correctly for the first challenge required careful reading of the standard. The second, by contrast, had a more tangible feedback loop: watching a failover trigger correctly on actual hardware is a different kind of satisfaction entirely.

> **Standards note:** ETSI GS QKD 014 defines the interface between QKD devices and the applications that consume the keys they generate. Working directly to the standard, rather than reading about it abstractly, gave a much clearer sense of how these systems slot into broader security architectures.
