---
title: "We’re using Redux selectors too much"

draft: false

page : false

---
*This post was [originally published on Medium](https://medium.com/iadvize-engineering/were-using-redux-selectors-too-much-2d5d24ac92d5).*


In the big React/Redux application I work on, when I open a
`{domain}/selectors.js` file I often have to face a long list of Redux selectors
like this:

```
getUsers(state)
getUser(id)(state)
getUserId(id)(state)
getUserFirstName(id)(state)
getUserLastName(id)(state)
getUserEmailSelector(id)(state)
getUserFullName(id)(state)
...
```

At first glance the use of selectors seems harmless, but our current experience
has us reaching a different conclusion: there is such a thing as too many
selectors, and we have reached this point.

<figure>
  <img alt="Selectors, selectors eveerywhere" src="/assets/img/redux-selectors-meme.jpg" />
</figure>

# Redux and selectors

Let’s start with Redux. What is it actually for? A quick look at
[redux.js.org](https://redux.js.org/) will remind us that this is a “a
predictable state container for JavaScript apps”.

Using Redux, we’re encouraged to write selectors even if they are not mandatory.
They are just getters for some parts of the state, ie. functions with this
signature: `State -> SubState`. We usually write selectors instead of accessing
the state directly in order to compose them or memoize their results. A sensible
endeavour.

# Going too far with selectors

The list of selectors I copied in the introduction bears the telltale signs of
code produced in a rush. We probably added a field (`email`) to an entity we
already had (`User`). We have a component that previously waited for `firstName`
and `lastName` and now waits for email too. Following the logic previously set
in place, somebody added the selector `getUserEmailSelector`, then used it in
our component and boom, done!

Or is it really? We now have one more selector to write and it’s not that
simple. We will compose it with other selectors, probably ending with something
like:

```js
const getUsers = (state) => state.users;
const getUser = (id) => (state) => getUsers(state)[id];
const getUserEmailSelector = (id) => (state) 
  => getUser(id)(state).email;
```
The first issue arises: what should `getUserEmailSelector` return when `getUser`
returns `undefined` which can and will happen (bugs, transitory states, legacy
code, etc.)? It’s not the role of selectors to handle errors or provide default
values.

The second issue has to do with testing this selector. If we want this unit test
to mean something, we have to use mock data matching production data. We
therefore have to mock the whole state (because production data is not meant to
be incomplete) just for this selector, and depending on the architecture of your
app it’s sometimes not very practical.

Let’s assume we have written and tested the `getUserEmailSelector` selector as
stated. Let’s use it when we connect our component to the store:

```js
const mapStateToProps = (state, ownProps) => ({
  firstName: getUserFirstName(ownProps.userId)(state),
  lastName: getUserLastName(ownProps.userId)(state),
  
  // the new data
  email: getUserEmailName(ownProps.userId)(state),
})
```

That’s the process that led to this collection of selectors.

**We went too far. We ended up writing a pseudo API for the User entity. A User
API that is not usable outside of a Redux context and that isn’t really a User
API because it requires the full state. Moreover, this API is not usable at
scale. As we add fields to the User entity, we will have to add more and more
selectors to the `mapStateToProps`, writing a lot of boilerplate code.**

# Should we access the entity property directly?

If the problem is having too many selectors, maybe we could use getUser and then
access the property we need directly ?

```js
const user = getUser(id)(state);
const email = user.email;
```
Doing so does solve the problem of having too many selectors to write and
maintain, however stopping there creates another maintenance issue. Whenever we
will need to completely change the shape of this User entity, we will also need
to track down every instance of user.email. Depending on the size of the
codebase, this can really prevent us from doing even a simple refactoring. The
previous selector had the merit of making this theoretical change easier because
fixing said selector upstream would have taken care of all its instances
downstream.

And while this solution could be used for direct properties, what about computed
ones like the user’s full name that should be the concatenation of `firstName`
and `lastName`? We need to go deeper.

<figure>
  <img alt="We need to go deeper" src="/assets/img/redux-selectors-meme-deeper.png" />
</figure>

# Domain first, Redux second

A cleaner approach to this feature could be summed up in two steps:

1. How do we define our **domain**?
2. How do we **store** the data? (State management stuff, here using Redux)

In the Domain step (here the User domain), we take a break from Redux altogether
and consider what a user is, and what the API to interact with it needs to be.

```ts
// api.ts
type User = {
  id: string,
  firstName: string,
  lastName: string,
  email: string,
  ...
}

const getFirstName = (user: User) => user.firstName:
const getLastName = (user: User) => user.lastName:
const getFullName = (user: User) 
  => `${user.firstName} ${user.lastName}`;
const getEmail = (user: User) => user.email:

...

const createUser = (id: string, firstName: string, ...) => User
```

What has been proven to work well for us is to always use the API and even to
consider the User type
*[opaque](https://en.wikipedia.org/wiki/Opaque_data_type)* outside of the
`api.ts` file, meaning we never access a user property directly, as if we
couldn’t know what properties there are on the User entity.

Back to Redux and our State step, we are now free to tackle only state-related
questions:

- What should be the shape of my state?
- Should users be stored in a list? In a key-value map? etc.
- How do I retrieve a user? Should it be memoized? (the `getUser` selector)

# A small API for a wealth of benefits

By applying the separation of concerns principle between the domain and
the state, we gain on multiple aspects.

We now have clearly documented our domain (here, the User model and its API) in
our `api.ts` file. It can be tested independently. We can even extract this API
and model duet in a library to share it across applications if needed.

We can easily compose functions as we would selectors, a marked benefit over
accessing properties directly. Additionally, our interface to our data is now
easier to maintain in the long run: we can easily change the way User is shaped
without changing every instance downstream.

There is no witchcraft here and the API should look familiar: it shares some
similarities with what was done through selectors, however it has a key
difference: it doesn’t require the whole state as a dependency, thus it doesn’t
require the full state to be tested, and it’s detached from its Redux context
and the boilerplate that comes with it.

This directly leads to cleaner components props. Instead of waiting for
`firstName`, `lastName` and `email`, our component could now simply wait for a
User and use its API to extract the data it needs. We only need one selector
(`getUser`).

Reducers and middlewares can also benefit from this and use the API. The pattern
is to retrieve the User first and deal with missing values, errors and assorted
missteps then use its API instead of retrieving a lot of small parts of the
state without a clean domain vision. Redux acts thus as a true “predictable
state container” without becoming an all-encompassing part of how we interact
with this container.

# Conclusion

The road to hell is paved with good intentions (and here, selectors): we do not
want to access a stored entity property directly, so we write a specific
selector for that.

While the primary motivation for doing so is good, selector proliferation has
its own set of maintainability drawbacks.

The solution proposed is to always proceed in two steps. First, define the
domain and write its API. Then, do the Redux part (state shape and entity
selector). This way we write fewer but better code: it takes just one selector
to build a more composable and maintainable API.

---

A big thanks ❤️ to all my iAdvize colleagues that helped me write this:
Fhenon De Urioste, Axel Cateland, Nicolas Baptiste and Benoit Rajalu!
