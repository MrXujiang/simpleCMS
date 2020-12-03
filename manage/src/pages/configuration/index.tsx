import React, { FC, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { Form, Input, Button, Upload, message, Spin } from 'antd'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import { connect, Dispatch } from 'umi'

import { ConnectState } from '@/models/connect'
import FormattedMsg from '@/components/reactIntl/FormattedMsg'
import { IntlContext } from '@/utils/context/intl'
import { ConfigurationType } from '@/models/configuration'

import styles from './index.less'

interface ConfigurationProps {
  dispatch: Dispatch
  isLoading: boolean
}

const getBase64: (img: any, cb: any) => void = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

const layout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 17 },
}

const tailLayout = {
  wrapperCol: { offset: 7, span: 17 },
}

const Configuration: FC<ConfigurationProps> = ({ dispatch, isLoading }) => {
  const formatMsg = useContext<any>(IntlContext)
  const [form] = Form.useForm()

  const [loading, setLoading] = useState<boolean>(false)
  const [imageUrl, setImageUrl] = useState<string>('')

  const nickname = useMemo(() => localStorage.getItem('nickname'), [localStorage.getItem('nickname')])

  const onUpload = useCallback((info: any) => {
    if (info.file.status === 'uploading') {
      setLoading(true)
      return
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj, (imageUrl: string) => {
        setLoading(false)
        setImageUrl(imageUrl)
      })
      message.success(`${info.file.name} ${formatMsg('Uploaded successfully')}`)
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} ${formatMsg('Uploaded failed')}`)
    }
  }, [])

  const uploadButton = useMemo(() =>(
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>
        <FormattedMsg id="Upload" />
      </div>
    </div>
  ), [loading])

  const onFinish: (values: ConfigurationType) => void = useCallback(values => {
    console.log('Success:', values);
  }, [])

  useEffect(() => {
    dispatch({ type: 'configuration/getConfiguration' }).then((res: ConfigurationType) => {
      form.setFieldsValue(res)
      if (res.logo) {
        setImageUrl(res.logo)
      }
    })
  }, [])

  return (
    <div className={styles.configurationWrapper}>
      <Spin spinning={isLoading}>
        <Form
          {...layout}
          form={form}
          name="configurationForm"
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
              action="http://localhost:3000/api/v0/files/upload/free"
              headers={{
                authorization: 'wsyzdbzasn5211314',
                'X-Requested-With': nickname ? nickname : ''
              }}
              onChange={onUpload}
              showUploadList={false}
            >
              {imageUrl ? <img src={imageUrl} alt="logo" style={{ width: '100%' }} /> : uploadButton}
            </Upload>
          </Form.Item>
          <Form.Item
            label={<FormattedMsg id="Website name" />}
            name="name"
            rules={[{ required: true, message: <FormattedMsg id="Please input your website name" /> }]}
          >
            <Input placeholder={formatMsg('Please input your website name')} />
          </Form.Item>
          <Form.Item
            label={<FormattedMsg id="Website description" />}
            name="description"
            rules={[{ required: true, message: 'Please enter your website description' }]}
          >
            <Input.TextArea
              autoSize={{ minRows: 3 }}
              placeholder={formatMsg('Please enter your website description')}
            />
          </Form.Item>
          <Form.Item
            label={<FormattedMsg id="Website text" />}
            name="text"
            rules={[{ required: true, message: <FormattedMsg id="Please enter your text" /> }]}
          >
            <Input placeholder={formatMsg('Please enter your text')} />
          </Form.Item>
          <Form.Item
            label={<FormattedMsg id="Website link" />}
            name="link"
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

export default connect(({ configuration }: ConnectState) => ({
  isLoading: configuration.isLoading,
}))(Configuration)