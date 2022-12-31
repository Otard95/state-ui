import { Component, html } from "@state-ui/core";
import { HTMLElement } from "@state-ui/core/lib/types";

type PageWrapperProps = {
  content: HTMLElement
  toc: HTMLElement
}
const PageWrapper: Component<PageWrapperProps> = ({ content, toc }) => html`
<div>
  ${content}
  ${toc}
</div>
`

export default PageWrapper
