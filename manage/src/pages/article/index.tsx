import React, { useCallback, useEffect, useMemo } from 'react'
import { connect, Dispatch, history } from 'umi'
import { Button, Table, Space, Tag } from 'antd'
import { ColumnsType } from 'antd/es/table'
import moment from 'moment'

import { ConnectState } from '@/models/connect'
import { ArticleList, ArticleType } from '@/models/article'
import FormattedMsg from '@/components/reactIntl/FormattedMsg'
import { TIME_FORMAT } from '@/utils/index'

import styles from './index.less'

interface ArticleProps {
  dispatch: Dispatch
  articleList: ArticleList
  draftList: ArticleList
  isLoading: boolean
}

const Article: React.FC<ArticleProps> = ({ dispatch, articleList, draftList, isLoading }) => {
  const isDraftPage = useMemo(() => location.pathname.includes('draft'), [location.pathname])

  const handleTop: (fid: string) => void = useCallback((fid) => {
    dispatch({ type: 'article/top', payload: fid })
  }, [])

  const cancelTop: (fid: string) => void = useCallback((fid) => {
    dispatch({ type: 'article/untop', payload: fid })
  }, [])

  const handleDelete: (data: ArticleType) => void = useCallback(({fid}) => {
    dispatch({ type: isDraftPage ? 'article/delDraft' : 'article/del', payload: fid })
  }, [isDraftPage])

  const handleEdit: (data: ArticleType) => void = useCallback(({fid}) => {
    history.push({
      pathname: '/release',
      query: isDraftPage ? {
        id: fid,
        draft: true,
      } : { id: fid },
    })
  }, [isDraftPage])

  const columns: ColumnsType<ArticleType> = useMemo(() => [
    {
      title: <FormattedMsg id="Title" />,
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: <FormattedMsg id="Author" />,
      dataIndex: 'author',
      key: 'author',
    },
    {
      title: <FormattedMsg id="Label" />,
      key: 'label',
      dataIndex: 'label',
      render: labels => (
        <>
          {labels.map((l: string, i: number) => {
            let color = i % 2 === 1 ? 'volcano' : '#51B266'
            return (
              <Tag color={color} key={l}>
                {l.toUpperCase()}
              </Tag>
            )
          })}
        </>
      ),
    },
    {
      title: <FormattedMsg id="Visible" />,
      dataIndex: 'visible',
      key: 'visible',
      render: visible => <FormattedMsg id={visible ? 'For all to see' : 'Only visible to oneself'} />
    },
    {
      title: <FormattedMsg id="Creation time" />,
      dataIndex: 'ct',
      key: 'Creation time',
      render: ct => moment(ct).format(TIME_FORMAT)
    },
    {
      title: <FormattedMsg id="Update time" />,
      dataIndex: 'ut',
      key: 'Update time',
      render: ut => ut ? moment(ut).format(TIME_FORMAT) : '-'
    },
    {
      title: <FormattedMsg id="Action" />,
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          {!isDraftPage && record.top && (
            <a onClick={cancelTop.bind(this, record.fid)}>
              <FormattedMsg id="Cancel top" />
            </a>
          )}
          {!isDraftPage && !record.top && (
            <a onClick={handleTop.bind(this, record.fid)}>
              <FormattedMsg id="Set top" />
            </a>
          )}
          <a onClick={handleEdit.bind(this, record)}>
            <FormattedMsg id="Edit" />
          </a>
          <a onClick={handleDelete.bind(this, record)}>
            <FormattedMsg id="Delete" />
          </a>
        </Space>
      ),
    },
  ], [])

  const go: (path: string) => void = useCallback((path) => history.push(path), [])

  useEffect(() => {
    !isDraftPage && dispatch({ type: 'article/getAll' })
    dispatch({ type: 'article/getAllDrafts' })
  }, [])

  return (
    <React.Fragment>
      <header className={isDraftPage ? styles.header : styles.btns}>
        {isDraftPage ? <FormattedMsg id="Drafts" /> : (
          <React.Fragment>
            <Button danger style={{ marginRight: 5 }} onClick={go.bind(this, '/draft')}>
              <FormattedMsg id="Drafts" />
              &nbsp;
              ({draftList.length})
            </Button>
            <Button type="primary" onClick={go.bind(this, '/release')}>
              <FormattedMsg id="Publish articles" />
            </Button>
          </React.Fragment>
        )}
      </header>
      <Table
        className={styles.table}
        size="small"
        loading={isLoading}
        columns={columns}
        dataSource={isDraftPage ? draftList : articleList}
        rowKey="fid"
        pagination={false}
      />
    </React.Fragment>
  )
}

export default connect(({ article }: ConnectState) => ({
  articleList: article.articleList,
  draftList: article.draftList,
  isLoading: article.isLoading,
}))(Article)