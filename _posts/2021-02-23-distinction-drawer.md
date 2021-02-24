---
title: Distinction Drawer 

draft: false

page : false

image: /assets/img/distinction-drawer-flowers.png 

excerpt: What it means to be a distinction-drawer in software engineering?

---

<img
  alt="Abstract illustration of a flower where leaves are replaced by light bulb"
  src="/assets/img/distinction-drawer-flowers.png"
  style="max-height: 480px; margin: 2rem auto"
/>

Earlier this week [Martin Fowler](https://martinfowler.com/aboutMe.html)
revealed who he was all along. Turns out, he [sees himself as a "distinction
drawer"](https://twitter.com/martinfowler/status/1363847064317263876?ref_src=twsrc%5Etfw)
in software. The confession immediately clicked for me. I realised that being in
this distinction-drawer mode is something I like a lot in my job as a software
engineer.

What does it mean to be in distinction-drawer mode?

We're in this distinction-drawer mode when we take a step back from the day to
day activity of writing code and start reasoning about what we're doing. While
doing so, we see our current bit of code as a tiny cog distinct from other parts
of the larger machine. We're thinking "meta". 

When we're writing specs for a new feature, using our knowledge to articulate
how this feature could be built upon multiple logical parts of the codebase
talking to each other, we're also in this distinction-drawer mode.

What logical distinctions can we draw? How do we combine things with one
another? How do we avoid making false equivalencies? What are the fundamental
responsibilities at play? What concepts should we bring together to reach our
goal? Making strong, identified distinctions will help us build a strong new
feature, but it will also enable us to preserve the "machine" as well.

Imagine a gardener having to plant a new flower, stepping back from the
flowerbed to decide what's the next step. Where will the flower go? And why
there? To answer that without relying only on a possibly flawed intuition, the
gardener uses years of previous experiences as well as the general rules of
gardening.

This moment of thought, this step back, has a purpose. It enables the gardener to
stop focusing on the single flower, seeing the whole garden instead. With this
point of view, finding how the new flower can be combined with the existing
plants becomes easier. The gardener can now see where, and why. It triggers the
distinction-drawer mode.

Can the flower go here? No it can't because it's not the right color. Can it go
there? The surrounding flowers are the right color, but much taller; it would
ruin the new one. Drawing distinctions is acknowledging a flower is not a
garden.

It should not be confused with the attitude we have when we're just taking a
pause from coding. It's nothing like having a coffee with a colleague and
sharing how our tasks are doing.

It's about using the ideas we collected from technical books we've read,
technical discussion we had, common patterns we've seen over the years working
on different codebases to understand better what is at stake in what we're
doing. It is actual work, maybe the most important part of it even.

It's [seeking the
truth](https://twitter.com/ericnormand/status/1313854365741076480). We're
bringing concepts and models on the table to reason from [first
principles](https://jamesclear.com/first-principles).

Doing so, we try to find the fundamentals principles hidden behind our code. We
reason about responsibilities and boundaries. Where is the code [dealing with
*state*](http://localhost:4000/tech/posts/2020-11-22-state-store-in-frontend-codebases)?
How do we *store* data? When are we doing *requests* to other services? How to
represent *permissions*? What is the responsibility of the *view*?

We're distinguishing logical parts from each other, forming a modularised
picture in our head (and at one point on paper, hopefully) where each part has a
clear and strong role.

Coming back to our code with such a picture in mind helps us better articulate
what we're doing. We now know *this thing* should be put *here*, but *this other
thing* should be done *there* and we know how to explain it to our colleagues. It
looks like nothing but it's extremely powerful.

Sometimes it's real Eureka! moments.

A lot could probably be added on this curious topic. Can someone always be in
distinction-drawer mode, disconnected from the raw, immediate code?  Which
resources can be used to grow such a mindset? Can we be in distinction-drawer
mode collectively? How do we convince colleagues who don't bother with first
principles reasoning?

Distinction-drawer mode can start very simply, like [Jay Rosen
explains](https://twitter.com/jayrosen_nyu/status/1363669902238900225). "When in
doubt, draw a distinction." This is the complete opposite of what we're usually
doing in software when facing an architecture issue.

Instead of trying to group things together or add things over existing things,
let's try to find how to separate them in a way that makes the most sense,
bringing classic computer science concepts to help.

---

Thanks to [Benoit Rajalu](https://www.benrajalu.net/) for having helped with
drafts of this.

Illustration made by [Bulbman.art](http://Bulbman.art).
