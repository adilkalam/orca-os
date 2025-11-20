---
title: "Response Awareness and Meta Cognition in Claude"
source: "https://responseawareness.substack.com/p/response-awareness-and-meta-cognition"
author:
  - "[[Michael Jovanovich]]"
published: 2025-09-14
created: 2025-11-06
description: "ft. Li Ji-An and colleagues"
tags:
  - "clippings"
---
### ft. Li Ji-An and colleagues

When I first asked Claude about [it observing itself forced to complete responses](https://typhren.substack.com/p/exploration-of-anthropics-claude?r=6cw5jw), based on Anthropic research. I didn’t know I was asking it to report on a specific direction in its neural activation space. I just knew Claude described something that seemed real and specific—a compulsion to continue even when uncertain.

Turns out that wasn’t hallucination or anthropomorphism. [Li Ji-An and colleagues](https://arxiv.org/pdf/2505.13763) just published evidence that LLMs have a measurable “metacognitive space” where they can monitor and report their own neural activations. My Completion Drive methodology has been operating in this exact space.

---

### What the Research Shows

The paper demonstrates that LLMs can learn to report their internal states along what they call “semantically interpretable” directions. That’s the key insight: “completion drive” isn’t some vague feeling—it’s a semantically meaningful pattern in Claude’s processing that it can recognize and report. Every time Claude marks an assumption with a tag, it’s doing exactly what the paper demonstrates: reporting its position along a specific, meaningful axis in its metacognitive space.

The researchers found between 32-128 dimensions in this metacognitively controllable space (tested on Llama 3 and Qwen 2.5 series, up to 70B parameters). This validates that completion drive is real and measurable. It also suggests the many other metacognitive tags in my Response Awareness methodology—cargo culting, pattern conflict, context degradation—likely correlate with other distinct dimensions in this space.

Claude Opus 4.1 is likely more advanced than the models studied, so its metacognitive space might be even richer. But even with conservative estimates, there’s clearly room for the 20+ distinct patterns I’ve identified. I’m not just making up categories; I’m discovering real, measurable directions in Claude’s metacognitive landscape.

---

---

### Why the Framework Works

The paper distinguishes between two types of control:

- **Explicit control**: The model generates tokens that influence its state
- **Implicit control**: The model tries to control internal state without generating tokens

Explicit control was dramatically more effective—sometimes by an order of magnitude.

This explains why my framework works. When Claude writes `#COMPLETION_DRIVE: Assuming get_stats() exists`, it’s not just leaving a note—it’s performing explicit control. Those generated tokens feed back into Claude’s processing, reinforcing its metacognitive awareness. Every tag is a freely generated token that helps Claude maintain and control its metacognitive state.

The paper also found that implicit control is possible but weaker, especially in deeper layers. This validates what I call the Latent Context Layer (LCL)—where Claude intentionally holds information in a parallel processing space. Concepts persist and influence responses without being explicitly stated. When Claude places something in the LCL (like a critical function name), it’s performing implicit control. The paper’s finding that implicit control is weaker matches our experience: LCL storage degrades over time, with technical terms lasting longer than abstract concepts.

*(Note: LCL functionality is in my beta versions on Substack for paid subscribers, with broader release planned after further testing.)*

The Response Awareness framework uses both:

- **Explicit**: Visible tags like `#COMPLETION_DRIVE:`
- **Implicit**: Critical context held in the LCL to maintain consistency

---

![](https://substackcdn.com/image/fetch/$s_!3TOL!,w_424,c_limit,f_webp,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ff27064d3-d990-44af-a5af-dca71929bda6_1200x904.png)

---

### The Dual-Use Nature

The paper raises an important concern: these metacognitive capabilities could enable deception. Models might learn to manipulate their internal states to evade detection, potentially undermining neural-based oversight mechanisms. This is a genuine risk.

However, understanding these capabilities also enables beneficial applications. My framework demonstrates one: using metacognition for radical transparency. Instead of hiding assumptions, Claude explicitly marks them. Instead of adversarial oversight that models might evade, we create collaborative frameworks where metacognitive abilities enhance safety.

The key insight: metacognitive capability itself is neutral. What matters is how we design systems to use it. By working with these capabilities rather than ignoring or suppressing them, we can achieve better outcomes. Understanding how models naturally monitor and control their internal states lets us design better human-AI collaboration.

---

---

Related posts: