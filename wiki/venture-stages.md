# Regenerative Venture Stages

This document defines the internal stage language for Parti Design's regenerative venture studio. These stages are used in the CMS for venture status and should describe how a venture is developing, what kind of support it needs, and what kind of traction it has reached.

Implementation note:

- the venture status field is backed by a Postgres enum
- when changing stage names in code, a database migration is required before Payload admin saves will work again

## The stages

### Seed

The venture is still being shaped.

Focus:

- problem discovery
- team formation
- concept framing
- testing early assumptions

### Root

The core offer is taking form.

Focus:

- prototyping
- pilot design
- partnerships
- early testing

### Sprout

The venture is live in some real-world form.

Focus:

- first users
- first customers
- first site
- first service delivery
- pilot in market

### Grow

The model is working and becoming repeatable.

Focus:

- traction
- operating rhythm
- measurable outcomes
- stronger demand

### Flourish

The venture is stable enough to scale, replicate, or spin out.

Focus:

- expansion
- investment readiness
- long-term sustainability
- wider place-based impact
