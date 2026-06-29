import React from 'react'
import { ThemedLayout , ThemedTitle} from '@refinedev/antd'
import Header from './header'

const Layout = ({children}: React.PropsWithChildren) => {
  return (
    <ThemedLayout Header={Header} Title={(titleProps: any) => <ThemedTitle {...titleProps} text="Refine"/>}
    >
      {children}
    </ThemedLayout>
  )
}

export default Layout
