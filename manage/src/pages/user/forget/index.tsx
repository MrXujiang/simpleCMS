import React, { useCallback, FC, useContext } from 'react'
import { history, connect, Dispatch } from 'umi'
import { Form, Input, Button } from 'antd'
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons'

import FormattedMsg from '@/components/reactIntl/FormattedMsg'
import { IntlContext } from '@/utils/context/intl'
import { ConnectState } from '@/models/connect'

import styles from '../index.less'

interface ForgetFormProps {
  dispatch: Dispatch
  isLoading: boolean
}

interface ForgetFormValues {
  username: string
  password: string
  confirm: string
  email: string
}

const ForgetForm: FC<ForgetFormProps> = ({ dispatch, isLoading }) => {
  const formatMsg = useContext<any>(IntlContext)

  const onFinish: (data: ForgetFormValues) => void = useCallback(values => {
    dispatch({ type: 'user/forget', payload: values }).then(() => history.replace('/user/login'))
  }, [])

  const go: () => void = useCallback(() => history.push('/user/login'), [])

  return (
    <Form
      name="forgetForm"
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
      <Form.Item
        name="confirm"
        dependencies={['password']}
        rules={[
          {
            required: true,
            message: <FormattedMsg id="Please confirm your password" />,
          },
          ({ getFieldValue }) => ({
            validator(rule, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve()
              }
              return Promise.reject(<FormattedMsg id="The two passwords you entered do not match" />)
            },
          }),
        ]}
      >
        <Input.Password
          prefix={<LockOutlined className={styles.icon} />}
          placeholder={formatMsg('Please confirm your password')}
        />
      </Form.Item>
      <Form.Item
        name="email"
        rules={[
          {
            type: 'email',
            message: <FormattedMsg id="Invalid email" />,
          },
          {
            required: true,
            message: <FormattedMsg id="Please enter your email address" />,
          },
        ]}
      >
        <Input
          prefix={<MailOutlined className={styles.icon} />}
          placeholder={formatMsg('Please enter your email address')}
        />
      </Form.Item>

      <Form.Item>
        <Button block type="primary" htmlType="submit" loading={isLoading}>
          <FormattedMsg id="Confirm" />
        </Button>
        <div className={styles.otherWay}>
          <span className={styles.forgotText} onClick={go}>
            <FormattedMsg id="You already have an account, to login" />
          </span>
        </div>
      </Form.Item>
    </Form>
  )
}

export default connect(({ user }: ConnectState) => ({
  isLoading: user.isLoading,
}))(ForgetForm)