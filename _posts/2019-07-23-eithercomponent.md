---
title: How to deal with failure in Redux connect ?

draft: false

page : false

---
*This post was [originally published on Medium](https://medium.com/iadvize-engineering/how-to-deal-with-failure-in-redux-connect-ec17eec6b6e2).*

*Redux’s `connect` is ubiquitous in the classic Redux/React application but its most frequent usage has one crucial flaw: it doesn’t account for errors.
If `connect` can’t do that, how can we make sure we’re not letting our view pick up the slack for the holes in our store ?*

Imagine a (React-)Redux app where you’re listing entities, in this case let’s say it’s Projects. You typically would have a component somewhere called `ProjectList` that renders another one called `ProjectDetails`.

<figure>
  <img style="max-width: 480px;" alt="Projects app mockup with a list of ProjectDetails" src="/assets/img/redux-connect-projects-app.png" />
  <figcaption>
    Our Projects app with a list of ProjectDetails
  </figcaption>
</figure>

But because your app is big and `ProjectDetails` uses other entities (`Authors`,
`Clients`, etc.), you decide to connect `ProjectDetails` with your store directly.

This way, `ProjectList`’s only job is to pass a projectId prop to `ProjectDetails`.
You then use the `mapStateToProps` of `ProjectDetails` to get everything it needs to render.

The simple `ProjectList` component that pass nothing but projectId to `ProjectDetails`:

```jsx
const ProjectList = ({ projectIds }) => (
   <ul>
     {projectIds.map(
        projectId => <ProjectDetails projectId={projectId} />
     )}
   </ul>
);

export default ProjectList;
```

The connected `ProjectDetails` with its `mapStateToProps`:

```jsx
import { connect } from 'react-redux';
import { getProjectFromId, getClientFromId } from './selectors';

const ProjectDetails = ({ project, client }) => ( … );

const mapStateToProps = (state, ownProps) => {
  const {
    projectId, // passed by ProjectList
  } = ownProps;

  const project = getProjectFromId(projectId)(state);
  const clientId = project.clientId;
  const client = getClientFromId(clientId)(state);

  return {
    project,
    client,
  };
};

const ConnectedProjectDetails = connect(
  mapStateToProps,
  {},
)(ProjectDetails);

export default ProjectDetails;
```

# What could go wrong during a Redux connect?

Before we go any further, let’s pause a minute to look at the anatomy of a Redux `connect`.

This is its signature:

```js
(mapStateToProps, mapDispatchToProps, mergeProps) 
   => Component => ConnectedComponent
```

## mapStateToProps

```
(state, ownProps) => stateProps
```

It received the state and the props passed by the component’s parent.
You use it to access some parts of the state directly (bad) or via selectors
([better](https://redux.js.org/introduction/learning-resources#selectors)) and
then return an object that we can call stateProps. It’s the data coming from the
state we want to pass to the component as props.

## mapDispatchToProps

```
actionProps | (dispatch, ownProps) => actionProps
```

It’s either an object of action creators or a function that returns an object of action creators.

## mergeProps

```
(stateProps, dispatchProps, ownProps) => finalProps
```

We don’t see this one a lot. Its role is to merge `ownProps`, `stateProps` and
`dispatchProps`. If we don’t specify it, `connect` fallbacks to a function that
returns `{ …ownProps, …stateProps, …dispatchProps }` because most of the time
this is what we want.

The danger here comes from `mapStateToProps`.

What happens when you’re getting an entity from the store but it’s not there?
In the “perfect app” this should not happen, but sometimes you have to deal with
it.

Going back to our example, you could have the `Project` entity from the store,
but not the `Client` entity (race condition, bug, etc.) so the `ProjectDetails`
component would not work.

```js
const mapStateToProps = (state, ownProps) => {
  // …
  const client = getClientFromId(clientId)(state);

  return {
    project,
    // Murphy's law. What can we do if client is undefined?
    client, // undefined
  };
};
```

Your view component is already developed. If you pass an `undefined` or empty
project or client prop to your component it crashes.

<figure>
  <img alt="One does not simply connect(mapStateToProps, mapDispatchToProps)" src="/assets/img/redux-connect-meme.jpg" />
</figure>

# Trying to make the component accept weak or empty props

We have now established that sometimes, we can have undefined or empty project
props. We therefore need to update our component to handle this, right?

Let’s switch some props to optional with default values:

```js
const ProjectDetails = ({ project = {}, client = {} }) => ( … );
```

Hooray! No runtime error anymore!

Really? What about the default values we provided though? If the component needs
to access a deep `client.documents.pdfs` property, do we have to build a fake
`Client` entity ?

Moreover, by using default values we would find ourselves displaying a component
with incomplete information to the user.

<figure>
  <img style="max-width: 480px;" alt="ProjectDetails mockup" src="/assets/img/redux-connect-projectdetails.png" />
  <figcaption>
    We render the ProjectDetails component, but with “holes”
  </figcaption>
</figure>

Or a component with an error message. That’s if we take the time to test our
props in `ProjectDetails`.

```jsx
const ProjectDetails = ({ project = null, client = null }) => {
  if (!project || !client) {
    return <p>Oops sorry it's broken</p>;
  }
 
  //…
};
```

This is not great. It’s not the role of the component to handle a missing entity
in the store. A better approach would be not to render our `ProjectDetails`
when there’s no data for this project, but a better-suited component instead.

# Intermediary component that accepts either the props or a fallback state

What we want is a smart `connect` that can say “ok I have no data for my
component, let’s not render it or render a fallback”. But `connect`’s API from
`react-redux` doesn’t allow this.

We can achieve this logic with an intermediary component. It can accept 2 props:

- `componentProps`. Component’s props I want to render most of the time.
- `fallbackProps`. The props of a fallback component

If `componentProps` is there, render the component, if not, render the fallback.

```jsx
// let’s make a factory of intermediary components to reuse it 
const intermediaryComponentFactory = (Fallback, Component)
  => ({ fallbackProps, componentProps }) => {
    // if no componentProps provided
    // assume we should render the fallback state
    if (!componentProps) {
      return <Fallback { ...fallbackProps } />;
    }
   
    // nominal state, render the Component
    return <Component { ...componentProps } />;
  };
```

Now that we have this intermediary component, we can use `mergeProps` to return
either `componentProps` or `fallbackProps`.

```js
const mapStateToProps = (state, ownProps) => {
  // …
  return {
    project,
    client,
  };
};

const mergeProps = (ownProps, stateProps, dispatchProps) => {
  const {
    project,
    client,
  } = stateProps;
  if (!project || !client) {
    // first, log the error somewhere
    const error = new Error('No project or client');

    Sentry.captureException(error);

    return {
      fallbackProps: {
        message: 'Oops something went wrong retrieving details',
       },
    };
  }
  // nominal state
  return {
    componentProps: {
      ...ownProps,
      ...dispatchProps,
      project,
      client,
    }
  };
}
const IntermediaryComponent = intermediaryComponentFactory(
  ErrorComponent,
  ProjectDetails,
);
const ConnectedComponent = connect(
  mapStateToProps,
  {},
  mergeProps,
)(IntermediaryComponent);
```

Cool ! When the entity from the store is not here we now render a real error component.

<figure>
  <img style="max-width: 480px;" alt="ErrorComponent mockup" src="/assets/img/redux-connect-errorcomponent.png" />
  <figcaption>
    Our beautiful ErrorComponent
  </figcaption>
</figure>

Going further we could use the same logic to display two versions of the same
component. Let’s say somewhere in your app you have a UserProfile component that
is rewritten from scratch but you want to test the new version with your beta
users only. You now have two components: `UserProfileBeta` and the old
`UserProfile`.

```js
const mapStateToProps = (state, ownProps) => {
  const isBetaUser = isBetaUser(state);
  // …
  return {
    isBetaUser,
  };
};

const mergeProps = (ownProps, stateProps, dispatchProps) => {
  const {
    isBetaUser,
  } = stateProps;

  if (isBetaUser) {
    return {
      fallbackProps: betaUserProfileProps,
    };
  }

  // nominal state
  return {
    componentProps: userProfileProps,
  };
};

const IntermediaryComponent = intermediaryComponentFactory(
  UserProfileBeta,
  UserProfile,
);

const ConnectedComponent = connect(
  // …
)(IntermediaryComponent);
```

# Going FP

The API of our intermediary component is not ideal. It doesn’t prevent us to
pass two impossible states :

- both `componentProps` and `fallbackProps`
- none of them

Actually what we want to have is *either* `componentProps` or `fallbackProps`.
Let’s use the `Either` data structure from functional programming to rewrite our 
ntermediary component with Typescript and the
[`fp-ts` library](https://github.com/gcanti/fp-ts).

```tsx
import React, {
  ReactType,
  ComponentProps,
} from 'react';

import {
  Either,
  fold,
} from 'fp-ts/lib/Either';

export type EitherComponentProps<
  F extends ReactType,
  C extends ReactType
> = {
  eitherProps: Either<ComponentProps<F>, ComponentProps<C>>;
};

const eitherComponentFactory<
  F extends ReactType,
  C extends ReactType
> = (Fallback: F, Component: C) 
  => ({
  // our intermediary component now waits for one unique prop
  // called eitherProps
  // it’s an Either<FallbackProps, ComponentsProps>
  // that is to say either a left(fallbackProps)
  // or a right(componentProps)
 eitherProps,
}: EitherComponentProps<F, C>): JSX.Element => fold(
  // if eitherProps is a Left
  (fallbackProps: ComponentProps<F>) => (
    <Fallback { ...fallbackProps } />
  ),
  // if eitherProps is a Right
  (componentProps: ComponentProps<C>) => (
    <Component { ...componentProps } />
  ),
);
```

We can now rewrite our `mergeProps` to return a `left({ message })` or a
`right(componentProps)`.

```tsx
import { left, right } from 'fp-ts/lib/Either';

const mergeProps = (ownProps, stateProps, dispatchProps) => {
  // …
  if (!project || !client) {
    return {
      eitherProps: left({
        message: 'Oops something went wrong retrieving details',
      }),
    };
  }

  // nominal state
  return {
    eitherProps: right({
      ...ownProps,
      ...dispatchProps,
      project,
      client,
    }),
  };
}

const EitherComponent = eitherComponentFactory(
  ErrorScreen,
  ProjectDetails,
);

const ConnectedComponent = connect(
  // …
)(EitherComponent);
```

# Conclusion

We took a moment to look at a common problem of big Redux apps : how to deal
with empty or missing entities during a `connect`.

Updating our view components to handle those cases is not ideal because it
doesn’t respect the separation of concern principle enough. It’s not the role of
our views to handle errors trickling down from our Redux store. But the
`react-redux` `connect` API doesn’t give us a way to fallback easily.

The solution proposed here is to use an intermediary component, called
`EitherComponent`, to handle fallback when needed. This way we can prevent a
runtime crash, track the error and display a proper fallback view to our user.
We can also use this logic to display two versions of a component based on a
data from the store (`V2` for beta users, `V1` for everyone else).

---
A big thanks ❤️ to all my iAdvize colleagues that helped me write tthis:
Anthony Griffon, Fhenon De Urioste, Axel Cateland, Pierre-Alexandre Gury and
Benoit Rajalu!
