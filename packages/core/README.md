# State-UI Core

A simple lightweight set of tools to work with DOM elements,
create styles, and states to make it all dynamic.

## Current state

This package and its companion `@state-ui/extra` are still in active development
and you should expect breaking changes to the API.

## **Security**

These tools where made to be simple, as such there is no inbuilt
sanitation. Anything given to the `html` template tag **will** be
interpreted as html **as is**, including script tags and their content.

## Motivation

When you're working on a small, maybe even medium project,
it may be overkill to pull in something like React or Vue.
Why add 2.99MB to a simple project that only utilizes 5%
of Reacts features.

Of course there are others who made stuff like this before,
for example [Grecha.js](https://github.com/tsoding/grecha.js).
But I'd prefer to sacrifice just a little bit of that performance
for convenience.

## Documentation

> Coming soon

## Plugins/Addons

At this time there is only one,
[`@state-ui/extra`](https://www.npmjs.com/package/@state-ui/extra).  
But if that starts to get big, it'll be split into smaller packages.
