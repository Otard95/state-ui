import { Component, html } from "@state-ui/core";
import { RouteCompArgs } from "@state-ui/extra/lib/router/types";

const Overview: Component<RouteCompArgs> = ({ params }) => {
  return html`
    <div>
      <h2>@state-ui</h2>
      <p>
        A simple, state-driven UI library for building web applications.
        Where the goal is to keep its as small as possible whicle keeping
        a React.JS like feel.
      </p>
    </div>
  `.on('mount', () => {
    // scroll to element with id `params.section`
    const section = document.getElementById(params.section)
    setTimeout(() => section?.scrollIntoView(), 10)
  })
}

export default Overview
