import React, { useState, useEffect } from 'react'
import { history } from 'umi'

import FormattedMsg from '@/components/reactIntl/FormattedMsg'
import notFound from '@/assets/404.svg'

import styles from './index.less'

const NotFound = () => {
  const [time, setTime] = useState<number>(5)

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(prevTime => {
        if (prevTime === 1) {
          history.replace('/dashboard')
        }
        return prevTime - 1
      })
    }, 1000)
    return () => {
      if (timer) {
        clearInterval(timer)
      }
    }
  }, [])

  return (
    <div className={styles.notFound}>
      <img className={styles.image} src={notFound} alt="404" />
      <div className={styles.text}>
        <div className={styles.title}>
          <FormattedMsg id="Not Found" />
        </div>
        <p className={styles.desc}>
          <FormattedMsg
            id="NOT_FOUND_DESC"
            values={{
              time: time,
            }}
          />
        </p>
      </div>
    </div>
  )
}

export default NotFound