// @flow

import { Rectangle as LeafletRectangle } from 'leaflet'

import LeafletContext from './context'
import Path from './Path'
import type { LatLngBounds, PathProps } from './types'

type LeafletElement = LeafletRectangle
type Props = { bounds: LatLngBounds } & PathProps

export default class Rectangle extends Path<LeafletElement, Props> {
  static contextType = LeafletContext

  createLeafletElement(props: Props): LeafletElement {
    const el = new LeafletRectangle(props.bounds, this.getOptions(props))
    this.contextValue = { ...this.context, popupContainer: el }
    return el
  }

  updateLeafletElement(fromProps: Props, toProps: Props) {
    if (toProps.bounds !== fromProps.bounds) {
      this.leafletElement.setBounds(toProps.bounds)
    }
    this.setStyleIfChanged(fromProps, toProps)
  }
}
