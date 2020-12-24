import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Form, Input, Button, Upload, message, Spin } from 'antd'
import { connect, Dispatch } from 'umi'

import UploadBtn from '@/components/uploadBtn'
import { ConnectState } from '@/models/connect'
import FormattedMsg from '@/components/reactIntl/FormattedMsg'
import { IntlContext } from '@/utils/context/intl'
import { WebsiteType } from '@/models/setting'
import { getImageUrl, SERVER_URL } from '@/utils'

import styles from './index.less'

interface SettingProps {
  dispatch: Dispatch
  isLoading: boolean}

const layout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 17 },
}

const tailLayout = {
  wrapperCol: { offset: 7, span: 17 },
}

const Setting: React.FC<SettingProps> = ({ dispatch, isLoading }) => {
  const formatMsg = useContext<any>(IntlContext)
  const [form] = Form.useForm()

  const [loading, setLoading] = useState<boolean>(false)
  const [imageUrl, setImageUrl] = useState<string>('')

  const onUpload = useCallback((info: any) => {
    if (info.file.status === 'uploading') {
      setLoading(true)
      return
    }
    if (info.file.status === 'done') {
      const imageUrl = getImageUrl(info)
      setLoading(false)
      setImageUrl(imageUrl)
      message.success(`${info.file.name} ${formatMsg('Uploaded successfully')}`)
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} ${formatMsg('Uploaded failed')}`)
    }
  }, [formatMsg])

  const onFinish: (values: WebsiteType) => void = useCallback(values => {
    const finalValues = Object.assign({}, values, {logo: imageUrl})
    dispatch({ type: 'setting/saveWebsite', payload: finalValues }).then(() => {
      message.success(formatMsg('Update successful'))
    })
  }, [formatMsg, imageUrl])

  useEffect(() => {
    dispatch({ type: 'setting/getWebsite' }).then((res: WebsiteType) => {
      form.setFieldsValue(res)
      if (res.logo) {
        setImageUrl(res.logo)
      }
    })
  }, [])

  return (
    <div className={styles.settingWrapper}>
      <Spin spinning={isLoading}>
        <Form
          {...layout}
          form={form}
          name="settingForm"
          onFinish={onFinish}
        >
          <Form.Item
            label="Logo"
            name="logo"
            rules={[{ required: true, message: <FormattedMsg id="Please upload your logo" /> }]}
          >
            <Upload
              name="file"
              listType="picture-card"
              action={`http://${SERVER_URL}/api/v0/files/upload/free`}
              onChange={onUpload}
              showUploadList={false}
            >
              {imageUrl ? <img src={imageUrl} alt="websiteLogo" style={{ width: '100%' }} /> : <UploadBtn loading={loading} />}
            </Upload>
          </Form.Item>
          <Form.Item
            label={<FormattedMsg id="Website name" />}
            name="title"
            rules={[{ required: true, message: <FormattedMsg id="Please input your website name" /> }]}
          >
            <Input placeholder={formatMsg('Please input your website name')} />
          </Form.Item>
          <Form.Item
            label={<FormattedMsg id="Website description" />}
            name="desc"
            rules={[{ required: true, message: 'Please enter your website description' }]}
          >
            <Input.TextArea
              autoSize={{ minRows: 3 }}
              placeholder={formatMsg('Please enter your website description')}
            />
          </Form.Item>
          <Form.Item
            label={<FormattedMsg id="Website text" />}
            name="r_text"
            rules={[{ required: true, message: <FormattedMsg id="Please enter your text" /> }]}
          >
            <Input placeholder={formatMsg('Please enter your text')} />
          </Form.Item>
          <Form.Item
            label={<FormattedMsg id="Website link" />}
            name="r_link"
            rules={[{ required: true, message: <FormattedMsg id="Please enter your link" /> }]}
          >
            <Input placeholder={formatMsg('Please enter your link')} />
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              <FormattedMsg id="Submit" />
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </div>
  )
}

export default connect(({ setting }: ConnectState) => ({
  isLoading: setting.isLoading,
}))(Setting)