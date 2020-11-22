import React, { useCallback, useState, useEffect, useContext, FC, Fragment, ChangeEvent } from 'react'
import { Form, Input, Button, Select, message, Spin, Tabs } from 'antd'
import { connect, Dispatch, history } from 'umi'

import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'

import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism'

import gfm from 'remark-gfm'
import {InlineMath, BlockMath} from 'react-katex'
import math from 'remark-math'
import 'katex/dist/katex.min.css'

import FormattedMsg from '@/components/reactIntl/FormattedMsg'
import { IntlContext } from '@/utils/context/intl'
import { ArticleType } from '@/models/article'
import { ConnectState } from '@/models/connect'

import styles from './index.less'

const renderers = {
  code: ({ language, value }: any) => {
    return <SyntaxHighlighter style={dark} language={language} children={value} />
  },
  inlineMath: ({ value }: any) => <InlineMath math={value} />,
  math: ({ value }: any) => <BlockMath math={value} />
}

const children: any[] = []
for (let i = 10; i < 36; i++) {
  children.push(<Select.Option key={i.toString(36) + i}>{i.toString(36) + i}</Select.Option>)
}

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
}

interface ReleaseArticleProps {
  dispatch: Dispatch
  location: any
  isLoading: boolean
}

interface ReleaseArticleFormValues {
  title: string
  labels: string[]
}

const ReleaseArticle: FC<ReleaseArticleProps> = ({ dispatch, location, isLoading }) => {
  const [form] = Form.useForm()
  const formatMsg = useContext<any>(IntlContext)

  const [markdown, setMarkdown] = useState<any>('')
  const [editorState, setEditorState] = useState<any>(null)
  const [curTab, setCurTab] = useState<string>('edit')

  // editor
  // const submitContent = async () => {
  //   // 在编辑器获得焦点时按下ctrl+s会执行此方法
  //   // 编辑器内容提交到服务端之前，可直接调用editorState.toHTML()来获取HTML格式的内容
  //   const htmlContent = editorState.toHTML()
  //   const result = await saveEditorContent(htmlContent)
  // }
  const handleEditorChange: (value: any) => void = editorState => setEditorState(editorState)

  // form
  const onFinish: (values: ReleaseArticleFormValues, type?: string) => void =
    useCallback(function(values: ReleaseArticleFormValues, type = 'publish'): void {
      if ((curTab === 'edit' && editorState.isEmpty()) || (curTab === 'markdown' && !markdown.trim())) {
        message.warning(formatMsg('Article content cannot be empty'))
        return
      }
  
      let content
      switch (curTab) {
        case 'edit':
          content = editorState.toHTML()
          break;
        case 'markdown':
          content = markdown
          break;
        default:
          content = editorState.toHTML()
          break;
      }
      const finalValues = Object.assign({}, values, { content })
      switch (type) {
        case 'publish':
          dispatch({
            type: 'article/releaseArticle',
            payload: finalValues,
          }).then(() => history.replace('/article'))
          break;
        case 'save':
          dispatch({
            type: 'article/releaseArticle',
            payload: finalValues,
          }).then(() => history.replace('/article'))
          break;
        case 'preview':
          window.open('https://www.baidu.com/')
          break;
        default:
          break;
      }
    }, [curTab, editorState, markdown])

  // tabs
  const toggleTabs = useCallback((key) => setCurTab(key), [])

  const handleChangeText = (e: ChangeEvent<HTMLTextAreaElement>) => setMarkdown(e.target.value)

  useEffect(() => {
    if (location && location.query && location.query.key) {
      dispatch({
        type: 'article/getArticleDetail',
        payload: location.query.key
      }).then((res: ArticleType) => form.setFieldsValue(res))
    }
    dispatch({ type: 'article/getEditorContent' }).then((htmlContent: any) => {
      setEditorState(BraftEditor.createEditorState(htmlContent))
      setMarkdown(htmlContent)
    })
  }, [])

  return (
    <Fragment>
      <header>
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
          >
            <Form.Item
              label={<FormattedMsg id="Title" />}
              name="title"
              rules={[{
                required: true,
                message: <FormattedMsg id="Please input articles title" />
              }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label={<FormattedMsg id="Label" />}
              name="labels"
              rules={[{
                required: true,
                message: <FormattedMsg id="Please select articles label" />
              }]}
            >
              <Select
                mode="multiple"
                allowClear
                style={{ width: '100%' }}
              >
                {children}
              </Select>
            </Form.Item>
            <Form.Item {...tailLayout} className={styles.btns}>
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
                // onSave={submitContent} // ctrl + s
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Markdown" key="markdown">
              <div className={styles.markdownLayout}>
                <Input.TextArea
                  className={styles.markdownLeft}
                  onChange={handleChangeText}
                  value={markdown}
                />
                <div className={styles.markdownRight}>
                  <ReactMarkdown
                    plugins={[gfm, math]}
                    renderers={renderers}
                    children={markdown}
                  />
                </div>
              </div>
            </Tabs.TabPane>
          </Tabs>
        </Fragment>
      </Spin>
    </Fragment>
  )
}

export default connect(({ article }: ConnectState) => ({
  isLoading: article.isLoading,
}))(ReleaseArticle)