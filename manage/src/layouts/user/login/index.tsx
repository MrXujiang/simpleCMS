import React, { useCallback } from 'react'
import { Button } from 'antd'
import { history } from 'umi'

export default function Login(props: any) {
  const login = useCallback(() => history.push('/dashboard'), [])
  return (
    <div>
      <Button type="primary" onClick={login}>进入仪表盘</Button>
    </div>
  )
}