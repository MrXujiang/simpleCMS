import React, { FC, Fragment, useCallback, useMemo, useContext, useEffect } from 'react'
import { Form, Input, Select, Button, Upload, message, Spin, Avatar } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { connect, Dispatch } from 'umi'
import { isEmpty } from 'lodash'

import { ConnectState } from '@/models/connect'
import { CurrentUser } from '@/models/user'
import FormattedMsg from '@/components/reactIntl/FormattedMsg'
import { IntlContext } from '@/utils/context/intl'
import { getBase64 } from '@/utils'
import avatar from '@/assets/avatar.svg'

import styles from './index.less'

interface ModifyProps {
  dispatch: Dispatch
  currentUser: CurrentUser
  isLoading: boolean
}

interface modifyFormValues {
  username: string
  email: string
  desc: string
  country: string
  addr: string
  phone: string
}

const Modify: FC<ModifyProps> = ({ currentUser, dispatch, isLoading }) => {
  const [form] = Form.useForm()
  const formatMsg = useContext<any>(IntlContext)

  const prefixSelector: JSX.Element = useMemo(() => (
    <Form.Item name="prefix" noStyle>
      <Select style={{ width: 70 }}>
        <Select.Option value="86">+86</Select.Option>
        <Select.Option value="87">+87</Select.Option>
      </Select>
    </Form.Item>
  ), [])

  const onFinish: (data: modifyFormValues) => void = useCallback(values => {
    dispatch({
      type: 'user/saveUserInfo',
      payload: values,
    }).then(() => {
      message.success(formatMsg('Update successful'))
      // 同步 rightContent 的用户昵称
      if (values.username !== currentUser.username) {
        dispatch({ type: 'user/getUserInfo' })
      }
    })
  }, [formatMsg, currentUser])

  const onUpload: (info: any) => void = useCallback(info => {
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj, (imageUrl: string) => {
        dispatch({
          type: 'user/saveUserInfo',
          payload: Object.assign(
            {},
            currentUser,
            {tx: imageUrl},
          )
        }).then(() => {
          dispatch({ type: 'user/getUserInfo' })
        })
      })
      message.success(`${info.file.name} ${formatMsg('Uploaded successfully')}`)
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} ${formatMsg('Uploaded failed')}`)
    }
  }, [formatMsg, currentUser])

  useEffect(() => {
    if (!isEmpty(currentUser)) {
      form.setFieldsValue(currentUser)
    }
  }, [currentUser])
  
  return (
    <Fragment>
      <header className={styles.header}>
        <FormattedMsg id="Basic Setting" />
      </header>
      <Spin spinning={isLoading}>
        <section className={styles.basicView}>
          <div className={styles.basicViewLeft}>
            <Form
              layout="vertical"
              name="modifyForm"
              form={form}
              onFinish={onFinish}
              initialValues={{ prefix: '86' }}
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
                name="desc"
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
                name="addr"
                label={<FormattedMsg id="Detailed address" />}
                rules={[{ required: true, message: <FormattedMsg id="Please enter your detailed address" /> }]}
              >
                <Input placeholder={formatMsg('Please enter your detailed address')} />
              </Form.Item>
              <Form.Item
                name="phone"
                label={<FormattedMsg id="Mobile phone number" />}
                rules={[{
                  required: true,
                  message: <FormattedMsg id="Please enter your mobile phone number" />,
                }, {
                  pattern: /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/,
                  message: <FormattedMsg id="Invalid cell phone number" />
                }]}
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
              {currentUser.tx ? <Avatar src={currentUser.tx} style={{ width: 144, height: 144 }} /> : (
                <img
                  alt="avatar"
                  width={144}
                  height={144}
                  src={currentUser.tx ? currentUser.tx : avatar}
                />
              )}
            </div>
            <Upload
              name="file"
              action="http://localhost:3000/api/v0/files/upload/free"
              onChange={onUpload}
              showUploadList={false}
            >
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