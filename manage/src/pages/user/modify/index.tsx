import React, { FC, Fragment, useCallback, useMemo, useContext } from 'react'
import { Form, Input, Select, Button, Upload, message, Spin, Avatar } from 'antd'
import { UploadOutlined, UserOutlined } from '@ant-design/icons'
import { connect, Dispatch } from 'umi'

import { ConnectState } from '@/models/connect'
import { CurrentUser } from '@/models/user'
import FormattedMsg from '@/components/reactIntl/FormattedMsg'
import { IntlContext } from '@/utils/context/intl'

import styles from './index.less'

const { Option } = Select

const props = {
  name: 'file',
  action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
  headers: {
    authorization: 'authorization-text',
  },
  onChange(info: any) {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList)
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`)
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`)
    }
  },
}

interface ModifyProps {
  dispatch: Dispatch
  currentUser: CurrentUser
  isLoading: boolean
}

interface modifyFormValues {
  username: string
  password: string
  confirm: string
  email: string
  introduction: string
  country: string
  address: string
  phone: string
}

const Modify: FC<ModifyProps> = ({ currentUser, dispatch, isLoading }) => {
  const formatMsg = useContext<any>(IntlContext)

  const prefixSelector: JSX.Element = useMemo(() => (
    <Form.Item name="prefix" noStyle>
      <Select style={{ width: 70 }}>
        <Option value="86">+86</Option>
        <Option value="87">+87</Option>
      </Select>
    </Form.Item>
  ), [])

  const onFinish: (data: modifyFormValues) => void = useCallback(values => {
    console.log('Received values of form: ', values)
    dispatch({
      type: 'user/modify',
      payload: values,
    })
  }, [])
  
  return (
    <Fragment>
      <header className={styles.header}>
        <FormattedMsg id="Setting" />
      </header>
      <Spin spinning={isLoading}>
        <section className={styles.basicView}>
          <div className={styles.basicViewLeft}>
            <Form
              layout="vertical"
              name="modifyForm"
              onFinish={onFinish}
              initialValues={Object.assign({}, currentUser, { prefix: '86' })}
              scrollToFirstError
            >
              <Form.Item
                name="email"
                label={<FormattedMsg id="Email" />}
                rules={[{
                  type: 'email',
                  message: <FormattedMsg id="Invalid email" />,
                }, {
                  required: true,
                  message: <FormattedMsg id="Please enter your email address" />,
                }]}
              >
                <Input placeholder={formatMsg('Please enter your email address')} />
              </Form.Item>
              <Form.Item
                name="username"
                label={<FormattedMsg id="Username" />}
                rules={[{ required: true, message: <FormattedMsg id="Please enter your username" /> }]}
              >
                <Input placeholder={formatMsg('Please enter your username')} />
              </Form.Item>
              <Form.Item
                name="introduction"
                label={<FormattedMsg id="Personal profile" />}
                rules={[{ required: true, message: <FormattedMsg id="Please enter your personal profile" /> }]}
              >
                <Input.TextArea
                  autoSize={{ minRows: 3 }}
                  placeholder={formatMsg('Please enter your personal profile')}
                />
              </Form.Item>
              <Form.Item
                name="country"
                label={<FormattedMsg id="Country" />}
                rules={[{ required: true, message: <FormattedMsg id="Please select your country" /> }]}
              >
                <Select placeholder={formatMsg('Please select your country')}>
                  <Select.Option value="china">
                    <FormattedMsg id="China" />
                  </Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="address"
                label={<FormattedMsg id="Detailed address" />}
                rules={[{ required: true, message: <FormattedMsg id="Please enter your detailed address" /> }]}
              >
                <Input placeholder={formatMsg('Please enter your detailed address')} />
              </Form.Item>
              <Form.Item
                name="phone"
                label={<FormattedMsg id="Mobile phone number" />}
                rules={[{ required: true, message: <FormattedMsg id="Please enter your mobile phone number" /> }]}
              >
                <Input
                  addonBefore={prefixSelector} style={{ width: '100%' }}
                  placeholder={formatMsg('Please enter your mobile phone number')}
                />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" block>
                  <FormattedMsg id="Update basic information" />
                </Button>
              </Form.Item>
            </Form>
          </div>
          <div className={styles.basicViewRight}>
            <div className={styles.avatar}>
              {currentUser.avatar ? (
                <img
                  alt="avatar"
                  width={144}
                  height={144}
                  src={currentUser.avatar}
                />
              ) : <Avatar size={144} icon={<UserOutlined />} />}
            </div>
            <Upload {...props}>
              <Button icon={<UploadOutlined />}>
                <FormattedMsg id="Replace the avatar" />
              </Button>
            </Upload>
          </div>
        </section>
      </Spin>
    </Fragment>
  )
}

export default connect(({ user }: ConnectState) => ({
  currentUser: user.currentUser,
  isLoading: user.isLoading,
}))(Modify)