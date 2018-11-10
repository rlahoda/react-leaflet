// @flow

import { Circle as LeafletCircle } from 'leaflet'

import LeafletContext from './context'
import Path from './Path'
import type { LatLng, MapLayerProps, PathOptions } from './types'

type LeafletElement = LeafletCircle
type Props = {
  center: LatLng,
  radius: number,
} & MapLayerProps &
  PathOptions &
  Object

export default class Circle extends Path<LeafletElement, Props> {
  static contextType = LeafletContext

  createLeafletElement(props: Props): LeafletElement {
    const { center, radius, ...options } = props
    const el = new LeafletCircle(center, radius, this.getOptions(options))
    this.contextValue = { ...this.context, popupContainer: el }
    return el
  }

  updateLeafletElement(fromProps: Props, toProps: Props) {
    if (toProps.center !== fromProps.center) {
      this.leafletElement.setLatLng(toProps.center)
    }
    if (toProps.radius !== fromProps.radius) {
      this.leafletElement.setRadius(toProps.radius)
    }
  }
}
