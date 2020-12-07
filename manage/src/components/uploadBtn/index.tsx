import React, { FC, useMemo } from 'react'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import FormattedMsg from '@/components/reactIntl/FormattedMsg'

interface UploadBtnProps {
  loading: boolean
}

const UploadBtn: FC<UploadBtnProps> = ({loading}) => {
  return useMemo(() =>(
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>
        <FormattedMsg id="Upload" />
      </div>
    </div>
  ), [loading])
}

export default UploadBtn