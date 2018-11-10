// @flow

import { Control } from 'leaflet'
import { Component } from 'react'

import LeafletContext from './context'
import type { MapControlProps } from './types'

export default class MapControl<
  LeafletElement: Control,
  Props: MapControlProps,
> extends Component<Props> {
  static contextType = LeafletContext

  _leafletElement: LeafletElement

  get leafletElement(): LeafletElement {
    if (this._leafletElement == null) {
      this._leafletElement = this.createLeafletElement(this.props)
    }
    return this._leafletElement
  }

  createLeafletElement(_props: Props): LeafletElement {
    throw new Error('createLeafletElement() must be implemented')
  }

  updateLeafletElement(fromProps: Props, toProps: Props): void {
    if (toProps.position !== fromProps.position) {
      this.leafletElement.setPosition(toProps.position)
    }
  }

  componentDidMount() {
    this.leafletElement.addTo(this.context.map)
  }

  componentDidUpdate(prevProps: Props) {
    this.updateLeafletElement(prevProps, this.props)
  }

  componentWillUnmount() {
    this.leafletElement.remove()
  }

  render(): * {
    return null
  }
}
