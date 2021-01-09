import React, { useCallback, useContext, useEffect, useState, useMemo } from 'react'
import { Form, Input, Button, Upload, message, Spin, Radio, Image } from 'antd'
import { connect, Dispatch } from 'umi'
import classnames from 'classnames'

import UploadBtn from '@/components/uploadBtn'
import FormattedMsg from '@/components/reactIntl/FormattedMsg'
import { WebsiteType } from '@/models/setting'
import { ConnectState } from '@/models/connect'
import { IntlContext } from '@/utils/context/intl'
import { getImageUrl, SERVER_URL } from '@/utils'

import theme0 from '@/assets/theme0.png'
import theme1 from '@/assets/theme1.png'
import theme2 from '@/assets/theme2.png'

import styles from './index.less'

interface SettingProps {
  dispatch: Dispatch
  isLoading: boolean
}

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
}

const tailLayout = {
  wrapperCol: { offset: 6, span: 18 },
}

const themes: string[] = [theme0, theme1, theme2]

const Setting: React.FC<SettingProps> = ({ dispatch, isLoading }) => {
  const isSuper = useMemo(() => localStorage.getItem('role') === '1', [localStorage.getItem('role')])
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
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} ${formatMsg('Uploaded failed')}`)
    }
  }, [formatMsg])

  const onFinish: (values: WebsiteType) => void = useCallback(values => {
    const finalValues = Object.assign({}, values, { logo: imageUrl })
    dispatch({ type: 'setting/saveWebsite', payload: finalValues }).then(() => {
      message.success(formatMsg('Update successful'))
    })
  }, [formatMsg, imageUrl])

  const showMsg = useCallback(() => message.warning(formatMsg('NOT_ALLOW')), [formatMsg])

  useEffect(() => {
    dispatch({ type: 'setting/getWebsite' }).then((res: WebsiteType) => {
      form.setFieldsValue(res)
      if (res.logo) {
        setImageUrl(res.logo)
      }
    })
  }, [])

  return (
    <div className={classnames(styles.settingWrapper, { [styles.disabled]: !isSuper })}>
      <Spin spinning={isLoading}>
        <Form
          {...layout}
          form={form}
          name="settingForm"
          onFinish={onFinish}
          initialValues={{ theme: 0 }}
        >
          <Form.Item
            label="Logo"
            name="logo"
            rules={[{ required: true, message: <FormattedMsg id="Please upload your logo" /> }]}
          >
            <Upload
              name="file"
              listType="picture-card"
              action={`${SERVER_URL}/api/v0/files/upload/free`}
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
            rules={[{ required: true, message: <FormattedMsg id="Please enter your website description" /> }]}
          >
            <Input.TextArea
              autoSize={{ minRows: 3 }}
              placeholder={formatMsg('Please enter your website description')}
            />
          </Form.Item>
          <Form.Item
            label={<FormattedMsg id="Website text" />}
            name="r_text"
            rules={[{ required: true, message: <FormattedMsg id="Please enter your website text" /> }]}
          >
            <Input placeholder={formatMsg('Please enter your website text')} />
          </Form.Item>
          <Form.Item
            label={<FormattedMsg id="Website link" />}
            name="r_link"
            rules={[{ required: true, message: <FormattedMsg id="Please enter your website link" /> }]}
          >
            <Input placeholder={formatMsg('Please enter your website link')} />
          </Form.Item>
          <Form.Item
            label={<FormattedMsg id="Theme" />}
            name="theme"
          >
            <Radio.Group>
              {themes.map((theme, index) => (
                <Radio key={theme} value={index}>
                  <Image src={theme} width={100} />
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button
              type="primary"
              htmlType={!isSuper ? 'button' : 'submit'}
              onClick={!isSuper ? showMsg : undefined}
            >
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
