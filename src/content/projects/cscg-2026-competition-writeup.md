---
title: "CSCG 2026 — Competition Writeup"
description: "Solo CTF participation in CSCG 2026, ranking 7th in Malta among ~1,000 participants worldwide."
date: 2026-04-18
tags: ["CTF", "Cryptography", "Web Exploitation", "Forensics", "Reverse Engineering"]
liveUrl: "https://play.cscg.live/"
draft: false
---

7th place (Malta) · Solo · ~1,000 participants worldwide

## Overview

CSCG (Cyber Security Challenge Germany) 2026 is a large-scale international CTF competition drawing around 1,000 participants from across Europe and beyond. Competing solo, I placed 7th among all Maltese participants — working through challenges spanning cryptography, web exploitation, forensics, and reverse engineering.

The competition was a strong test of both breadth and depth: easy challenges reward familiarity with standard techniques, while harder ones demand original thinking and the ability to build custom tooling from scratch. Below are some of the more technically involved challenges I solved.

## Cryptography

### SHA-1 Length Extension Attack

One challenge used a SHA-1 secret-prefix MAC for authentication. The vulnerability: SHA-1's Merkle–Damgård construction means that if you know the hash of a message, you can extend it without knowing the secret. I implemented the full attack from scratch in pure Python — no external libraries — manually reconstructing the internal hash state and forging a valid authenticated message.

### AES-CTR Nonce Reuse

A classic but dangerous mistake: the same nonce used twice under AES-CTR effectively turns the keystream into a one-time pad that can be recovered via XOR with known plaintext. I exploited this to recover the keystream and decrypt the target ciphertext.

### LCG Cipher Break

This challenge used a Linear Congruential Generator as a cipher. By leveraging known plaintext and modular arithmetic, I recovered the generator's parameters and decrypted the flag — which was then triple-encoded through Base64, NATO phonetic alphabet, and ROT13.

### ZIPPER — GF(4919) Matrix Hash Forgery

The most algebraically involved challenge I solved. The server used a custom hash built on matrix multiplication over GF(4919), a finite field. The attack had two phases: first, I recovered the secret matrix by analysing information leaked through server error messages. Second, I used that matrix to forge valid gzip files that would pass the server's verification on each round. Implemented in both pure Python and SageMath.

## Web Exploitation

### Unicode Path Traversal — knowledge-base

A FastAPI application backed by ChromaDB applied path sanitisation that could be bypassed using Unicode NFKC normalisation. By substituting U+2025 (which normalises to `..`) and U+FF0F (which normalises to `/`), I was able to traverse outside the intended directory and achieve arbitrary file read on the server.

## Forensics

### Port Knocking via YouTube Metadata

A packet capture contained a port knocking sequence where the destination port bytes were derived from YouTube video IDs embedded in the traffic. Identifying the encoding scheme and reconstructing the knock sequence from the capture revealed the flag.

## Reflections

Competing solo in a field of ~1,000 meant every flag required independent problem-solving with no safety net. The challenges I found most rewarding were those that required building attacks from first principles — particularly the SHA-1 length extension and the GF(4919) forgery — where no off-the-shelf tool would do the job. CSCG 2026 reinforced my interest in pursuing a career in cryptographic and systems security.
