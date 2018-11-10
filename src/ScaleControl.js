// @flow

import { Control } from 'leaflet'

import LeafletContext from './context'
import MapControl from './MapControl'
import type { MapControlProps } from './types'

type LeafletElement = Control.Scale
type Props = {
  imperial?: boolean,
  maxWidth?: number,
  metric?: boolean,
  updateWhenIdle?: boolean,
} & MapControlProps

export default class ScaleControl extends MapControl<LeafletElement, Props> {
  static contextType = LeafletContext

  createLeafletElement(props: Props): LeafletElement {
    return new Control.Scale(props)
  }
}
