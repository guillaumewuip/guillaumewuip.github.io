---
title: Where is my store stored?

draft: false

page : false

image: /assets/img/where-is-store-stored-illustration.png 

excerpt: >
  Not all stores location are equal in our Javascript codebases. Let's look
  at them to understand the constraints that come with them and how a store's
  location impacts how it can be used.

---

<img
  alt="Abstract illustration of a person holding two puzzle pieces"
  src="/assets/img/where-is-store-stored-illustration.png"
  style="max-height: 480px; margin: 2rem auto"
/>

Some of us have concepts in mind that they keep returning to over an over, as if
obsessed with them. For me as a frontend software engineer, it's all about the
concepts of *State* and *Store*. I keep looking at technical issues through this
lens - current and previous colleagues know this all too well (sorry
colleagues!). I've actually already [written about
it](/tech/posts/2020-11-22-state-store-in-frontend-codebases) in the past.

I have changed companies a few month ago to join BlaBlaCar and the very cool
frontend team building and maintaining its web app. After this move I find
myself in situations that make me change how I think about the "frontend Store
dilemma" I kept referring to. There is now a new question I ask myself again and
again looking at our frontend codebases:

Where is the store stored?

# State vs Store - one more time 

Let's go back to the difference between the concepts of *State* and *Store*
even though we sometimes use the two terms indistinctively in frontend
codebases. In every frontend app, data (the State) is stored somewhere (the
Store).

When we're thinking about states, we're in the world of ideas. We ask
questions about what those states represent, which transition between states are
valid, or how should we shape our states.

When we deal with stores, we're not in the world of ideas anymore. We're back in
the reality of the code that runs somewhere, mainly in a Javascript runtime.  We
ask where do we store out data, how do we read it, how do we write it, how can
we subscribe to changes?

In this post, we're focusing on the "store" kind of questions.

# The multiple places we can store our stores

The reality of the store that lives "somewhere" in the code is the very
problem. The store in itself, whether a simple variable or a full Redux store,
has be stored somewhere in our browser, NodeJS or other fancy javascript
engine runtime. 

Deciding *where our stores are stored* is not trivial and comes with big
impacts. Let me draw here the three main potential locations we can use for our
stores.

## Modules

We can use modules to host our stores. It's quite convenient and it makes full
use of the Javascript ES6 language.

Let's say we have a module storing Cars (our state here).

```js
// cars/store.js

const _cars = []

export function add(car) {
  _cars.push(car);
}

export function list() {
  return _cars;
} 
```

This `cars/store.js` module acts as a very naive store with both *read*
(`list`) and *write* (`add`) functionalities.

Using this store in the rest of the codebase is very easy: we just have to use
classic ES6 imports.

```js
// another/part/of/the/codebase.js
import * as Cars from '../path/to/cars/store';

function doingSomething() {
  console.log('current cars: ', Cars.list());

  const newCar = "My old car";

  cars.add(newCar);
}
```

And *voilà*! Because ES6 module are stateful, the `_cars` "private" variable
will stay the same across all imports, making `cars/store.js` a store by itself.

Should we need a reactive store (ie. being able to *subscribe* to state
changes), we would write our own subscribe function by hand or use classic store
libraries (some opinionated like Redux, Mobx, or some more transversal like
the [@fp-51/store](https://github.com/fp51/store-library) I authored one or
two years ago). 

## Libraries / Framework location

Another very common way of storing our store is using the locations provided by
the main view library or framework we use (React, Vue, etc.).

Let's say that we're using React here. The *go to* store location is then a
simple `useState` hook.

```js
// app.js
import React from 'react';

import { UserContext } from './cars.js'

function App({ children }) {
  const [cars, setCars] = React.useState([]);

  const addCar = car => setCars(cars => [...cars, car]);

  return (
    <MyComponent cars={cars} addCar={addCar} />
  )
}
```

We're not using modules to host our store anymore. React does it for us via
`useState`.  Note that we're reactive by default here: calling `addCar` in
`MyComponent` will rerender all `<App />`.

Using `useState` alone usually doesn't scale well as we're forced to pass `cars`
and `setCar` everywhere through props. The issue is called [props
drilling](https://sebhastian.com/react-prop-drilling/). To overcome this, we
can add a `Context` to make our state and its API available to every child
components via a simple `useContext` - even if [it's not made for
that](https://twitter.com/sebmarkbage/status/1219836431972978689). The idea is
the same: the store is stored inside React "runtime" via `useState`.

## Programmatic store

And finally, there's the good old way: dependency injection by hand. Let's say
we're in a full custom app (no React shenanigans) and we don't want to use
modules. We can then craft a store instance when the app starts and pass it
along everywhere via function parameters.

Let's write a store factory very similar to the ES6 module option.

```js
// store.js
function buildStore() {
  const _cars = [];

  return {
    add: (car) => {
      _cars.push(car);
    },

    list: () => {
      return _cars;
    },
  }
}
```

Now that our store's factory is ready, we just have to craft a store instance
somewhere in our app's entrypoint and pass it along everywhere.

```js
// index.js

function startApp(store) {
  store.add('new car');

  document.body.innerText = store.list().join(', ');

  // ...
}

function initApp() {
  const store = buildStore();

  startApp(store);
}

initApp();
```

Of course, any function that needs to access the store will have to receive it
via its parameters... We're right back where we left our props drilling issue.

# Pros and Cons of each store location 

We've outlined three potential store locations. You can see me coming with
the list of pros and cons for each of them. 

Let's start with modules. Pros: it's raw ES6 (`import` / `export`) and it is
quite simple to grasp. It's also very flexible. We can do more or less whatever
we want in a module and every part of our codebase can use it.

But there is a big constraint. The same codebase can be used in different
runtimes.  Actually a lot of single page applications run in both browser and
NodeJS runtimes, where the contexts are very different. In the browser, we can
make the assumption that there is only one user at a given time using the
runtime. So our module state will be "our user state". On NodeJS, we will
probably use the code to render the page server-side for multiple HTTP requests.
In this situation, our module state will be shared between multiple users. Boom!
Enjoy the data leak issue.

For library or framework locations such as our React `useState`, the big
advantage is probably the strong integration with the corresponding library.
Even bigger store solutions like Redux come with their bindings like
`react-redux` that do the job for us. No need to handle the Context / Provider
stuff I mentioned. No issue with server-side rendering: the store being "in
React runtime", it will be scoped to the `ReactDOM.render` or
`ReactDOMServer.renderToString` which will be called once for every http
requests.

I'm beginning to think this deep integration with view libraries in a way that
makes server and browser contexts similar is a big factor in the success of
Redux and others (Mobx, etc.).

The main issue is however that we're locked to the corresponding library /
framework. Let's say you have an SPA where you want to limit React to the
views, and that you need to read / update / subscribe to store change in other
contexts. You just can't, it's React or bust. Back at square one.

Let's give another chance to our programmatic store sharing solution, ie.
"crafting a store as soon as the app starts and then pass it along to every
subsequent bit of code that needs it through a sort of a handmade dependency
injection".

It's clearly not very convenient to have to pass our store programmaticaly to
every part of the codebase as it creates a lot of boilerplate, but at least
we face no issue with SSR if we craft one store per request server-side, and one
store when the app starts browser-side. It is very flexible as well: we
can do whatever we want with our store and use it everywhere in the codebase.

I didn't mention testing as all three locations look kind of similar to me in
terms of how easy it is to test code that rely on them. We can use full module
mocking (eg. with `jest.mock`). This is especially usful for option 1. We can
also use "programmatic mocks", more or less handcrafted (option 2 and option 3)
by crafting fake stores and passing them to the code that use them (through
injection or by wrapping a fake React `Provider`).

# No one location to rule them all

There is no perfect solution to host stores with Javascript. It's all about
compromises. The module location is very convenient as long as you don't have to
render your app server-side. We don't have threads or the luxury of a
single runtime per user there. You may find solutions exploring low level [NodeJS
primitives](https://nodejs.org/api/worker_threads.html) or [V8
functionalities](https://github.com/laverdet/isolated-vm) deep features to
isolate runtimes, but it's certainly not out of the box.

The library / framework location is very convenient but leaves no
room for code outside of the library / framework pattern which is a big issue in my
opinion for big and/or old codebases that have to support multiple technologies,
historicities and teams.

The programmatic store, while not being very convenient by forcing us to inject
our store everywhere by hand, could be a good low-level start on top of which
we could build abstractions for the different parts of the codebase (providing
React context for the views, automatic dependency injection for other parts of
the code, for example).

So here I am now. Every time I deal with a store I'm looking at *where the store
is stored* to understand the constraints that come with its location and how it
can be used and I suggest you do the same. Another fascinating part of the State
and Store puzzle!


---


Special thanks to [Benoit Rajalu](https://www.benrajalu.net/), [Antoine
Sauray](https://twitter.com/asauray) and Sylvain Hamelain for having reviewed
preliminary drafts of this.

Illustration made by [Hugo for Artify](https://www.artify.co/uncommon-illustrations).

