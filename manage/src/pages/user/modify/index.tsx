import React, { useCallback, useMemo, useContext, useEffect, useState } from 'react'
import { Form, Input, Select, Button, Upload, message, Spin, Avatar } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { connect, Dispatch } from 'umi'
import { isEmpty } from 'lodash'

import { ConnectState } from '@/models/connect'
import { CurrentUser } from '@/models/user'
import FormattedMsg from '@/components/reactIntl/FormattedMsg'
import { IntlContext } from '@/utils/context/intl'
import { getImageUrl, phoneRE, SERVER_URL } from '@/utils'
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
  tx?: string
}

const Modify: React.FC<ModifyProps> = ({ currentUser, dispatch, isLoading }) => {
  const isSuper = useMemo(() => localStorage.getItem('role') === '1', [localStorage.getItem('role')])
  const [form] = Form.useForm()
  const formatMsg = useContext<any>(IntlContext)
  const [tx, setTx] = useState<string>('')

  // eslint-disable-next-line no-undef
  const prefixSelector: JSX.Element = useMemo(() => (
    <Form.Item name="prefix" noStyle>
      <Select disabled={!isSuper} style={{ width: 70 }}>
        <Select.Option value="86">+86</Select.Option>
        <Select.Option value="87">+87</Select.Option>
      </Select>
    </Form.Item>
  ), [isSuper])

  const onFinish: (data: modifyFormValues) => void = useCallback(values => {
    dispatch({
      type: 'user/saveUserInfo',
      payload: tx ? Object.assign({}, values, { tx }) : values,
    }).then(() => {
      message.success(formatMsg('Update successful'))
      // 同步 rightContent 的用户昵称
      if (values.username !== currentUser.username || tx !== currentUser.tx) {
        dispatch({ type: 'user/getUserInfo' })
      }
    })
  }, [formatMsg, currentUser, tx])

  const showMsg = useCallback(() => message.warning(formatMsg('NOT_ALLOW')), [formatMsg])

  const onUpload: (info: any) => void = useCallback(info => {
    if (info.file.status === 'done') {
      const tx = getImageUrl(info)
      setTx(tx)
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} ${formatMsg('Uploaded failed')}`)
    }
  }, [formatMsg])

  useEffect(() => {
    if (!isEmpty(currentUser)) {
      form.setFieldsValue(currentUser)
      currentUser.tx && setTx(currentUser.tx)
    }
  }, [currentUser])

  return (
    <div className={styles.modifyWrapper}>
      <header>
        <FormattedMsg id="Basic Setting" />
      </header>
      <Spin spinning={isLoading}>
        <section className={styles.basicView}>
          <div className={styles.left}>
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
                <Input disabled={!isSuper} placeholder={formatMsg('Please enter your email address')} />
              </Form.Item>
              <Form.Item
                name="username"
                label={<FormattedMsg id="Username" />}
                rules={[{ required: true, message: <FormattedMsg id="Please enter your username" /> }]}
              >
                <Input disabled={!isSuper} placeholder={formatMsg('Please enter your username')} />
              </Form.Item>
              <Form.Item
                name="desc"
                label={<FormattedMsg id="Personal profile" />}
                rules={[{ required: true, message: <FormattedMsg id="Please enter your personal profile" /> }]}
              >
                <Input.TextArea
                  disabled={!isSuper}
                  autoSize={{ minRows: 3 }}
                  placeholder={formatMsg('Please enter your personal profile')}
                />
              </Form.Item>
              <Form.Item
                name="country"
                label={<FormattedMsg id="Country" />}
              >
                <Select
                  disabled={!isSuper}
                  placeholder={formatMsg('Please select your country')}
                >
                  <Select.Option value="china">
                    <FormattedMsg id="China" />
                  </Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="addr"
                label={<FormattedMsg id="Detailed address" />}
              >
                <Input disabled={!isSuper} placeholder={formatMsg('Please enter your detailed address')} />
              </Form.Item>
              <Form.Item
                name="phone"
                label={<FormattedMsg id="Mobile phone number" />}
                rules={[{
                  pattern: phoneRE,
                  message: <FormattedMsg id="Invalid cell phone number" />,
                }]}
              >
                <Input
                  disabled={!isSuper}
                  addonBefore={prefixSelector} style={{ width: '100%' }}
                  placeholder={formatMsg('Please enter your mobile phone number')}
                />
              </Form.Item>
              <Form.Item>
                {isSuper
                  ? (
                    <Button type="primary" htmlType="submit" block>
                      <FormattedMsg id="Update basic information" />
                    </Button>
                  )
                  : (
                    <Button type="primary" onClick={showMsg} block>
                      <FormattedMsg id="Update basic information" />
                    </Button>
                  )}
              </Form.Item>
            </Form>
          </div>
          <div className={styles.right}>
            <div className={styles.avatar}>
              {tx
                ? <Avatar src={tx} style={{ width: 144, height: 144 }} />
                : (
                  <img
                    alt="avatar"
                    width={144}
                    height={144}
                    src={avatar}
                  />
                )}
            </div>
            <Upload
              name="file"
              action={`${SERVER_URL}/api/v0/files/upload/free`}
              onChange={onUpload}
              showUploadList={false}
            >
              <Button disabled={!isSuper} icon={<UploadOutlined />}>
                <FormattedMsg id="Replace the avatar" />
              </Button>
            </Upload>
          </div>
        </section>
      </Spin>
    </div>
  )
}

export default connect(({ user }: ConnectState) => ({
  currentUser: user.currentUser,
  isLoading: user.isLoading,
}))(Modify)
