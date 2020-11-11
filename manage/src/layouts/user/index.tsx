import React from 'react'
import { IRouteComponentProps } from 'umi'

import { title } from 'utils/constants'

export default function User({ children }: IRouteComponentProps) {
  return (
    <div>
      <div>{title}</div>
      {children}
    </div>
  )
}