import React, { FC, Fragment, useCallback, useState, useEffect, useContext, useRef, useMemo } from 'react'
import { Form, Input, Button, Select, message, Spin, Tabs, Upload, Modal } from 'antd'
import { connect, Dispatch, history } from 'umi'

import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'
import ForEditor from 'for-editor'

import FormattedMsg from '@/components/reactIntl/FormattedMsg'
import UploadBtn from '@/components/uploadBtn'
import { IntlContext } from '@/utils/context/intl'
import { ArticleType } from '@/models/article'
import { ConnectState } from '@/models/connect'
import { getBase64 } from '@/utils'

import styles from './index.less'
import { isEmpty } from 'lodash'

const CATES = [
  '前端', '后端', '人工智能', '产品', '运营',
  '设计', 'javascript', 'HTML5', 'Css3', 'Java',
  'PHP', 'Go', 'Python', 'AI', '算法',
]

enum Visible {
  oneself,
  all,
}

interface ReleaseArticleProps {
  dispatch: Dispatch
  location: any
  articleDetail: ArticleType
  draftDetail: ArticleType
  isLoading: boolean
}

const ReleaseArticle: FC<ReleaseArticleProps> = ({ dispatch, location, articleDetail, draftDetail, isLoading }) => {
  const [form] = Form.useForm()
  const formatMsg = useContext<any>(IntlContext)
  const forEditor = useRef(null)

  const [markdown, setMarkdown] = useState<any>('')
  const [editorState, setEditorState] = useState<any>(BraftEditor.createEditorState(''))
  const [curTab, setCurTab] = useState<string>('edit')
  const [visible, setVisible] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [imageUrl, setImageUrl] = useState<string>('')

  const handleEditorChange: (value: any) => void = useCallback(editorState => setEditorState(editorState), [])

  const onUpload = useCallback((info: any) => {
    if (info.file.status === 'uploading') {
      setLoading(true)
      return
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj, (imageUrl: string) => {
        setLoading(false)
        setImageUrl(imageUrl)
        message.success(`${info.file.name} ${formatMsg('Uploaded successfully')}`)
      })
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} ${formatMsg('Uploaded failed')}`)
    }
  }, [formatMsg])

  const onFinish: (values: ArticleType, action?: string) => void =
    useCallback(function(values, action): void {
      if ((curTab === 'edit' && editorState.isEmpty()) || (curTab === 'markdown' && !markdown.trim())) {
        message.error(formatMsg('Article content cannot be empty'))
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
      const args = Object.assign(
        {},
        values,
        {
          content,
          type,
          face_img: imageUrl,
          fid: location.query.id ? location.query.id : '',
        }
      )

      switch (action) {
        case 'save':
          dispatch({
            type: location.query.draft ? 'article/edit' : 'article/save',
            payload: location.query.draft
              ? Object.assign({}, args, {ct: draftDetail.ct, fid: location.query.id})
              : args,
          }).then((res: any) => {
            if (res.fid) {
              history.replace('/draft')
            }
          })
        break
        case 'preview':
          setVisible(true)
        break
        default:
          dispatch({
            type: !location.query.draft && location.query.id
              ? 'article/mod'
              : 'article/add',
            payload: !location.query.draft && location.query.id
              ? Object.assign({}, args, {ct: articleDetail.ct, fid: location.query.id})
              : args,
          }).then((res: any) => {
            if (res.fid) {
              history.replace('/article')
            }
          })
        break
      }
    }, [
      curTab, editorState, markdown, formatMsg, imageUrl,
      location.query.draft, location.query.id, articleDetail, draftDetail
    ])

  const handleAction: (action: string) => void = useCallback((action) => {
    const values = form.getFieldsValue()
    if (!values.title) {
      message.error(formatMsg('Please input articles title'))
      return
    } else if (!values.label || isEmpty(values.label)) {
      message.error(formatMsg('Please select articles label'))
      return
    } else if (!values.author) {
      message.error(formatMsg('Please input author'))
      return
    } else if (!values.face_img) {
      message.error(formatMsg('Please upload your cover'))
      return
    }
    onFinish(values, action)
  }, [formatMsg, onFinish])

  const handleChangeLabels: (values: string[]) => void = useCallback(values => {
    if (values.length > 3) {
      form.setFieldsValue({ label: values.slice(0, 3) })
      message.error(formatMsg('Select up to three tags'))
    }
  }, [formatMsg, form])

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
        if (res.face_img) {
          setImageUrl(res.face_img)
        }
      })
    }
  }, [])

  const handleCancel = useCallback(() => setVisible(false), [])

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
              <Input style={{ width: 180 }} placeholder={formatMsg('Please input articles title')} />
            </Form.Item>
            <Form.Item
              label={<FormattedMsg id="Label" />}
              name="label"
              rules={[{
                required: true,
                message: <FormattedMsg id="Please select articles label" />
              }]}
            >
              <Select
                mode="multiple"
                allowClear
                style={{ width: 300 }}
                onChange={handleChangeLabels}
                placeholder={formatMsg('Please select articles label')}
              >
                {CATES.map(cate => (
                  <Select.Option key={cate} value={cate}>
                    {cate}
                  </Select.Option>
                ))}
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
              <Input style={{ width: 150 }} placeholder={formatMsg('Please input author')} />
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
            <Form.Item
              label={<FormattedMsg id="Cover" />}
              name="face_img"
              rules={[{ required: true, message: <FormattedMsg id="Please upload your cover" /> }]}
            >
              <Upload
                name="file"
                listType="picture-card"
                action="http://localhost:3000/api/v0/files/upload/free"
                onChange={onUpload}
                showUploadList={false}
              >
                {imageUrl ? <img src={imageUrl} alt="websiteLogo" style={{ width: 102, height: 102 }} /> : <UploadBtn loading={loading} />}
              </Upload>
            </Form.Item>
            <Form.Item className={styles.btns}>
              <Button type="primary" htmlType="submit" className={styles.btn}>
                <FormattedMsg id="Published" />
              </Button>
              <Button
                type="primary"
                className={styles.btn}
                danger
                onClick={handleAction.bind(this, 'save')}
              >
                <FormattedMsg id="Save drafts" />
              </Button>
              <Button
                type="dashed"
                onClick={handleAction.bind(this, 'preview')}
              >
                <FormattedMsg id="Preview" />
              </Button>
            </Form.Item>
          </Form>
          <Tabs
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
      <Modal
        centered
        title={<FormattedMsg id="Preview" />}
        visible={visible}
        onCancel={handleCancel}
        footer={null}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    </Fragment>
  )
}

export default connect(({ article }: ConnectState) => ({
  isLoading: article.isLoading,
  articleDetail: article.articleDetail,
  draftDetail: article.draftDetail,
}))(ReleaseArticle)