import React from 'react'
import { Button } from 'antd'

import styles from './index.less'

export default function Article(props: any) {
  return (
    <div>
      <div className={styles.btns}>
        <Button type="primary">发布文章</Button>
      </div>
    </div>
  )
}