import { html } from '@ui.js/core'
import {Component} from '@ui.js/core/lib/types'
import {
  createStyle,
  createHashRouter,
  createTransformState
} from '@ui.js/extra'
import { RouteCompArgs, Routes } from '@ui.js/extra/lib/hashRouter'

window.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('app')

  const navStyle = createStyle`
    width: 100%;
    height: 50px;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    background-color: #eee;
  `
  const navLinkStyle = createStyle<boolean>`
    text-decoration: none;
    color: #000;
    font-size: 20px;
    font-weight: bold;
    flex-grow: 1;
    text-align: center;
    border-bottom: 2px solid ${active => active ? '#333' : 'transparent'};
    background-color: $eee;

    &:hover {
      background-color: #ddd;
    }
  `

  const contactCountries = {
    us: {
      phone: '+1 (123) 456-7890',
      email: 'us.help@foo.bar',
      address: '123 Main St, Anytown, CA 12345'
    },
    uk: {
      phone: '+44 (123) 456-7890',
      email: 'uk.help@foo.bar',
      address: '123 Main St, Anytown, UK 12345'
    },
  }

  const routes = {
    Home: {
      hash: '#/',
      path: '/',
      component: (() => html`<div>Home</div>`)  as Component<RouteCompArgs>
    },
    'About Us': {
      hash: '#/about/us',
      path: '/about/:what',
      component: (({params}) => html`<div>About ${params.what}</div>`) as Component<RouteCompArgs> 
    },
    Contact: {
      hash: '#/contact',
      path: '/contact',
      component: (({ query }) => {
        const country = query.country
        if (!(country in contactCountries)) {
          return html`<div>Sorry we don't operate in your country</div>`
        }
        return html`
          <div>
            <div>Phone: ${contactCountries[country].phone}</div>
            <div>Email: ${contactCountries[country].email}</div>
            <div>Address: ${contactCountries[country].address}</div>
          </div>
        `
      }) as Component<RouteCompArgs & { query: { country: keyof typeof contactCountries } }>
    }
  }

  const [routerElement, routerState] = createHashRouter(
    Object.values(routes).reduce((acc, route) => {
      acc[route.path] = route.component as Component<RouteCompArgs>
      return acc
    }, {} as Routes),
  )

  const navLinks = Object.entries(routes).map(([name, route]) => html`
    <a ${navLinkStyle(
      createTransformState(
        routerState,
        path => path === route.path
      )
    )} href="${route.hash}">${name}</a>
  `)

  const app = html`
    <div>
      <nav ${navStyle()}>
        ${navLinks}
      </nav>
      <main>
        ${routerElement}
      </main>
    </div>
  `
  root && root.appendChild(app)
})
