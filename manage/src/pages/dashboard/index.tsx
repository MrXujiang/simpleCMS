import React, { FC, useEffect, useMemo } from 'react'
import { Skeleton } from 'antd'
import { isEmpty } from 'lodash'
import { connect, Dispatch } from 'umi'
import { Line, Column } from '@ant-design/charts'

import { ConnectState } from '@/models/connect'
import { ChartsData } from '@/models/dashboard'

import styles from './index.less'

interface DashboardProps {
  statistics: any[]
  chartsData: ChartsData
  dispatch: Dispatch
}

const Dashboard: FC<DashboardProps> = ({ statistics, chartsData, dispatch }) => {
  const articleVisits = useMemo(() => ({
    data: chartsData.articleVisits,
    xField: 'year',
    yField: 'value',
    label: {},
    point: {
      size: 5,
      shape: 'diamond',
      style: {
        fill: 'white',
        stroke: '#2593fc',
        lineWidth: 2,
      },
    },
  }), [chartsData])

  const articleLikes = useMemo(() => ({
    data: chartsData.articleLikes,
    xField: 'type',
    yField: 'sales',
    columnWidthRatio: 0.8,
    meta: {
      type: { alias: '类别' },
      sales: { alias: '销售额' },
    },
  }), [chartsData])

  useEffect(() => {
    dispatch({ type: 'dashboard/getStatistics' })
    dispatch({ type: 'dashboard/getChartsData' })
  }, [])

  return (
    <div className={styles.dashboardWrapper}>
      <div className={styles.statistics}>
        {isEmpty(statistics)
          ? <Skeleton active />
          : statistics.map((statistic: any) => (
            <div className={styles.statistic} key={statistic.title}>
              <div className={styles.title}>{statistic.title}</div>
              <div className={styles.total}>{statistic.total}</div>
            </div>
          ))}
      </div>
      <div className={styles.charts}>
        <div className={styles.chart}>
          {isEmpty(articleVisits.data)
            ? <Skeleton active className={styles.antdc} />
            : <Line className={styles.antdc} {...articleVisits} />}
        </div>
        <div className={styles.chart}>
          {isEmpty(articleLikes.data)
            ? <Skeleton active className={styles.antdc} />
            : <Column className={styles.antdc} {...articleLikes} />}
        </div>
        <div className={styles.chart}>
          {isEmpty(articleVisits.data)
            ? <Skeleton active className={styles.antdc} />
            : <Line className={styles.antdc} {...articleVisits} />}
        </div>
        <div className={styles.chart}>
          {isEmpty(articleLikes.data)
            ? <Skeleton active className={styles.antdc} />
            : <Column className={styles.antdc} {...articleLikes} />}
        </div>
      </div>
    </div>
  )
}

export default connect(({ dashboard }: ConnectState) => ({
  statistics: dashboard.statistics,
  chartsData: dashboard.chartsData,
}))(Dashboard)