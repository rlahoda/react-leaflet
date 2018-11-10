// @flow

import { GeoJSON as LeafletGeoJSON, type LatLng, type Layer } from 'leaflet'

import LeafletContext from './context'
import Path from './Path'
import type { PathProps } from './types'

type LeafletElement = LeafletGeoJSON

type GeoJSONdata = Object | Array<any>

type Props = {
  data: GeoJSONdata,
  pointToLayer?: (point: GeoJSONdata, latlng: LatLng) => Layer,
  style?: (feature: GeoJSONdata) => Object,
  onEachFeature?: (feature: GeoJSONdata, layer: Layer) => void,
  filter?: (feature: GeoJSONdata) => boolean,
  coordsToLatLng?: (coords: GeoJSONdata) => LatLng,
} & PathProps

export default class GeoJSON extends Path<LeafletElement, Props> {
  static contextType = LeafletContext

  createLeafletElement(props: Props): LeafletElement {
    const el = new LeafletGeoJSON(props.data, this.getOptions(props))
    this.contextValue = { ...this.context, popupContainer: el }
    return el
  }

  updateLeafletElement(fromProps: Props, toProps: Props) {
    if (typeof toProps.style === 'function') {
      this.setStyle(toProps.style)
    } else {
      this.setStyleIfChanged(fromProps, toProps)
    }
  }
}
