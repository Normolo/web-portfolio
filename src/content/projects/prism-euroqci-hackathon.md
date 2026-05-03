---
title: "Hands on with quantum key distribution at the PRISM EuroQCI Hackathon"
description: "What does it feel like to build code that talks directly to quantum hardware? I found out at the University of Malta."
date: 2025-07-30
tags: ["QKD", "PRISM EuroQCI", "ETSI GS QKD 014", "Cryptography", "University of Malta"]
skills: ["cryptography"]
draft: false
---

<style>
  @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');
  .wrap { font-family: 'DM Sans', var(--font-sans), sans-serif; max-width: 680px; padding: 2.5rem 0 3rem; color: var(--color-text-primary); }
  .kicker { font-size: 11px; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; color: var(--color-text-secondary); margin-bottom: 0.75rem; }
  h1.headline { font-family: 'Libre Baskerville', var(--font-serif), serif; font-size: 28px; font-weight: 700; line-height: 1.3; margin: 0 0 1rem; }
  .standfirst { font-family: 'Libre Baskerville', var(--font-serif), serif; font-size: 16px; font-style: italic; font-weight: 400; color: var(--color-text-secondary); border-left: 2px solid var(--color-border-primary); padding-left: 1rem; margin: 0 0 2rem; line-height: 1.65; }
  .meta { display: flex; gap: 1.5rem; font-size: 12px; color: var(--color-text-tertiary); padding-bottom: 1rem; border-bottom: 0.5px solid var(--color-border-tertiary); margin-bottom: 2rem; }
  .body-text p { font-size: 15px; line-height: 1.85; margin: 0 0 1.25rem; }
  h2.sec { font-family: 'Libre Baskerville', var(--font-serif), serif; font-size: 18px; font-weight: 700; margin: 2.25rem 0 0.75rem; }
  .challenge-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 1.5rem 0; }
  .challenge-card { background: var(--color-background-secondary); border: 0.5px solid var(--color-border-tertiary); border-radius: var(--border-radius-lg); padding: 1rem 1.25rem; }
  .challenge-card .num { font-size: 11px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: var(--color-text-tertiary); margin-bottom: 0.4rem; }
  .challenge-card .title { font-size: 14px; font-weight: 500; color: var(--color-text-primary); margin-bottom: 0.5rem; }
  .challenge-card p { font-size: 13px; color: var(--color-text-secondary); line-height: 1.7; margin: 0; }
  .callout { background: var(--color-background-secondary); border-radius: var(--border-radius-lg); border: 0.5px solid var(--color-border-tertiary); border-left: 2px solid var(--color-border-secondary); padding: 1rem 1.25rem; margin: 1.75rem 0; }
  .callout .callout-label { font-size: 11px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: var(--color-text-tertiary); margin-bottom: 0.4rem; }
  .callout p { font-size: 14px; color: var(--color-text-secondary); margin: 0; line-height: 1.7; }
  .callout strong { font-weight: 500; color: var(--color-text-primary); }
  .tag-row { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 2rem; padding-top: 1.25rem; border-top: 0.5px solid var(--color-border-tertiary); }
  .tag { font-size: 11px; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase; padding: 4px 10px; border-radius: var(--border-radius-md); background: var(--color-background-secondary); color: var(--color-text-secondary); border: 0.5px solid var(--color-border-tertiary); }
  @media (max-width: 480px) { .challenge-grid { grid-template-columns: 1fr; } }
</style>

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
