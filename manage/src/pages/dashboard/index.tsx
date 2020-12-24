import React, { useEffect, useMemo, useContext } from 'react'
import { Skeleton } from 'antd'
import { connect, Dispatch } from 'umi'
import { Line, Column } from '@ant-design/charts'
import moment from 'moment'

import { ConnectState } from '@/models/connect'
import { AnazlyType, ArticleList } from '@/models/article'
import { IntlContext } from '@/utils/context/intl'

import styles from './index.less'
import FormattedMsg from '@/components/reactIntl/FormattedMsg'

interface DashboardProps {
  isLoading: boolean
  isWeekLogLoading: boolean
  anazly: AnazlyType
  articleList: ArticleList
  dispatch: Dispatch
  weekLog: any
}

const Dashboard: React.FC<DashboardProps> = ({
  dispatch, isLoading, isWeekLogLoading,
  anazly, articleList, weekLog,
}) => {
  const formatMsg = useContext<any>(IntlContext)

  const YD = useMemo(() => moment().format('YYYY-MM '), [])

  const components = useMemo(() => {
    const chartsData: any = Object.values(weekLog)[0] || {}
    const charts: any[] = []

    Object.keys(chartsData).forEach((key: string) => {
      if (chartsData[key]) {
        const chartData: any = Object.values(chartsData[key])[0] || []

        const data: any[] = []
        for (let i = 1, l = chartData.length; i < l; i++) {
          data.push({day: String(i), value: chartData[i]})
        }

        const baseProps = {
          data,
          xField: 'day',
          yField: 'value',
          loading: isWeekLogLoading,
          meta: {
            day: {
              formatter: (day: string) => moment().format('YYYY-MM-') + day,
            },
            value: { alias: formatMsg(key) },
          },
        }
        
        const props = key === 'flovers' ? {
          ...baseProps,
          columnStyle: {
            cursor: 'pointer'
          }
        } : {
          ...baseProps,
          point: {
            size: 5,
            shape: 'diamond',
          },
        }
        
        charts.push(<div className={styles.chart} key={key}>
          <div className={styles.text}>
            {YD}
            {formatMsg(key)}
          </div>
          {key === 'flovers' ? <Column {...props} /> : <Line {...props} />}
        </div>)
      }
    })
    return charts
  }, [weekLog, YD, isWeekLogLoading, formatMsg])

  useEffect(() => {
    dispatch({ type: 'article/anazly' })
    dispatch({ type: 'article/getAll' })
    dispatch({ type: 'article/weeklog' })
  }, [])

  return (
    <React.Fragment>
      <div className={styles.statistics}>
        <Skeleton loading={isLoading}>
          <div className={styles.statistic}>
            <div className={styles.title}>
              <FormattedMsg id="Articles" />
            </div>
            {Array.isArray(articleList) ? articleList.length : 0}
          </div>
        </Skeleton>
        <Skeleton loading={isLoading}>
          <div className={styles.statistic}>
            <div className={styles.title}>
              <FormattedMsg id="Total visits" />
            </div>
            {anazly.views || 0}
          </div>
        </Skeleton>
        <Skeleton loading={isLoading}>
          <div className={styles.statistic}>
            <div className={styles.title}>
              <FormattedMsg id="Total comments" />
            </div>
            {anazly.comments || 0}
          </div>
        </Skeleton>
        <Skeleton loading={isLoading}>
          <div className={styles.statistic}>
            <div className={styles.title}>
              <FormattedMsg id="Total lovers" />
            </div>
            {anazly.flovers || 0}
          </div>
        </Skeleton>
        <Skeleton loading={isLoading}>
          <div className={styles.statistic}>
            <div className={styles.title}>
              <FormattedMsg id="Total AD clicks" />
            </div>
            <FormattedMsg id="Temporarily not opened" />
          </div>
        </Skeleton>
      </div>
      <div className={styles.charts}>
        {components}
      </div>
    </React.Fragment>
  )
}

export default connect(({ article }: ConnectState) => ({
  anazly: article.anazly,
  articleList: article.articleList,
  isLoading: article.isLoading,
  isWeekLogLoading: article.isWeekLogLoading,
  weekLog: article.weekLog,
}))(Dashboard)