<!-- telos-metadata
id: L4:purpose
level: 4
title: Redshift
children: []
-->

# L4: Purpose

## Why This Project Exists

Enable developers to manage application secrets with true ownership and censorship resistance, using client-side encryption on Nostr.

## Beneficiaries

- Developers who want secret management without vendor lock-in
- Teams requiring censorship-resistant infrastructure
- Privacy-conscious organizations avoiding centralized secret stores

## Success Metrics

| Metric | Target | Current |
|--------|--------|---------|
| Client-side encryption | 100% of secrets encrypted before leaving device | - |
| Centralized dependencies | Zero reliance on proprietary servers | - |
| CLI compatibility | Full Doppler command parity | - |
| Relay resilience | Secrets retrievable from any network relay | - |

## Strategic Constraints

- All encryption must be client-side (NIP-59 Gift Wrap)
- Must use Nostr protocol for storage and distribution
- CLI must maintain Doppler-compatible interface
- No proprietary server dependencies

## Target Users

- Individual developers managing personal project secrets
- Development teams needing shared secret access
- Organizations requiring audit-compliant, self-sovereign secret management

## Technology Stack

- **Runtime**: Bun
- **Web Framework**: SvelteKit
- **Encryption**: NIP-59 Gift Wrap (Nostr)
- **Distribution**: Nostr relays

## Children

<!-- Add L3:experience specs as children -->

## Initialization

- **Date**: 2026-01-01
- **Method**: /telos:init
