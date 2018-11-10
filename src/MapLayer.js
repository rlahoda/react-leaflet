// @flow

import type { Layer } from 'leaflet'
import React, { Fragment } from 'react'

import LeafletContext from './context'
import MapComponent from './MapComponent'
import type { LeafletContextValue, MapLayerProps } from './types'

export default class MapLayer<
  LeafletElement: Layer,
  Props: MapLayerProps,
> extends MapComponent<LeafletElement, Props> {
  static contextType = LeafletContext

  _leafletElement: LeafletElement
  contextValue: ?LeafletContextValue

  get layerContainer(): Layer {
    return this.context.layerContainer || this.context.map
  }

  get leafletElement(): LeafletElement {
    if (this._leafletElement == null) {
      this._leafletElement = this.createLeafletElement(this.props)
    }
    return this._leafletElement
  }

  createLeafletElement(_props: Props): LeafletElement {
    throw new Error('createLeafletElement() must be implemented')
  }

  updateLeafletElement(_fromProps: Props, _toProps: Props) {}

  componentDidMount() {
    super.componentDidMount()
    const el = this.leafletElement
    this.layerContainer.addLayer(el)
  }

  componentDidUpdate(prevProps: Props) {
    super.componentDidUpdate(prevProps)

    if (this.props.attribution !== prevProps.attribution) {
      const { map } = this.context
      if (map != null && map.attributionControl != null) {
        map.attributionControl.removeAttribution(prevProps.attribution)
        map.attributionControl.addAttribution(this.props.attribution)
      }
    }

    this.updateLeafletElement(prevProps, this.props)
  }

  componentWillUnmount() {
    super.componentWillUnmount()
    this.layerContainer.removeLayer(this.leafletElement)
  }

  render() {
    const { children } = this.props
    if (children == null) {
      return null
    }
    return this.leafletElement == null || this.contextValue == null ? (
      <Fragment>{children}</Fragment>
    ) : (
      <LeafletContext.Provider value={this.contextValue}>
        {children}
      </LeafletContext.Provider>
    )
  }
}
