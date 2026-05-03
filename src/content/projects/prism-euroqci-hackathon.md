---
title: "Hands on with quantum key distribution at the PRISM EuroQCI Hackathon"
description: "What does it feel like to build code that talks directly to quantum hardware? I found out at the University of Malta."
date: 2025-07-30
tags: ["QKD", "PRISM EuroQCI", "ETSI GS QKD 014", "Cryptography", "University of Malta"]
skills: ["cryptography"]
draft: false
---

<div class="wrap">
  <p class="kicker">Quantum Communications · 30 July 2025</p>
  <h1 class="headline">Hands on with quantum key distribution at the PRISM EuroQCI Hackathon</h1>
  <p class="standfirst">What does it feel like to build code that talks directly to quantum hardware? I found out at the University of Malta.</p>
  <div class="meta">
    <span>Benjamin Borg</span>
    <span>b-borg.net</span>
    <span>~3 min read</span>
  </div>

  <div class="body-text">
    <p>It's not every day you get to write code that talks directly to quantum hardware. On 30 July 2025, the <a href="https://prism-euroqci.eu/">PRISM EuroQCI consortium</a> gave me exactly that opportunity — a full-day, in-person hackathon centred on live Quantum Key Distribution (QKD) devices and the practical realities of quantum-secure communication.</p>

    <h2 class="sec">Two challenges, one testbed</h2>
    <p>The day was structured around two non-competitive challenges, setting a collaborative tone from the outset. Nobody was racing; everyone was figuring things out together.</p>

    <div class="challenge-grid">
      <div class="challenge-card">
        <div class="num">Challenge 01</div>
        <div class="title">Encryption application development</div>
        <p>Building applications to retrieve QKD keys via ETSI GS QKD 014-compliant protocols, validated against Merqury Cybersecurity's reference implementation and tested on real devices on-site.</p>
      </div>
      <div class="challenge-card">
        <div class="num">Challenge 02</div>
        <div class="title">Quantum link monitoring & switching</div>
        <p>Detecting fibre loss events and implementing logic to dynamically reroute traffic to alternate channels — the challenge I found most immediately engaging.</p>
      </div>
    </div>

    <p>Getting the API calls right and handling key material correctly for the first challenge required careful reading of the standard. The second, by contrast, had a more tangible feedback loop — watching a failover trigger correctly on actual hardware is a different kind of satisfaction entirely.</p>

    <div class="callout">
      <div class="callout-label">Standards note</div>
      <p><strong>ETSI GS QKD 014</strong> defines the interface between QKD devices and the applications that consume the keys they generate. Working directly to the standard — rather than reading about it abstractly — gave a much clearer sense of how these systems slot into broader security architectures.</p>
    </div>
  </div>

  <div class="tag-row">
    <span class="tag">QKD</span>
    <span class="tag">PRISM EuroQCI</span>
    <span class="tag">ETSI GS QKD 014</span>
    <span class="tag">Cryptography</span>
    <span class="tag">University of Malta</span>
  </div>
</div>
