import { Component } from "@state-ui/core/lib/types"
import { createHashRouter } from "@state-ui/extra"
import GettingStarted from "./pages/getting-started"
import Overview from "./pages/overview"

const router: Component = () => {
  const [comp] = createHashRouter({
    '/:?section': Overview,
    '/getting-started/:?section': GettingStarted,
  })
  return comp
}

export default router
