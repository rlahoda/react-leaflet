// @flow

import hoistNonReactStatics from 'hoist-non-react-statics'
import React, {
  createContext,
  // $FlowFixMe: import
  forwardRef,
  type ComponentType,
} from 'react'

import type { LeafletContextValue } from './types'

const Context = createContext<LeafletContextValue>({})

export const LeafletConsumer = Context.Consumer
export const LeafletProvider = Context.Provider

export const withLeaflet = <Props: Object>(
  WrappedComponent: ComponentType<Props>,
): ComponentType<$Diff<Props, { leaflet: LeafletContext }>> => {
  const WithLeafletComponent = (props, ref) => (
    <LeafletConsumer>
      {(leaflet: LeafletContext) => (
        <WrappedComponent {...props} leaflet={leaflet} ref={ref} />
      )}
    </LeafletConsumer>
  )

  // flowlint-next-line sketchy-null-string:off
  const name = WrappedComponent.displayName || WrappedComponent.name
  WithLeafletComponent.displayName = `Leaflet(${name})`

  const LeafletComponent = forwardRef(WithLeafletComponent)
  hoistNonReactStatics(LeafletComponent, WrappedComponent)

  return LeafletComponent
}

export default Context
