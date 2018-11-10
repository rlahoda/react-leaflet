// @flow

import { Control, type Layer } from 'leaflet'
import React, {
  cloneElement,
  Component,
  Children,
  Fragment,
  type ChildrenArray,
  type Element,
} from 'react'

import LeafletContext from './context'
import MapControl from './MapControl'
import type {
  AddLayerHandler,
  RemoveLayerHandler,
  LeafletContextValue,
  MapControlProps,
} from './types'

type ControlledLayerProps = {
  addBaseLayer: AddLayerHandler,
  addOverlay: AddLayerHandler,
  checked?: boolean,
  children: Element<*>,
  name: string,
  removeLayer: RemoveLayerHandler,
  removeLayerControl: RemoveLayerHandler,
}

// Abtract class for layer container, extended by BaseLayer and Overlay
export class ControlledLayer extends Component<ControlledLayerProps> {
  static contextType = LeafletContext

  contextValue: LeafletContextValue
  layer: ?Layer

  componentDidUpdate({ checked }: ControlledLayerProps) {
    if (this.context.map == null) {
      return
    }
    // Handle dynamically (un)checking the layer => adding/removing from the map
    if (this.props.checked === true && (checked == null || checked === false)) {
      this.context.map.addLayer(this.layer)
    } else if (
      checked === true &&
      (this.props.checked == null || this.props.checked === false)
    ) {
      this.context.map.removeLayer(this.layer)
    }
  }

  componentWillUnmount() {
    this.props.removeLayerControl(this.layer)
  }

  addLayer() {
    throw new Error('Must be implemented in extending class')
  }

  removeLayer(layer: Layer) {
    this.props.removeLayer(layer)
  }

  render() {
    const { children } = this.props
    return children ? (
      <LeafletContext.Provider value={this.contextValue}>
        {children}
      </LeafletContext.Provider>
    ) : null
  }
}

class BaseLayer extends ControlledLayer {
  constructor(props: ControlledLayerProps) {
    super(props)
    // TODO: move this out of constructor
    this.contextValue = {
      ...this.context,
      layerContainer: {
        addLayer: this.addLayer.bind(this),
        removeLayer: this.removeLayer.bind(this),
      },
    }
  }

  addLayer = (layer: Layer) => {
    this.layer = layer // Keep layer reference to handle dynamic changes of props
    const { addBaseLayer, checked, name } = this.props
    addBaseLayer(layer, name, checked)
  }
}

class Overlay extends ControlledLayer {
  constructor(props: ControlledLayerProps) {
    super(props)
    this.contextValue = {
      ...this.context,
      layerContainer: {
        addLayer: this.addLayer.bind(this),
        removeLayer: this.removeLayer.bind(this),
      },
    }
  }

  addLayer = (layer: Layer) => {
    this.layer = layer // Keep layer reference to handle dynamic changes of props
    const { addOverlay, checked, name } = this.props
    addOverlay(layer, name, checked)
  }
}

type LeafletElement = Control.Layers
type LayersControlProps = {
  children: ChildrenArray<*>,
  collapsed?: boolean,
} & MapControlProps

export default class LayersControl extends MapControl<
  LeafletElement,
  LayersControlProps,
> {
  static BaseLayer = BaseLayer
  static Overlay = Overlay

  static contextType = LeafletContext

  controlProps: {
    addBaseLayer: AddLayerHandler,
    addOverlay: AddLayerHandler,
    removeLayer: RemoveLayerHandler,
    removeLayerControl: RemoveLayerHandler,
  }

  constructor(props: LayersControlProps) {
    super(props)
    this.controlProps = {
      addBaseLayer: this.addBaseLayer.bind(this),
      addOverlay: this.addOverlay.bind(this),
      removeLayer: this.removeLayer.bind(this),
      removeLayerControl: this.removeLayerControl.bind(this),
    }
  }

  createLeafletElement(props: LayersControlProps): LeafletElement {
    const { children: _children, ...options } = props
    return new Control.Layers(undefined, undefined, options)
  }

  updateLeafletElement(
    fromProps: LayersControlProps,
    toProps: LayersControlProps,
  ) {
    super.updateLeafletElement(fromProps, toProps)
    if (toProps.collapsed !== fromProps.collapsed) {
      if (toProps.collapsed === true) {
        this.leafletElement.collapse()
      } else {
        this.leafletElement.expand()
      }
    }
  }

  componentWillUnmount() {
    setTimeout(() => {
      super.componentWillUnmount()
    }, 0)
  }

  addBaseLayer(layer: Layer, name: string, checked: boolean = false) {
    if (checked && this.context.map != null) {
      this.context.map.addLayer(layer)
    }
    this.leafletElement.addBaseLayer(layer, name)
  }

  addOverlay(layer: Layer, name: string, checked: boolean = false) {
    if (checked && this.context.map != null) {
      this.context.map.addLayer(layer)
    }
    this.leafletElement.addOverlay(layer, name)
  }

  removeLayer(layer: Layer) {
    if (this.context.map != null) {
      this.context.map.removeLayer(layer)
    }
  }

  removeLayerControl(layer: Layer) {
    this.leafletElement.removeLayer(layer)
  }

  render() {
    const children = Children.map(this.props.children, child => {
      return child ? cloneElement(child, this.controlProps) : null
    })
    return <Fragment>{children}</Fragment>
  }
}
