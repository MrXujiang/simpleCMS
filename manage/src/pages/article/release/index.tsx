import React, { useCallback, useState, useEffect, useContext, FC, Fragment, useRef } from 'react'
import { Form, Input, Button, Select, message, Spin, Tabs } from 'antd'
import { connect, Dispatch, history } from 'umi'

import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'
import ForEditor from 'for-editor'

import FormattedMsg from '@/components/reactIntl/FormattedMsg'
import { IntlContext } from '@/utils/context/intl'
import { ArticleType } from '@/models/article'
import { ConnectState } from '@/models/connect'

import styles from './index.less'

const children: any[] = []
for (let i = 10; i < 36; i++) {
  children.push(<Select.Option key={i.toString(36) + i}>{i.toString(36) + i}</Select.Option>)
}

enum Visible {
  oneself,
  all,
}

interface ReleaseArticleProps {
  dispatch: Dispatch
  location: any
  articleDetail: ArticleType
  isLoading: boolean
}

interface ReleaseArticleFormValues {
  title: string
  label: string[]
  author: string
}

const ReleaseArticle: FC<ReleaseArticleProps> = ({ dispatch, location, articleDetail, isLoading }) => {
  const [form] = Form.useForm()
  const formatMsg = useContext<any>(IntlContext)
  const forEditor = useRef(null)

  const [markdown, setMarkdown] = useState<any>('')
  const [editorState, setEditorState] = useState<any>(BraftEditor.createEditorState(''))
  const [curTab, setCurTab] = useState<string>('edit')

  // editor ctrl+s
  // const submitContent = async () => {
  //   // 在编辑器获得焦点时按下ctrl+s会执行此方法
  //   // 编辑器内容提交到服务端之前，可直接调用editorState.toHTML()来获取HTML格式的内容
  //   const htmlContent = editorState.toHTML()
  //   const result = await saveEditorContent(htmlContent)
  // }
  const handleEditorChange: (value: any) => void = useCallback(editorState => setEditorState(editorState), [])

  // form
  const operation: (action: string | undefined, finalValues: ReleaseArticleFormValues) => void = useCallback((action, finalValues) => {
    switch (action) {
      case 'save':
        dispatch({
          // 等开发完编辑草稿接口后对接
          type: location.query.draft ? 'article/save' : 'article/save',
          payload: finalValues,
        }).then((res: any) => {
          if (res.fid) {
            history.replace('/article')
          }
        })
      break
      case 'preview':
        window.open('https://www.baidu.com/')
      break
      default:
        dispatch({
          type: location.query.draft && location.query.id
            ? 'article/add'
            : (location.query.id ? 'article/mod' : 'article/add'),
          payload: finalValues,
        }).then((res: any) => {
          if (res.fid) {
            history.replace('/article')
          }
        })
      break
    }
  }, [])

  const onFinish: (values: ReleaseArticleFormValues, action?: string) => void =
    useCallback(function(values, action): void {
      if ((curTab === 'edit' && editorState.isEmpty()) || (curTab === 'markdown' && !markdown.trim())) {
        message.warning(formatMsg('Article content cannot be empty'))
        return
      }
  
      let content
      let type
      switch (curTab) {
        case 'edit':
          content = editorState.toHTML()
          type = 0
          break
        case 'markdown':
          content = markdown
          type = 1
          break
      }
      const finalValues = Object.assign(
        {},
        values,
        location.query.id ? {content, type, fid: articleDetail.fid} : {content, type}
      )

      if (!!action) {
        form.validateFields().then(() => {
          operation(action, finalValues)
        })
      } else {
        operation(undefined, finalValues)
      }
    }, [curTab, editorState, markdown, formatMsg])

  const checkLabelsLength: (_: any, values: string[]) => void = useCallback((_, values) => {
    if (values && values.length > 3) {
      return Promise.reject()
    }
    return Promise.resolve()
  }, [])

  // tabs
  const toggleTabs = useCallback((key) => setCurTab(key), [])

  const handleChangeText = useCallback((value: string) => setMarkdown(value), [])

  useEffect(() => {
    if (location.query.id) {
      dispatch({
        type: location.query.draft ? 'article/getDraftDetail' : 'article/getArticleDetail',
        payload: location.query.id
      }).then((res: ArticleType) => {
        form.setFieldsValue(res)
        if (res.content) {
          if (!!res.type) {
            setCurTab('markdown')
          } else {
            setCurTab('edit')
          }
          setMarkdown(res.content)
          setEditorState(BraftEditor.createEditorState(res.content))
        }
      })
    }
  }, [])

  return (
    <Fragment>
      <header className={styles.header}>
        <FormattedMsg id="Publish articles" />
      </header>
      <Spin spinning={isLoading}>
        <Fragment>
          <Form
            layout="inline"
            form={form}
            className={styles.releaseArticleForm}
            name="releaseArticleForm"
            onFinish={onFinish}
            initialValues={{
              visible: 1
            }}
          >
            <Form.Item
              label={<FormattedMsg id="Title" />}
              name="title"
              rules={[{
                required: true,
                message: <FormattedMsg id="Please input articles title" />
              }]}
            >
              <Input style={{ width: 180 }} />
            </Form.Item>
            <Form.Item
              label={<FormattedMsg id="Label" />}
              name="label"
              rules={[{
                required: true,
                message: <FormattedMsg id="Please select articles label" />
              }, {
                validator: checkLabelsLength,
                message: <FormattedMsg id="Select up to three tags" />
              }]}
            >
              <Select
                mode="multiple"
                allowClear
                style={{ width: 200 }}
              >
                {children}
              </Select>
            </Form.Item>
            <Form.Item
              label={<FormattedMsg id="Author" />}
              name="author"
              rules={[{
                required: true,
                message: <FormattedMsg id="Please input author" />
              }]}
            >
              <Input style={{ width: 100 }} />
            </Form.Item>
            <Form.Item
              label={<FormattedMsg id="Visible" />}
              name="visible"
            >
              <Select style={{ width: 120 }}>
                <Select.Option value={Visible.all}>
                  <FormattedMsg id="For all to see" />
                </Select.Option>
                <Select.Option value={Visible.oneself}>
                  <FormattedMsg id="Only visible to oneself" />
                </Select.Option>
              </Select>
            </Form.Item>
            <Form.Item className={styles.btns}>
              <Button type="primary" htmlType="submit" className={styles.btn}>
                <FormattedMsg id="Published" />
              </Button>
              <Button
                type="primary"
                className={styles.btn}
                danger
                onClick={onFinish.bind(this, form.getFieldsValue(), 'save')}
              >
                <FormattedMsg id="Save drafts" />
              </Button>
              <Button
                type="dashed"
                onClick={onFinish.bind(this, form.getFieldsValue(), 'preview')}
              >
                <FormattedMsg id="Preview" />
              </Button>
            </Form.Item>
          </Form>
          <Tabs
            className={styles.tabs}
            size="small"
            activeKey={curTab}
            onChange={toggleTabs}
            tabBarStyle={{
              margin: 0
            }}
          >
            <Tabs.TabPane tab={<FormattedMsg id="Text editor" />} key="edit">
              <BraftEditor
                value={editorState}
                onChange={handleEditorChange}
                // onSave={submitContent}
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Markdown" key="markdown">
              <ForEditor
                preview
                subfield
                value={markdown}
                height="100%"
                style={{ borderRadius: 0 }}
                onChange={handleChangeText}
                toolbar={{}}
                ref={forEditor}
              />
            </Tabs.TabPane>
          </Tabs>
        </Fragment>
      </Spin>
    </Fragment>
  )
}

export default connect(({ article }: ConnectState) => ({
  isLoading: article.isLoading,
  articleDetail: article.articleDetail,
}))(ReleaseArticle)