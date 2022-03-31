import { State } from '@state-ui/core/lib/types'
import { createState } from '@state-ui/core'

const createTransformState = <F, T>(
  state: State<F>,
  transform: ((val: F) => T)
): State<T> => {
  const transformedState = createState(transform(state.value))
  state.on('change', (val) => transformedState.set(transform(val)))
  return transformedState
}
export default createTransformState
