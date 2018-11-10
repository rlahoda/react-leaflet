// @flow

import { TileLayer } from 'leaflet'
import { isEqual, reduce } from 'lodash'

import LeafletContext from './context'
import GridLayer from './GridLayer'
import { EVENTS_RE } from './MapEvented'
import type { GridLayerProps } from './types'

type LeafletElement = TileLayer.WMS
type Props = { url: string } & GridLayerProps

export default class WMSTileLayer extends GridLayer<LeafletElement, Props> {
  static contextType = LeafletContext

  createLeafletElement(props: Props): LeafletElement {
    const { url, ...params } = props
    return new TileLayer.WMS(url, this.getOptions(params))
  }

  updateLeafletElement(fromProps: Props, toProps: Props) {
    super.updateLeafletElement(fromProps, toProps)

    const { url: prevUrl, opacity: _po, zIndex: _pz, ...prevParams } = fromProps
    const { url, opacity: _o, zIndex: _z, ...params } = toProps

    if (url !== prevUrl) {
      this.leafletElement.setUrl(url)
    }
    if (!isEqual(params, prevParams)) {
      this.leafletElement.setParams(params)
    }
  }

  getOptions(params: Object): Object {
    return reduce(
      super.getOptions(params),
      (options, value, key) => {
        if (!EVENTS_RE.test(key)) {
          options[key] = value
        }
        return options
      },
      {},
    )
  }
}
