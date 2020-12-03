import React, { useContext, useCallback, useState, FC, ChangeEvent, useMemo } from 'react'
import { Input, Upload, message } from 'antd'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'

import FormattedMsg from '@/components/reactIntl/FormattedMsg'
import { IntlContext } from '@/utils/context/intl'

import styles from './index.less'

const getBase64: (img: any, cb: any) => void = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

interface BillboardsProps {
  title: string
  link: string
  desc: string
  imgUrl: string
  handleChangeLink: (e: ChangeEvent<HTMLInputElement>) => void
  handleChangeDesc: (e: ChangeEvent<HTMLInputElement>) => void
}

const Billboards: FC<BillboardsProps> = ({
  title,
  link,
  desc,
  imgUrl,
  handleChangeLink,
  handleChangeDesc,
}) => {
  const formatMsg = useContext<any>(IntlContext)
  const [imageUrl, setImageUrl] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const beforeUpload: ((file: any) => boolean | PromiseLike<void>) | undefined = useCallback(file => {2
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
      message.error(formatMsg('You can only upload JPG/PNG file'))
    }
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
      message.error(formatMsg('Image must smaller than 2MB'))
    }
    return isJpgOrPng && isLt2M
  }, [formatMsg])

  const handleChange = (info: any) => {
    if (info.file.status === 'uploading') {
      setLoading(true)      
      return
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (imageUrl: string) => {
        setImageUrl(imageUrl)
        setLoading(false)
      })
    }
  }

  const uploadButton = useMemo(() => (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>
        <FormattedMsg id="Upload" />
      </div>
    </div>
  ), [loading])

  return (
    <div>
      <header className={styles.header}>
        <FormattedMsg id={title} />
      </header>
      <div className={styles.item}>
        <div className={styles.label}>
          <FormattedMsg id="Link" />
        </div>
        <Input
          className={styles.control}
          placeholder={formatMsg('Please enter the link')}
          onChange={handleChangeLink}
          value={link}
        />
      </div>
      <div className={styles.item}>
        <div className={styles.label}>
          <FormattedMsg id="Picture" />
        </div>
        <Upload
          name="avatar"
          listType="picture-card"
          className={styles.uploader}
          showUploadList={false}
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          beforeUpload={beforeUpload}
          onChange={handleChange}
        >
          {imageUrl || imgUrl ? <img src={imageUrl || imgUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
        </Upload>
      </div>
      <div className={styles.item}>
        <div className={styles.label}>
          <FormattedMsg id="Text description" />
        </div>
        <Input
          className={styles.control}
          placeholder={formatMsg('Please enter a description')}
          onChange={handleChangeDesc}
          value={desc}
        />
      </div>
    </div>
  )
}

export default Billboards