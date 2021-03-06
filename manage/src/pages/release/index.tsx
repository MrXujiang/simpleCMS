import React, { useCallback, useState, useEffect, useContext, useRef, useMemo } from 'react'
import { Form, Input, Button, Select, message, Spin, Tabs, Upload } from 'antd'
import { PictureFilled } from '@ant-design/icons'
import { connect, Dispatch, history } from 'umi'
import ImgCrop from 'antd-img-crop'
import moment from 'moment'

import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'
import { ContentUtils } from 'braft-utils'
import ForEditor from 'for-editor'

import FormattedMsg from '@/components/reactIntl/FormattedMsg'
import PreviewModal from '@/components/modal/preview'
import UploadBtn from '@/components/uploadBtn'
import { IntlContext } from '@/utils/context/intl'
import { ArticleType } from '@/models/article'
import { CurrentUser } from '@/models/user'
import { ConnectState } from '@/models/connect'
import { getImageUrl, getFormdata, TIME_FORMAT, SERVER_URL } from '@/utils'

import styles from './index.less'
import { isEmpty } from 'lodash'

const CATES = [
  '前端', '后端', '人工智能', '产品', '运营',
  '设计', 'javascript', 'HTML5', 'Css3', 'Java',
  'PHP', 'Go', 'Python', 'AI', '算法',
]

/* eslint-disable */
enum Visible {
  oneself,
  all,
}
/* eslint-enable */

interface ReleaseArticleProps {
  dispatch: Dispatch
  location: any
  articleDetail: ArticleType
  draftDetail: ArticleType
  isLoading: boolean
  currentUser: CurrentUser
}

const ReleaseArticle: React.FC<ReleaseArticleProps> = ({ dispatch, location, articleDetail, draftDetail, isLoading, currentUser }) => {
  const [form] = Form.useForm()
  const formatMsg = useContext<any>(IntlContext)
  const forEditor = useRef(null)
  const formValues: ArticleType = useMemo(() => form.getFieldsValue(), [form.getFieldsValue()])

  const [markdown, setMarkdown] = useState<any>('')
  const [editorState, setEditorState] = useState<any>(BraftEditor.createEditorState(null))
  const [curTab, setCurTab] = useState<string>('edit')
  const [visible, setVisible] = useState<boolean>(false)
  const [faceImgLoading, setFaceImgLoading] = useState<boolean>(false)
  const [faceImg, setFaceImg] = useState<string>('')
  const [payCodeLoading, setPayCodeLoading] = useState<boolean>(false)
  const [payCode, setPayCode] = useState<string>('')

  const onFaceImageUpload: (info: any) => void = useCallback(info => {
    if (info.file.status === 'uploading') {
      setFaceImgLoading(true)
      return
    }
    if (info.file.status === 'done') {
      const faceImg = getImageUrl(info)
      setFaceImgLoading(false)
      setFaceImg(faceImg)
      message.success(`${info.file.name} ${formatMsg('Uploaded successfully')}`)
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} ${formatMsg('Uploaded failed')}`)
    }
  }, [formatMsg])

  const onPayUpload: (info: any) => void = useCallback(info => {
    if (info.file.status === 'uploading') {
      setPayCodeLoading(true)
      return
    }
    if (info.file.status === 'done') {
      const payCode = getImageUrl(info)
      setPayCodeLoading(false)
      setPayCode(payCode)
      message.success(`${info.file.name} ${formatMsg('Uploaded successfully')}`)
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

      const { state: { id = '', draft = false, top = false } = {} } = location
      const args = {
        ...values,
        content,
        type,
        fid: id || '',
        top,
      }
      if (faceImg) {
        args.face_img = faceImg
      }
      if (payCode) {
        args.payCode = payCode
      }

      switch (action) {
      case 'save':
        dispatch({
          type: draft ? 'article/edit' : 'article/save',
          payload: draft
            ? Object.assign({}, args, { ct: draftDetail.ct, fid: id })
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
          type: !draft && id
            ? 'article/mod'
            : 'article/add',
          payload: !draft && id
            ? Object.assign({}, args, { ct: articleDetail.ct, fid: id })
            : args,
        }).then((res: any) => {
          if (res.fid) {
            history.replace('/article')
          }
        })
        break
      }
    }, [
      curTab, editorState, markdown, formatMsg, faceImg, payCode,
      location.state, articleDetail, draftDetail,
    ])

  const handleAction: (action: string) => void = useCallback(action => {
    const values = form.getFieldsValue()
    if (!values.title) {
      message.error(formatMsg('Please input articles title'))
      return
    } else if (!values.label || isEmpty(values.label)) {
      message.error(formatMsg('Please select articles label'))
      return
    } else if (values.desc && values.desc.length > 20) {
      message.error(formatMsg('The description should not exceed 20 words'))
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

  const editorUploadHandler: (info: any) => void = useCallback((info) => {
    if (info.file.status === 'done') {
      const imageUrl = getImageUrl(info)
      setEditorState(ContentUtils.insertMedias(editorState, [{
        type: 'IMAGE',
        url: imageUrl,
      }]))
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} ${formatMsg('Uploaded failed')}`)
    }
  }, [editorState])

  const excludeControls: any[] = useMemo(() => ['media'], [])

  const extendControls: any[] = useMemo(() => [
    {
      key: 'antd-uploader',
      type: 'component',
      component: (
        <Upload
          name="file"
          action={`${SERVER_URL}/api/v0/files/upload/free`}
          showUploadList={false}
          onChange={editorUploadHandler}
        >
          <button type="button" className="control-item button upload-button" data-title={formatMsg('Insert the picture')}>
            <PictureFilled />
          </button>
        </Upload>
      ),
    },
  ], [editorUploadHandler])

  const handleEditorChange: (value: any) => void = useCallback(editorState => setEditorState(editorState), [])

  const handleChangeText: (value: string) => void = useCallback(value => setMarkdown(value), [])

  const addImg: (info: any) => void = useCallback((info) => {
    const formdata = getFormdata(info)
    dispatch({ type: 'article/upload', payload: formdata }).then((res: any) => {
      (forEditor.current as any).$img2Url(res.filename, res.url)
    })
  }, [forEditor])

  const handleCancel: () => void = useCallback(() => setVisible(false), [])

  const time = useMemo(() => {
    const { state: { id = '', draft = false } = {} } = location
    return moment(
      draft
        ? draftDetail.ct
        : id
          ? articleDetail.ct
          : undefined,
    ).format(TIME_FORMAT)
  }, [location.state, draftDetail, articleDetail])

  useEffect(() => {
    const { state: { id = '', draft = false } = {} } = location
    if (id) {
      dispatch({
        type: draft ? 'article/getDraftDetail' : 'article/getArticleDetail',
        payload: id,
      }).then((res: ArticleType) => {
        form.setFieldsValue(res)
        if (res.content) {
          if (res.type) {
            setCurTab('markdown')
            setMarkdown(res.content)
          } else {
            setCurTab('edit')
            setEditorState(BraftEditor.createEditorState(res.content))
          }
        }
        if (res.face_img) {
          setFaceImg(res.face_img)
        }
        if (res.payCode) {
          setPayCode(res.payCode)
        }
      })
    }
  }, [])

  return (
    <div className={styles.releaseWrapper}>
      <header>
        <FormattedMsg id="Publish articles" />
      </header>
      <Spin spinning={isLoading}>
        <React.Fragment>
          <Form
            layout="inline"
            form={form}
            className={styles.releaseForm}
            name="releaseArticleForm"
            onFinish={onFinish}
            initialValues={{
              visible: 1,
            }}
          >
            <Form.Item
              className={styles.item}
              label={<FormattedMsg id="Title" />}
              name="title"
              rules={[{
                required: true,
                message: <FormattedMsg id="Please input articles title" />,
              }]}
            >
              <Input style={{ width: 180 }} placeholder={formatMsg('Please input articles title')} />
            </Form.Item>
            <Form.Item
              className={styles.item}
              label={<FormattedMsg id="Label" />}
              name="label"
              rules={[{
                required: true,
                message: <FormattedMsg id="Please select articles label" />,
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
              className={styles.item}
              label={<FormattedMsg id="Author" />}
              name="author"
            >
              <Input style={{ width: 150 }} placeholder={formatMsg('Please input author')} />
            </Form.Item>
            <Form.Item
              className={styles.item}
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
            >
              <ImgCrop rotate aspect={1000 / 640}>
                <Upload
                  name="file"
                  listType="picture-card"
                  action={`${SERVER_URL}/api/v0/files/upload/free`}
                  onChange={onFaceImageUpload}
                  showUploadList={false}
                >
                  {faceImg
                    ? <img src={faceImg} alt="face_img" style={{ width: 102, height: 102 }} />
                    : <UploadBtn loading={faceImgLoading} />}
                </Upload>
              </ImgCrop>
            </Form.Item>
            <Form.Item
              label={<FormattedMsg id="Description" />}
              name="desc"
              rules={[{
                type: 'string',
                min: 0,
                max: 20,
                message: <FormattedMsg id="The description should not exceed 20 words" />,
              }]}
            >
              <Input.TextArea placeholder={formatMsg('Please enter description')} rows={4} />
            </Form.Item>
            <Form.Item
              label={<FormattedMsg id="PayCode" />}
              name="payCode"
            >
              <Upload
                name="file"
                listType="picture-card"
                action={`${SERVER_URL}/api/v0/files/upload/free`}
                onChange={onPayUpload}
                showUploadList={false}
              >
                {payCode
                  ? <img src={payCode} alt="PayCode" style={{ width: 102, height: 102 }} />
                  : <UploadBtn loading={payCodeLoading} />}
              </Upload>
            </Form.Item>
            <Form.Item>
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
              margin: 0,
            }}
          >
            <Tabs.TabPane tab={<FormattedMsg id="Text editor" />} key="edit">
              <BraftEditor
                value={editorState}
                extendControls={extendControls}
                excludeControls={excludeControls}
                onChange={handleEditorChange}
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Markdown" key="markdown">
              <ForEditor
                ref={forEditor}
                preview
                subfield
                height="480px"
                value={markdown}
                onChange={handleChangeText}
                addImg={addImg}
                placeholder={formatMsg('Start editing...')}
                lineNum={0}
                toolbar={{
                  h1: true,
                  h2: true,
                  h3: true,
                  h4: true,
                  img: true,
                  link: true,
                  code: true,
                  preview: true,
                  expand: true,
                  undo: true,
                  redo: true,
                  subfield: true,
                }}
              />
            </Tabs.TabPane>
          </Tabs>
        </React.Fragment>
      </Spin>
      <PreviewModal
        visible={visible}
        formValues={formValues}
        onCancel={handleCancel}
        time={time}
        curTab={curTab}
        editorState={editorState}
        markdown={markdown}
        faceImg={faceImg}
        payCode={payCode}
        currentUser={currentUser}
      />
    </div>
  )
}

export default connect(({ article, user }: ConnectState) => ({
  isLoading: article.isLoading,
  articleDetail: article.articleDetail,
  draftDetail: article.draftDetail,
  currentUser: user.currentUser,
}))(ReleaseArticle)
