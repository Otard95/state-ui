export default (scope: string, message: string, context?: unknown) =>
  console.debug(`[@state-ui](${scope}) ${message}`, context)