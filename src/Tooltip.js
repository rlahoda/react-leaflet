// @flow

import { Tooltip as LeafletTooltip } from 'leaflet'

import LeafletContext from './context'
import DivOverlay from './DivOverlay'
import type { DivOverlayProps } from './types'

type LeafletElement = LeafletTooltip
type Props = DivOverlayProps

export default class Tooltip extends DivOverlay<LeafletElement, Props> {
  static contextType = LeafletContext

  static defaultProps = {
    pane: 'tooltipPane',
  }

  createLeafletElement(props: Props): LeafletElement {
    return new LeafletTooltip(
      this.getOptions(props),
      this.context.popupContainer,
    )
  }

  componentDidMount() {
    const { popupContainer } = this.context
    if (popupContainer == null) return

    popupContainer.on({
      tooltipopen: this.onTooltipOpen,
      tooltipclose: this.onTooltipClose,
    })
    popupContainer.bindTooltip(this.leafletElement)
  }

  componentWillUnmount() {
    const { popupContainer } = this.context
    if (popupContainer == null) return

    popupContainer.off({
      tooltipopen: this.onTooltipOpen,
      tooltipclose: this.onTooltipClose,
    })
    if (popupContainer._map != null) {
      popupContainer.unbindTooltip(this.leafletElement)
    }
  }

  onTooltipOpen = ({ tooltip }: { tooltip: LeafletElement }) => {
    if (tooltip === this.leafletElement) {
      this.onOpen()
    }
  }

  onTooltipClose = ({ tooltip }: { tooltip: LeafletElement }) => {
    if (tooltip === this.leafletElement) {
      this.onClose()
    }
  }
}
