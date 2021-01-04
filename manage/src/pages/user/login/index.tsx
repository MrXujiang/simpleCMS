import React, { useCallback, useContext } from 'react'
import { history, connect, Dispatch } from 'umi'
import { Form, Input, Button } from 'antd'
import {
  UserOutlined,
  LockOutlined,
} from '@ant-design/icons'

import FormattedMsg from '@/components/reactIntl/FormattedMsg'
import { IntlContext } from '@/utils/context/intl'
import { ConnectState } from '@/models/connect'

import styles from './index.less'

interface LoginProps {
  dispatch: Dispatch
  isLoading: boolean
}

interface LoginFormValues {
  username: string
  password: string
}

const Login: React.FC<LoginProps> = ({ dispatch, isLoading }) => {
  const formatMsg = useContext<any>(IntlContext)

  const onFinish: (data: LoginFormValues) => void = useCallback(values => {
    dispatch({ type: 'user/login', payload: values }).then((res: any) => {
      if (res && res.uid) {
        localStorage.setItem('nickname', res.name)
        history.push('/dashboard')
      }
    })
  }, [])

  // const go = () => history.push('/user/forget')

  return (
    <Form
      name="loginForm"
      className={styles.form}
      onFinish={onFinish}
    >
      <Form.Item
        name="name"
        rules={[{ required: true, message: <FormattedMsg id="Please enter your username" /> }]}
      >
        <Input
          prefix={<UserOutlined />}
          placeholder={formatMsg('Please enter your username')}
        />
      </Form.Item>
      <Form.Item
        name="pwd"
        rules={[{ required: true, message: <FormattedMsg id="Please enter your password" /> }]}
      >
        <Input
          prefix={<LockOutlined />}
          type="password"
          placeholder={formatMsg('Please enter your password')}
        />
      </Form.Item>

      <Form.Item>
        <Button block type="primary" htmlType="submit" loading={isLoading}>
          <FormattedMsg id="Login" />
        </Button>
        {/* <div className={styles.otherWay}>
          <FormattedMsg id="Other login methods" /> <MailOutlined className={styles.emailIcon} />
          <span className={styles.forgotText} onClick={go}>
            <FormattedMsg id="Forgot password" />
          </span>
        </div> */}
      </Form.Item>
    </Form>
  )
}

export default connect(({ user }: ConnectState) => ({
  isLoading: user.isLoading,
}))(Login)
