// @flow

import { Control } from 'leaflet'

import LeafletContext from './context'
import MapControl from './MapControl'
import type { MapControlProps } from './types'

type LeafletElement = Control.Zoom
type Props = {
  zoomInText?: string,
  zoomInTitle?: string,
  zoomOutText?: string,
  zoomOutTitle?: string,
} & MapControlProps

export default class ZoomControl extends MapControl<LeafletElement, Props> {
  static contextType = LeafletContext

  createLeafletElement(props: Props): LeafletElement {
    return new Control.Zoom(props)
  }
}
