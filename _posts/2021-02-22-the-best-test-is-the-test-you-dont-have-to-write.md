---
title: The best test is the test you don't have to write

draft: false

page : false

image: /assets/img/best-test-trees.png

excerpt: >
  We heavily invest in tests to assert the quality of the codebase,
  but directing our efforts at typed languages and advanced 
  knowledge representation would make more sense.

---

![Abstract illustration of trees](/assets/img/best-test-trees.png)

When a software engineering team wants to improve or secure its codebase
quality, it often heavily invests in tests. 

But tests are not a magic remedy, and they are far from cheap.

Using tests as the *only* tool that can help with quality can actually cause
troubles. Are they worth the cost of their conception and maintenance? How can
we maintain or improve the quality of a codebase without bloating it with
superficial tests?

## About tests

Let's say we wrote some code. Disciplined as we are, we know it's time to add
the corresponding test. We have the maturity to know we need different levels of
testing to cover a feature: unit testing, integration testing, end-to-end
testing, snapshot testing, etc.

It's a common reflex and our intentions are good. However, continuously adding
tests does create issues on its own. All the tests become a "codebase in the
codebase": with the dedicated libraries we use for them, the testing framework
that is so hard to change, the CI time required to run the whole test suite, the
maintenance those tests need, their flakiness, the colleagues complaining they
need the best-in-class computer to run them in an acceptable time, etc.

Tests are not free, so let's challenge our good intentions. Why are we writing
them in the first place?

We write tests to assert our code performs correctly under given constraints.
We know writing code is not easy, and a lot can go (and has gone) wrong.

## Being its own enemy

The key element is that tests are performed under "given contraints". If the
world always was in one single and predictable state, we would not have to write
and maintain any test: our code would run the way we've tested it by hand the
first time.

But the world can be in an infinite number of states. To be always safe, our
code and therefore our tests would need to accommodate as many of them as
possible.

It's especially true when we write code that will be used by other code. The
larger the API we write, the more states we allow and the more tests we will
have to write. Hell is paved with good intentions.

We don't need good intentions, we need properly-scoped ones. If we agree that
everything our code *can* and *should not* do will require testing, then we
should enforce strong limitations to our code's scope.

In other words we should not write code that allows *impossible states*. 

## Impossible state

Impossible states are any states our code should not be in. A password that is
empty during a login. A payment that is at the same time waiting for approval
and rejected. A data we're fetching that is both loading and successful.

Let's take the example of the data we're fetching. We can call such data a
*remote* data. Imagine we're writing a naive React hook that does an
unspecified request and returns some data. One can use it like so:

```typescript
const {
  isLoading, // true | false 
  error,     // Error | undefined
  data,      // TheData | undefined
} = useMyRequest()
```

How many states can be represented by the API here? 2\*2\*2 = 8 states. Not
conviced? Here is the list of all of them:

<figure>
  <div markdown="1">

| isLoading | error | data |
|-----------|-----|------|
| true | undefined | undefined |
| true | undefined | Data |
| true | Error | undefined |
| true | Error | Data |
| false | undefined | undefined |
| false | undefined | Data |
| false | Error | undefined |
| false | Error | Data |

  </div>
  <figcaption>
Each line is a possible state created by this hook
  </figcaption>
</figure>


That's a lot of possibilities and some of them are clearly not needed. After
all, how many actual states can or should a naive remote data fetcher be in?
Probably only 4: request not yet asked, request loading, request failure,
request success.

The API we chose with the hook above therefore leaves us with 4 valid and 4
impossible states:

<figure>
  <div markdown="1">

| isLoading | error | data |
|-----------|-----|------|
| true | undefined | undefined |
| false | undefined | undefined |
| false | undefined | Data |
| false | Error | undefined |

  </div>
  <figcaption>
  The valid states
  </figcaption>
</figure>

`false | Error | undefined` for example means "request completed, but resulted
in failure", which is one of the valid states.


<figure>
  <div markdown="1">

| isLoading | error | data |
|-----------|-----|------|
| true | undefined | Data |
| true | Error | undefined |
| true | Error | Data |
| false | Error | Data |

  </div>
  <figcaption>
  The impossible states
  </figcaption>
</figure>


`true | Error | Data` means nothing for our naive request (both error and data
while still loading). It's an impossible state unrepresentative of the actual,
  actionable code functionality.

To ensure those 4 impossible states never happen despite the API allowing them,
we would need to write tests around the API, like an alarm system. "Hey! The
things you knew could happen but did not want to happen... they did happen".

Is it irremediable? It should not be. Testing the four valid states is enough
work already, why deal with the impossible ones?

So, how to [make impossible states
impossible](https://www.youtube.com/watch?v=IcgmSRJHu_8)?

## Representing knowledge in code

[There is more to software engineering than continuously producing code (and
tests)](http://guillaume.wuips.com/tech/posts/2020-12-01-defining-success-engineering-team).
We sometimes have to pause and reflect on what models we're using, what business
features we're implementing. We can then use code to write this knowledge down.

Now that we know our remote data can only be in 4 possibles states, how do we
enforce it with code rather than tests?

Such a mindset is something we're more used to see in codebases written with
ML-languages like Haskell:

```haskell
data RemoteData = NotAsked
                | Loading
                | Failure Error
                | Success TheData
```

But we can also write something similar using more familiar
languages, here in Typescript: 

```typescript
type RemoteData<E, P> = 
  | { type: 'NotAsked' }
  | { type: 'Loading' }
  | { type: 'Failure', error: E } 
  | { type: 'Success', payload: P }
```

This typing explicits our targeted benefits. The request can't be at the same
time loading and with an error. 

Working with such a model is both easy and secure: we're forced to handle each
state in order to eventually access the one with data, and we're limited to the
4 states defined earlier:

```tsx
function Component() {
  const request = useMyRequest()

  switch (request.type) {
    case 'NotAsked':
      return <NotAskedScreen />

    case 'Loading':
      return <LoadingScreen />

    case 'Failure':
      return <ErrorScreen error={request.error} />

    case 'Success':
      return <SuccessScreen data={request.payload} />
  }
}
```

We have covered all valid states and no impossible ones. The developper writing
the `useMyRequest` hook has 4 less tests to write: the typing of the hook itself
enforces the output can ever only be these four cases. Testing it further would
be testing the language itself. We have scoped our code properly. Developers
using the hook also have 4 less tests to write as a result. Everyone is happy
and can go home early. Good work!

## Using this mindset at scale

There are tools available to help us write code focused on producing no impossible states.

### Typings

Using a typed language of course helps a lot. Though they are not mandatory,
they certainly help developers avoid blind spots in their code. It's the
low-hanging fruit of code quality.

When we write this...

```typescript
const someNumber: number = 2
```

...we're using the language to help remind ourself that valid states for
`someNumber` are all the numbers. Don't put a `string` in there.

The challenge is to push this simple idea as far as we can, not just using what
the language offers (low-level types) but typing higher level code using the
same basic principle. 

As we've seen, exploiting typed languages save on testing time. If the language
itself makes it impossible for `2+2` to ever equals anything but `4`, why would
we need to double check? What our code can and cannot do is no longer only our
responsibility as developers, it is now also woven within the very fabric of it.

### Theory

Mathematics, type theory and functional programming also help. We should
especially be interested by [Algebraic Data
Type](https://en.wikipedia.org/wiki/Algebraic_data_type) (ADT) and more
precisely *sum types*.

Sum types are types where the value must be one of a *fixed* set of options.[^1]
The `RemoteData` type we wrote is a sum type.

Libraries that leverage those concepts and functional programming are strong
allies. The Typescript ecosystem has seen the addition of a lot of libraries in
that space recently.

Don't bother writing the above `RemoteData` stuff by hand.
[A library](https://github.com/devexperts/remote-data-ts) does just that.
[`fp-ts` also offer a lot of ADTs](https://github.com/gcanti/fp-ts) to model
what's going on in our codebase like having *either* something or something else
(Either) or maybe having something or not having it (Option).

The thing is, our applications are not that different. If you are faced with a
feature and ponders on its modelling as code, chances are a tool has been made
to help you do just that.

### Design

Last but not least, our brains! As software engineers, it's sometimes tempting
to rush into writing code without having analysed what we should represent and
which valid states we should support.

It's not just about using technical concepts such as `RemoteData`, `Option` or
`Either`. It is first and foremost about using the right mindset to represent
the high level states the codebase should be in.

## Conclusion 

Does it mean we should stop writing tests? Certainly not. Tests are absolutly
necessary to prevent our codebases to fail.

But remember, we need tests because our code can fail. Reducing the number of
way it can fail should be our priority. We can then keep writing tests for
the few remaining chances of failure.

The best test is the test you don't have to write.

---

Thanks to [Benoit Rajalu](https://www.benrajalu.net/) and [Nicolas
Maligne](https://twitter.com/nicomaligne) for reading drafts of this.

Illustration made by [Bulbman.art](http://Bulbman.art).

---

[^1]:
    This post, [Algebraic Data Types: Things I wish someone had explained about
    functional
    programming](https://jrsinclair.com/articles/2019/algebraic-data-types-what-i-wish-someone-had-explained-about-functional-programming/),
    explains what ADTs are and the difference between product and sum types.

    The first `useMyRequest` returned value was a product type.
