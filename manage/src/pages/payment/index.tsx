import React from 'react'
import FormattedMsg from '@/components/reactIntl/FormattedMsg'
import styles from './index.less'

export default function Payment() {
  return (
    <div className={styles.paymentWrapper}>
      <FormattedMsg id="This feature is not yet available" />
    </div>
  )
}