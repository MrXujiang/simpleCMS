import React, { useCallback, useEffect, useMemo, FC } from 'react'
import { connect, Dispatch, history } from 'umi'
import { Button, Table, Space, Tag } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { isEmpty } from 'lodash'

import { ConnectState } from '@/models/connect'
import { ArticleList, ArticleType } from '@/models/article'
import FormattedMsg from '@/components/reactIntl/FormattedMsg'

import styles from './index.less'

interface ArticleProps {
  dispatch: Dispatch
  articleList: ArticleList
  isLoading: boolean
}

const Article: FC<ArticleProps> = ({ dispatch, articleList, isLoading }) => {
  const handleDelete: (data: ArticleType) => void = record => {
    dispatch({ type: 'article/del', payload: record })
  }

  const handleEdit: (data: ArticleType) => void = record => {
    history.push({
      pathname: '/article/release',
      query: {
        key: record.id,
      },
    })
  }

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
          {labels.map((l: string) => {
            let color = l.length > 3 ? 'volcano' : '#51B266'
            return (
              <Tag color={color} key={l}>
                {l.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
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

  const release: () => void = useCallback(() => history.push('/article/release'), [])

  useEffect(() => {
    dispatch({ type: 'article/getAll' })
  }, [])

  return (
    <>
      <div className={styles.btns}>
        <Button danger style={{ marginRight: 5 }}>
          <FormattedMsg id="Draft box" />
          &nbsp;
          (5)
        </Button>
        <Button type="primary" onClick={release}>
          <FormattedMsg id="Publish articles" />
        </Button>
      </div>
      <Table
        className={styles.table}
        size="small"
        loading={isEmpty(articleList) || isLoading}
        columns={columns}
        dataSource={articleList}
        scroll={{ y: 'calc(100vh - 260px)' }}
      />
    </>
  )
}

export default connect(({ article }: ConnectState) => ({
  articleList: article.articleList,
  isLoading: article.isLoading,
}))(Article)