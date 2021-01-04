import React, { useCallback, useEffect, useMemo } from 'react'
import { connect, Dispatch, history } from 'umi'
import { Button, Table, Space, Tag } from 'antd'
import { UnlockOutlined, LockOutlined } from '@ant-design/icons'
import { ColumnsType } from 'antd/es/table'
import moment from 'moment'

import { ConnectState } from '@/models/connect'
import { ArticleList, ArticleType } from '@/models/article'
import FormattedMsg from '@/components/reactIntl/FormattedMsg'
import { TIME_FORMAT } from '@/utils'

import styles from './index.less'

interface ArticleProps {
  dispatch: Dispatch
  articleList: ArticleList
  draftList: ArticleList
  isLoading: boolean
}

const Article: React.FC<ArticleProps> = ({ dispatch, articleList, draftList, isLoading }) => {
  const isSuper = useMemo(() => localStorage.getItem('role') === '1', [localStorage.getItem('role')])
  const isDraftPage = useMemo(() => location.pathname.includes('draft'), [location.pathname])

  const toggle: (fid: string, type: string) => void = useCallback((fid, type) => {
    dispatch({ type: `article/${type}`, payload: fid })
  }, [])

  const handleDelete: (data: ArticleType) => void = useCallback(({ fid }) => {
    dispatch({ type: isDraftPage ? 'article/delDraft' : 'article/del', payload: fid })
  }, [isDraftPage])

  const handleEdit: (data: ArticleType) => void = useCallback(({ fid, top }) => {
    history.push({
      pathname: '/release',
      state: {
        id: fid,
        draft: isDraftPage,
        top,
      },
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
      render: author => author || '-',
    },
    {
      title: <FormattedMsg id="Label" />,
      key: 'label',
      dataIndex: 'label',
      render: labels => (
        <>
          {labels.map((l: string, i: number) => {
            const color = i % 2 === 1 ? 'volcano' : '#51B266'
            return (
              <Tag color={color} key={l} className={styles.tag}>
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
      render: visible => <FormattedMsg id={visible ? 'For all to see' : 'Only visible to oneself'} />,
    },
    {
      title: <FormattedMsg id="Creation time" />,
      dataIndex: 'ct',
      key: 'Creation time',
      render: ct => moment(ct).format(TIME_FORMAT),
    },
    {
      title: <FormattedMsg id="Update time" />,
      dataIndex: 'ut',
      key: 'Update time',
      render: ut => ut ? moment(ut).format(TIME_FORMAT) : '-',
    },
    {
      title: <FormattedMsg id="Action" />,
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          {!isDraftPage && record.top && (
            <a onClick={toggle.bind(this, record.fid, 'untop')}>
              <FormattedMsg id="Cancel top" />
            </a>
          )}
          {!isDraftPage && !record.top && (
            <a onClick={toggle.bind(this, record.fid, 'top')}>
              <FormattedMsg id="Set top" />
            </a>
          )}
          {(isSuper || (!isSuper && !record.lock)) && (
            <React.Fragment>
              <a onClick={handleEdit.bind(this, record)}>
                <FormattedMsg id="Edit" />
              </a>
              <a onClick={handleDelete.bind(this, record)}>
                <FormattedMsg id="Delete" />
              </a>
            </React.Fragment>
          )}
          {isSuper && !record.lock && (
            <a onClick={toggle.bind(this, record.fid, 'lock')}>
              <LockOutlined />
            </a>
          )}
          {isSuper && record.lock && (
            <a onClick={toggle.bind(this, record.fid, 'unlock')}>
              <UnlockOutlined />
            </a>
          )}
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
      <div className={isDraftPage ? styles.text : styles.btns}>
        {isDraftPage
          ? <FormattedMsg id="Drafts" />
          : (
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
      </div>
      <Table
        className={styles.table}
        size="small"
        loading={isLoading}
        columns={columns}
        dataSource={isDraftPage ? draftList : articleList}
        rowKey="fid"
        pagination={false}
        scroll={{ y: 'calc(100vh - 48px - 92px - 32px - 20px - 39px)' }}
      />
    </React.Fragment>
  )
}

export default connect(({ article }: ConnectState) => ({
  articleList: article.articleList,
  draftList: article.draftList,
  isLoading: article.isLoading,
}))(Article)
