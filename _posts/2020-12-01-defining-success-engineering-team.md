---
title: Defining success for an engineering team

draft: false

page : false

---
*Looking back at the two years that made us challenge our engineering habits.*

In the coming weeks my team at iAdvize will be making public the first step
towards a complete overhaul of one of the company's key products. Like most
strategic parts of a 10 year old software suite, this app has had its fair share
of stories to tell.

Those stories could be of the scary kind. They were legacy. As the engineering
team working on its codebase, we were not confident that we had what it takes to
deliver evolutions (or basic maintenance). It is a classic software engineering
issue.

We reached this conclusion two years ago. We have since managed nevertheless to
deliver new features, improve old ones and map a new path that let us overhaul
the app significantly. Did we do this following a carefully crafted plan? Not
really, not at first. But since we might have to do it again, let’s go ahead and
document what made it work. 

Let us show you how we learnt to fight against uncertainty with tools and
methods, how we cultivated certainty by writing things down, by reasoning in
“first principles”, by building architectural, technical and human leverage
focused on the long-term. Let us show you how we became a Product team and why
it worked. Let’s reverse-engineer this success.

<figure>
  <img alt="Abstract illustration of glasses " src="/assets/img/defining-success-6.png" />
</figure>

# Two years ago, in a galaxy far far away

The story starts around an old and complex iAdvize frontend application. It was
not really abandoned, but it was not really under control either.

It was the Big Legacy App™.

Teams were scared of it. Some of its features were built when we were still
maturing as engineers, unsure of how we should build our stack. Some had to be
shipped fast and single-handedly by developers now long gone. Few of the current
devs in our team had first-hand experience with the code.

Its UX was poor partly because its developer experience was bad. There were bugs
and performance or accessibility issues. Maintaining the codebase and solving
these issues was difficult: it was a mix of spaghetti code here and there, a
strange soup of paradigms and libraries, of bad naming and no real separation of
concern.

It left everyone frustrated. Developers had to apply patches for obscure bugs or
add new features precariously relying on dodgy code while the product team
didn’t really understand why everything took so much time with this app.

Something had to be done. Nearly two years ago, management decided to form a new
team dedicated to the Big Legacy App. At first, two front-end developers rallied
around one product manager. Two more developers have joined in since then.

The mission was obvious, we needed to deliver a product that serves its users
well and that can meet their evolving needs without friction, a product that
could grow with new business requirements alongside the rest of the iAdvize
solution. An obvious mission does not make it an easy one. Soon we realised we
had to change our approach. We needed an engineering strategy.

<figure>
  <img alt="Abstract illustration of a man " src="/assets/img/defining-success-1.png" />
</figure>

# Not everything is uncertain in the world

Let’s face it: as software engineers it is easy to work on autopilot on such a
codebase. Patching bugs after bugs, adding features on top of legacy features.
“Ship ship ship!” and *voilà*, job done.

**Like many, we were used to this autopilot mode but we started seeing it as a
dangerous mindset.** **Unlike some, we decided it is not the nominal condition
of software engineering.** We refused to see ourselves as mercenaries.

Autopilot is an approach rooted in the present. It assumes the future is
uncertain and the past not worth digging up. But is it true? It kept putting us
in a “not worse, not better” situation. Maybe we could succeed at not making the
codebase worse, but we could not make it better along the way. We were
preserving an uncomfortable status quo.

Is it so unrealistic to plan for the big picture? To specify how things should
combine and work together? We wanted to change our mindset.

The turning point for us has been realizing that changing things does not mean
that everything has to be thrown away, even in this scary Big Legacy App. We
found that some things do not change often: our core business, the features we
provide, the APIs we use, the data we manipulate, the UI we have to implement,
etc. It is the product’s vision and its value. Once isolated from the uneasy fog
of the legacy, it becomes solid ground. It is a rich soil to cultivate on.

In other words, we saw two kinds of things in this codebase: the uncertain
things that must be fought and the certain things that must be cared for.

## The uncertain things that must be fought

The bugs, the spaghetti code, the unpredicatble module left by a long gone
engineer, the undocumented black box, the 4-year old fork of a famous library to
fix a bug in a hurry, etc.

We have to fight them intelligently. That is the part we must identify and
eventually remove.

## The certain things that must be cared for

The business rules and their edge cases, the workflows, the API calls, the data
we use. The well documented and reliable external library. The software
architecture books that inspire us.

**The knowledge of this capital can be lost, spread out in the codebase or
forgotten because some developers have left.** Its usefulness however is always
obvious and it is therefore often rediscovered on the go.

Such certainty has to be handled with care: it is what is precious about the
product and the team that builds it. It should be curated, organised and
documented so it can endure.

<figure>
  <img alt="Abstract illustration of hands " src="/assets/img/defining-success-2.png" />
</figure>

# Fighting the uncertainty

There are two levels of uncertainty. The first one is the codebase itself and
its behavior. Code that is hard to read, buggy features, undocumented or
hard-to-understand librairies or APIs. That is the easy part… of the hard part.

The second one is more tricky. **It is the uncertainty in ourselves**. It is
what happens when we are tired and forget about some edge cases. It is when we
have to accomodate with colleagues with different mindsets or motivations or
when we are simply wrong in our assumptions or lacking some key concepts.

Uncertainty can be created on purpose or accidentally when a team is mismanaged.
One can undermine a team’s attempt at focusing on the product rather than the
project, citing a need for immediacy or arguing that there could be [such a
thing as “too much
quality”](https://martinfowler.com/articles/is-quality-worth-cost.html).

To fight these uncertainties we progressively added specific tools and methods.

We committed to not write Javascript anymore by switching to Typescript,
strongly tied with a functional programming approach (with
[fp-ts](https://gcanti.github.io/fp-ts)). This helps manage the intrinsic
uncertainty of the language itself and the data we manipulate. We now try to
leverage our new language / paradigm combo to write the most robust code we can.
We wrote an article, [how we model our entities with opaque and sum types in
Typescript](https://medium.com/iadvize-engineering/how-to-model-your-entities-with-opaque-and-sum-types-in-typescript-round-2-a3ca7a474773),
that gives an example of just that.

We also invested in a good darklaunch tool and decided to always use it to
deploy new big features. This helps manage our partial understanding of the
business rules and client usage of our product and balance this uncertainty with
the need of shipping new features. The progressive rollouts and the impact they
had on the codebase (isolation of the old code, atomic deploys) allowed us to
gain confidence and velocity. We wrote [a full article on
this](https://medium.com/iadvize-engineering/feature-flags-strategy-iadvize-fd2f993d177b)
as well.

Sometimes, something new has to be implemented: a new [low-level
tool](https://github.com/iadvize/store-library), a complete revision of a
complex component or a brand new UI for example. It is impossible to produce a
great solution instantly so we have regularly benchmarked external libraries,
user-tested things or built Proof Of Concepts (POCs).

UI POCs happened to be extremely useful for us when working in pair with our
designer on a complete interface revamp. Static mock-ups were not enough: we had
to find a way to validate the relevance of the new UI in the browser, assessing
its technical feasibility before jumping on the hard and long work of
implementing it in our still-legacy codebase. Think of this as lifting the fog
over a perilous valley before marching on.

Our approach to testing also completely changed. Two years ago our mantra was
“unit-test all the things”, from the Redux action type to the most complex
function. This was a doomed endeavour from the start, given our situation.

**As a team with scarce resources in both time and devs, we have to choose
carefully what we do.** Having switched languages and paradigm helped us
drastically reduce the number of unit-tests needed without compromising on the
quality of our work. We switched to visual snapshots when appropriate and
end-to-end testing that are in certain situations way [more
relevant](https://increment.com/testing/designing-automated-tests-for-react/).

<figure>
  <img alt="Abstract illustration a race " src="/assets/img/defining-success-3.png" />
</figure>

# Cultivating the certainty

The problem with certainty is how easily it leads to overconfidence. You’re
really confident about this new project the PM has presented and you think
you’ve understood all the constraints of a library by reading its README. Then
the moment you have to write code for this project in your app, you discover a
new level of complexity. This happened a lot with our legacy app.

Then there is the time factor. As time goes, certainty about things can decrease
quickly. It is what happens when people come and go with their knowledge of the
business rules. Not only people, but code obviously changes over time. Combine
the two, and you get that feeling we feel coming back from a long vacation and
we can’t fully understand our code anymore. Certainty should be cultivated with
care.

To do just this we introduced a new method: we started to [plan seriously before
we do](https://increment.com/teams/code-less-engineer-more/). We don’t want to
discover something fundamental at the 90% build milestone on a project anymore.
We used to only give some clues on how to implement things in Jira tickets. Now
we dedicate 30% to 50% of the project time writing *thorough* *specs* (see also
[Google Design
Docs](https://www.industrialempathy.com/posts/design-docs-at-google/) as
inspiration). This helps a lot in creating strong certainty about what we are
doing. No more last-minute surprise that challenges a whole project. And when
you come back from your hard-earned vacation, you have ample documentation to
remind you what’s what.

This pattern soon became central to our team. We now write things down. We write
specs, as we’ve seen, but we don’t stop at them. We use
[ADRs](https://github.com/joelparkerhenderson/architecture_decision_record) or
RFCs to keep track of decisions. We try to write business knowledge directly *as
code* (we call this part of the codebase the *domain*). We write APIs contracts
with parsers like [io-ts](https://github.com/gcanti/io-ts).

**The goal is not to set things in stone but to extract the knowledge from
people’s brains.** We want to refer to it and challenge it constructively in the
long term. With this we can preserve and share the certainty we have on a
subject for a long time.

Certainty is not just about our confidence in our codebase. It is also about our
understanding of classic computer science subjects and our knowledge of the
frontend ecosystem. It is a little bit about not trusting our weak human brains
as well. Unconsciously, we regularly “borrowed” certainty from others by reading
articles, books, watching conferences, trying new languages. It is not so much
about introducing new tools in our codebase as it is about learning new concepts
that will inspire us and help us reason from [first
principles](https://fs.blog/2018/04/first-principles).

<figure>
  <img alt="Abstract illustration books seen as flowers " src="/assets/img/defining-success-4.png" />
</figure>

# Building leverage

We recently understood that our process can be summarized as trying to work in
[Product-mode as opposed to
Project-mode](https://martinfowler.com/articles/products-over-projects.html).
Our goal has been to consolidate a durable team around our specific product. We
think it’s a powerful mindset to take back control of a legacy codebase such as
ours. It creates actionable knowledge and the right dynamic to motivate people.

Once we got the hang of having a long term mindset we understood that
**everything is about
[leverage](https://www.value.app/feed/the-age-of-infinite-leverage)**: investing
strategically in things that will “maximize the output of our work” in the long
term.

There is architecture leverage. The team needs a mental framework to put things
in the right place in the codebase, handle uncertainty properly and dissect new
projects correctly.

We now use [Domain Driven
Design](https://www.oreilly.com/library/view/domain-driven-design-tackling/0321125215/)
for that. It is our structural framework, helping us handle the legacy code and
the external actors around the app. All our specs are now written through the
prism of the infrastructure / application / domain / view layers.

There is also [technical
leverage](https://lethain.com/building-technical-leverage/). We invested time in
automation (great CI and continuous deployment with end-to-end tests embedded),
in the Typescript / functional programming approach that kind of automates part
of the work we would manually do writing standard Javascript. We also set-up
bots that rebase and merge Pull Requests automatically or alert us of production
errors or deployments.

<figure>
  <img alt="Abstract illustration of a wall " src="/assets/img/defining-success-5.png" />
</figure>

Last but not least, there is human leverage. Since we are a small team we don’t
feel the need for formal processes but there are nevertheless key takeaways.

We are lucky to have a diversity of frontend developers in the team, in both
skills and experiences. Some are UI and design systems experts, some are more
into codebase architecture. Some are really invested in leveraging Typescript
while others are more into agile processes and team building. Some of us are
juniors fresh from school, others are seniors with multiple past experiences.
Thanks to this diversity everyone has something to learn and we challenge each
other’s work constructively.

We also put attention in cultivating empathy for one another in our day to day
interactions, like during [code
reviews](https://mtlynch.io/human-code-reviews-1/). We are not robots.

And finally, we try not to make mountains out of molehills but to focus and
celebrate things that matter instead. We’ve been confined and separated from
each other because of COVID-19 for a few months now. Is it the end of the world?
Probably not! The relationships we have formed inside our team are not about the
superficiality of sharing the same open-space for 8 hours a day or drinking a
beer every week with the rest of the company. It is about our common mission,
about freely sharing our feelings on a project. It is promoting transparency,
giving praise and celebrating team milestones together even remotely.

Now that our *Product mode* team is formed and sticks to an engineering
strategy, **projects are seen as opportunities**, small steps towards the
technical vision, even if we have to sometimes “hack” the roadmap the management
wants us to follow. Projects are not isolated periods of time decoralated from
previous and future work, they are part of the journey.

This [pragmatic
mindset](https://www.oreilly.com/library/view/the-pragmatic-programmer/9780135956977/)
doesn’t prevent the team from doing the easy things early, but we plan for the
hard things even earlier. Thanks to that, everything is seen through a solid
technical vision and we can actually move faster. Old parts are isolated
correctly and are not obstacles for new code anymore.

When the time comes for us to rework a legacy part of the codebase, it is not so
much about refactoring than it is about shipping a new version (with darklaunch,
of course!) that will enable new usages or consolidate current ones. What would
you do if you had a lousy, heavy bike with a rusted frame, no wheels and no
brakes but were asked to run the Tour de France? You would assess your budget.
If you find it more costly or inefficient to repair the broken bike than it
would be to build a light and speedy new one, you would build a new one. We’re
sure that PMs, managers and businesses understand this mindset.

And because everything is about the long term, **patience is key**. It is a
marathon, not a sprint, and from time to time everyone must zoom out and
remember the road ahead.

# Where are we now?

This is the team’s vision:

1.  **Fighting the uncertainty** with tools and methods: languages and paradigms,
deployments strategies, POCs, smart tests, …
1.  **Cultivating certainty** by shutting down the autopilot and dedicating time for
thorough specs, writing all things down, and being curious about new concepts.
1.  **Maturing as a Product-mode team** that builds *leverage* by looking for the
right mental framework to think about its codebase, investing in technology and
people.

Is it to say that we’ve succeeded at all of this and we don’t have to be
cautious about it anymore? No. It is a day to day fight against our tendency to
see everything with a short term vision. It is tempting to work in
*Project-mode* but we know deep inside that without [a coherent engineering
strategy](https://lethain.com/good-engineering-strategy-is-boring/) it will be
very pricey in the long run.

Of course we cannot design everything at once and once for all. Having an
engineering strategy is not about that. It is more about collecting tools,
concepts and methods, having “designed the way we design things” as [Guy Steele
explains](https://www.youtube.com/watch?v=_ahvzDzKdB0&app=desktop), and
leveraging all of that.

**There is more to the software engineering job than producing code
continuously**. It is also about designing solutions, planning a strategy,
mentoring people and building relationships: all of which help tremendously with
the coding part.

<figure>
  <img alt="Abstract illustration of people seen as flowers " src="/assets/img/defining-success-7.png" />
</figure>

<br> 

--- 

This article has been written with the fantastic help of Benoit Rajalu.

Thanks also to the rest of the team — Victor Graffard and Nicolas Maligne — as
to Fhenon De Urioste, Anthony Griffon, Pierre-Alexandre Gury, Nicolas Declercq,
Wandrille Verlut and Arno Baudu for reading drafts of this.

# Resources for inspiration

On software engineering in general:

* [The Pragmatic Programmer: your journey to mastery, 2nd
Edition](https://www.oreilly.com/library/view/the-pragmatic-programmer/9780135956977/)
by David Thomas, Andrew Hunt
* [Staffeng.com](https://staffeng.com/) and [lethain.com](https://lethain.com/) by
Will Larson
* [Is High Quality Software Worth the
Cost?](https://martinfowler.com/articles/is-quality-worth-cost.html) by Martin
Fowler and all [martinfowler.com](http://martinfowler.com) in general
* [Hammock Driven
Development](https://www.youtube.com/watch?v=f84n5oFoZBc&feature=youtu.be) by
Rich Hickey
* [Think in Math, Write in Code](https://justinmeiners.github.io/think-in-math/)
by Justin Meiners
* The [Increment magazine](https://increment.com) from Stripe

On software architecture:

* [Domain-Driven Design: Tackling Complexity in the Heart of
Software](https://www.oreilly.com/library/view/domain-driven-design-tackling/0321125215/)
by Eric Evans
* Rich Hickey with [Design, Composition and
Performance](https://www.youtube.com/watch?v=MCZ3YgeEUPg), [Simple Made
Easy](https://www.infoq.com/presentations/Simple-Made-Easy/)
* [Run Less Software](https://www.intercom.com/blog/run-less-software/) by Rich
Archbold

On tools and concepts:

* [Giulio Canti](https://twitter.com/GiulioCanti) for fp-ts, io-ts and others
functional programming libraries
* The [Mostly adequate guide to
FP](https://github.com/MostlyAdequate/mostly-adequate-guide)
* Rich Hickey again with [Maybe Not](https://www.youtube.com/watch?v=YR5WdGrpoug),
[Are We There
Yet?](https://www.infoq.com/presentations/Are-We-There-Yet-Rich-Hickey/),
* [Features Toggles](https://martinfowler.com/articles/feature-toggles.html) by
Pete Hodgson

On management and remote:

* The Basecamp crew for [Rework](https://basecamp.com/books/rework), [It Doesn’t
Have to Be Crazy at Work](https://basecamp.com/books/calm) and
[ShapeUp](https://basecamp.com/shapeup)
* [The Extraordinary Coach: How the Best Leaders Help Others
Grow](https://www.oreilly.com/library/view/the-extraordinary-coach/9780071703406/)
by John Zenger and Kathleen Stinnett
* [It’s Not Enough to Be Right — You Also Have to Be
Kind](https://forge.medium.com/its-not-enough-to-be-right-you-also-have-to-be-kind-b8814111fe1)
by Ryan Holiday
* [Context over control: the future of remote
work](https://pulseasync.com/operators/future-remote-working/) by Leonardo
Federico

Illustrations by [absurd.design](http://absurd.design)
