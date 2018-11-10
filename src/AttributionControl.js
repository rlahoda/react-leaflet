// @flow

import { Control } from 'leaflet'

import LeafletContext from './context'
import MapControl from './MapControl'
import type { MapControlProps } from './types'

type LeafletElement = Control.Attribution
type Props = {
  prefix?: string,
} & MapControlProps

export default class AttributionControl extends MapControl<
  LeafletElement,
  Props,
> {
  static contextType = LeafletContext

  createLeafletElement(props: Props): LeafletElement {
    return new Control.Attribution(props)
  }
}
