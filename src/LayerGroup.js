// @flow

import { LayerGroup as LeafletLayerGroup } from 'leaflet'

import LeafletContext from './context'
import MapLayer from './MapLayer'
import type { MapLayerProps } from './types'

export default class LayerGroup<
  LeafletElement: LeafletLayerGroup,
  Props: MapLayerProps,
> extends MapLayer<LeafletElement, Props> {
  static contextType = LeafletContext

  createLeafletElement(props: Props): LeafletElement {
    const el = new LeafletLayerGroup(this.getOptions(props))
    this.contextValue = { ...this.context, layerContainer: el }
    return el
  }
}
