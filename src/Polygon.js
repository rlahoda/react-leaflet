// @flow

import { Polygon as LeafletPolygon } from 'leaflet'

import LeafletContext from './context'
import Path from './Path'
import type { LatLng, PathProps } from './types'

type LeafletElement = LeafletPolygon
type Props = {
  positions: LatLng[] | LatLng[][] | LatLng[][][],
} & PathProps

export default class Polygon extends Path<LeafletElement, Props> {
  static contextType = LeafletContext

  createLeafletElement(props: Props): LeafletElement {
    const el = new LeafletPolygon(props.positions, this.getOptions(props))
    this.contextValue = { ...this.context, popupContainer: el }
    return el
  }

  updateLeafletElement(fromProps: Props, toProps: Props) {
    if (toProps.positions !== fromProps.positions) {
      this.leafletElement.setLatLngs(toProps.positions)
    }
    this.setStyleIfChanged(fromProps, toProps)
  }
}
