import React, { useCallback, useContext, FC } from 'react'
import { throttle } from 'lodash'
import { history, connect, Dispatch } from 'umi'
import { Form, Input, Button } from 'antd'
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons'

import FormattedMsg from '@/components/reactIntl/FormattedMsg'
import { IntlContext } from '@/utils/context/intl'
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
  const formatMsg = useContext<any>(IntlContext)
  
  const onFinish: (data: LoginFormValues) => void = useCallback(throttle(values => {
    dispatch({ type: 'user/login', payload: values })
  }, 1000), [])

  const go = useCallback(() => history.push('/user/forget'), [])

  return (
    <Form
      name="loginForm"
      className={styles.form}
      onFinish={onFinish}
      initialValues={{
        username: 'test',
        password: '123456',
      }}
    >
      <Form.Item
        name="username"
        rules={[{ required: true, message: <FormattedMsg id="Please enter your username" /> }]}
      >
        <Input
          className={styles.input}
          prefix={<UserOutlined className={styles.icon} />}
          placeholder={formatMsg('Please enter your username')}
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
          placeholder={formatMsg('Please enter your password')}
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