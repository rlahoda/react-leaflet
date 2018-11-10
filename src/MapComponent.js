// @flow

import LeafletContext from './context'
import MapEvented from './MapEvented'
import type { MapComponentProps } from './types'

export default class MapComponent<
  LeafletElement,
  Props: MapComponentProps,
> extends MapEvented<LeafletElement, Props> {
  static contextType = LeafletContext

  getOptions(props: Props): Props {
    if (props.pane != null) {
      return props
    }
    if (this.context.pane != null) {
      return { ...props, pane: this.context.pane }
    }
    return props
  }
}
