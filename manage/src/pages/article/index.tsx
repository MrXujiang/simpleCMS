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
  const handleDelete: (data: ArticleType) => void = useCallback(record => {
    dispatch({ type: 'article/deleteArticle', payload: record })
  }, [])

  const handleEdit: (data: ArticleType) => void = useCallback(record => {
    history.push({
      pathname: '/article/release',
      query: {
        key: record.key,
      },
    })
  }, [])

  const columns: ColumnsType<ArticleType> = useMemo(() => [
    {
      title: '文章',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '作者',
      dataIndex: 'author',
      key: 'author',
    },
    {
      title: 'Tags',
      key: 'labels',
      dataIndex: 'labels',
      render: labels => (
        <>
          {labels.map((label: string) => {
            let color = label.length > 5 ? 'geekblue' : 'green';
            if (label === 'a10') {
              color = 'volcano';
            }
            return (
              <Tag color={color} key={label}>
                {label.toUpperCase()}
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
          <a onClick={handleEdit.bind(this, record)}>编辑</a>
          <a onClick={handleDelete.bind(this, record)}>删除</a>
        </Space>
      ),
    },
  ], [])

  const release: () => void = useCallback(() => history.push('/article/release'), [])

  useEffect(() => {
    dispatch({ type: 'article/getArticleList' })
  }, [])

  return (
    <>
      <div className={styles.btns}>
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
        scroll={{ y: 'calc(100vh - 240px)' }}
      />
    </>
  )
}

export default connect(({ article }: ConnectState) => ({
  articleList: article.articleList,
  isLoading: article.isLoading,
}))(Article)