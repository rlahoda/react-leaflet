// @flow

import { FeatureGroup as LeafletFeatureGroup } from 'leaflet'

import LeafletContext from './context'
import Path from './Path'
import type { PathProps } from './types'

type LeafletElement = LeafletFeatureGroup
type Props = PathProps

export default class FeatureGroup extends Path<LeafletElement, Props> {
  static contextType = LeafletContext

  createLeafletElement(props: Props): LeafletElement {
    const el = new LeafletFeatureGroup(this.getOptions(props))
    this.contextValue = {
      ...this.context,
      layerContainer: el,
      popupContainer: el,
    }
    return el
  }

  componentDidMount() {
    super.componentDidMount()
    this.setStyle(this.props)
  }
}
