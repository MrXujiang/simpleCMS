import React, { useCallback, FC } from 'react'
import { throttle } from 'lodash'
import { history, connect, Dispatch } from 'umi'
import { Form, Input, Button, message } from 'antd'
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons'

import FormattedMsg from '@/components/reactIntl/FormattedMsg'
import { ConnectState } from '@/models/connect'

import styles from '../index.less'

interface LoginFormProps {
  dispatch: Dispatch
  isLoading: boolean
}

interface LoginFormValues {
  username: string
  password: string
}

const LoginForm: FC<LoginFormProps> = ({ dispatch, isLoading }) => {
  const onFinish: (data: LoginFormValues) => void = useCallback(throttle(values => {
    dispatch({ type: 'user/login', payload: values }).then(res => {
      if (res.token) {
        message.success('成功登录')
        history.push('/dashboard')
      }
    })
  }, 1000), [])

  const go = useCallback(() => history.push('/user/forget'), [])

  return (
    <Form
      name="loginForm"
      className={styles.form}
      onFinish={onFinish}
    >
      <Form.Item
        name="username"
        rules={[{ required: true, message: <FormattedMsg id="Please enter your username" /> }]}
      >
        <Input
          className={styles.input}
          prefix={<UserOutlined className={styles.icon} />}
          placeholder="admin"
        />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: <FormattedMsg id="Please enter your password" /> }]}
      >
        <Input
          className={styles.input}
          prefix={<LockOutlined className={styles.icon} />}
          type="password"
          placeholder="cms"
        />
      </Form.Item>

      <Form.Item>
        <Button block type="primary" htmlType="submit" loading={isLoading}>
          <FormattedMsg id="Login" />
        </Button>
        <div className={styles.otherWay}>
          <FormattedMsg id="Other login methods" /> <MailOutlined className={styles.emailIcon} />
          <span className={styles.forgotText} onClick={go}>
            <FormattedMsg id="Forgot password" />
          </span>
        </div>
      </Form.Item>
    </Form>
  )
}

export default connect(({ user }: ConnectState) => ({
  isLoading: user.isLoading,
}))(LoginForm)