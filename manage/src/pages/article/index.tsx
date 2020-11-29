import React, { useCallback, useEffect, useMemo, FC } from 'react'
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
  isLoading: boolean
}

const Article: FC<ArticleProps> = ({ dispatch, articleList, isLoading }) => {
  const handleDelete: (data: ArticleType) => void = ({fid}) => {
    dispatch({ type: 'article/del', payload: fid }).then(() => {
      dispatch({ type: 'article/getAll' })
    })
  }

  const handleEdit: (data: ArticleType) => void = ({fid}) => {
    history.push({
      pathname: '/article/release',
      query: {
        id: fid,
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
        loading={isLoading}
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