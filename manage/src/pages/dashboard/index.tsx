import React, { FC, useEffect, useMemo } from 'react'
import { Skeleton } from 'antd'
import { isEmpty } from 'lodash'
import { connect, Dispatch } from 'umi'
import { Line, Column } from '@ant-design/charts'

import { ConnectState } from '@/models/connect'
import { ChartsData } from '@/models/dashboard'
import { AnazlyType, ArticleList } from '@/models/article'

import styles from './index.less'
import FormattedMsg from '@/components/reactIntl/FormattedMsg'

interface DashboardProps {
  isLoading: boolean
  anazly: AnazlyType
  articleList: ArticleList
  chartsData: ChartsData
  dispatch: Dispatch
}

const Dashboard: FC<DashboardProps> = ({ isLoading, anazly, articleList, chartsData, dispatch }) => {
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
    dispatch({ type: 'article/anazly' })
    dispatch({ type: 'article/getAll' })
    dispatch({ type: 'dashboard/getChartsData' })
  }, [])

  return (
    <div className={styles.dashboardWrapper}>
      <div className={styles.statistics}>
        <Skeleton loading={isLoading}>
          <div className={styles.statistic}>
            <div className={styles.title}>
              <FormattedMsg id="Articles" />
            </div>
            <div className={styles.total}>
              {Array.isArray(articleList) ? articleList.length : 0}
            </div>
          </div>
        </Skeleton>
        <Skeleton loading={isLoading}>
          <div className={styles.statistic}>
            <div className={styles.title}>
              <FormattedMsg id="Total visits" />
            </div>
            <div className={styles.total}>{anazly.views || 0}</div>
          </div>
        </Skeleton>
        <Skeleton loading={isLoading}>
          <div className={styles.statistic}>
            <div className={styles.title}>
              <FormattedMsg id="Total comments" />
            </div>
            <div className={styles.total}>{anazly.comments || 0}</div>
          </div>
        </Skeleton>
        <Skeleton loading={isLoading}>
          <div className={styles.statistic}>
            <div className={styles.title}>
              <FormattedMsg id="Total lovers" />
            </div>
            <div className={styles.total}>{anazly.flovers || 0}</div>
          </div>
        </Skeleton>
        <Skeleton loading={isLoading}>
          <div className={styles.statistic}>
            <div className={styles.title}>
              <FormattedMsg id="Total AD clicks" />
            </div>
            <div className={styles.total}>
              <FormattedMsg id="Temporarily not opened" />
            </div>
          </div>
        </Skeleton>
      </div>
      <div className={styles.charts}>
        <Skeleton loading={isEmpty(articleVisits.data)}>
          <div className={styles.chart}>
            <Line {...articleVisits} />
          </div>
        </Skeleton>
        <Skeleton loading={isEmpty(articleLikes.data)}>
          <div className={styles.chart}>
            <Column {...articleLikes} />
          </div>
        </Skeleton>
        <Skeleton loading={isEmpty(articleVisits.data)}>
          <div className={styles.chart}>
            <Line {...articleVisits} />
          </div>
        </Skeleton>
        <Skeleton loading={isEmpty(articleLikes.data)}>
          <div className={styles.chart}>
            <Column {...articleLikes} />
          </div>
        </Skeleton>
      </div>
    </div>
  )
}

export default connect(({ dashboard, article }: ConnectState) => ({
  anazly: article.anazly,
  articleList: article.articleList,
  isLoading: article.isLoading,
  chartsData: dashboard.chartsData,
}))(Dashboard)