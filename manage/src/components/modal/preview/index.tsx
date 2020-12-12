import React, { FC } from 'react'
import { Modal, Avatar } from 'antd'
import ForEditor from 'for-editor'

import FormattedMsg from '@/components/reactIntl/FormattedMsg'
import { ArticleType } from '@/models/article'
import { CurrentUser } from '@/models/user'
import avatar from '@/assets/avatar.svg'

import styles from './index.less'

interface PreviewModalProps {
  visible: boolean
  imageUrl: string
  formValues: ArticleType
  time: any
  curTab: string
  markdown: string
  editorState: any
  currentUser: CurrentUser
  onCancel: () => void
}

const PreviewModal: FC<PreviewModalProps> = ({
  visible,
  imageUrl,
  formValues,
  time,
  curTab,
  markdown,
  editorState,
  currentUser,
  onCancel,
}) => {
  return (
    <Modal
      centered
      wrapClassName={styles.wrapClassName}
      style={{ minWidth: 968 }}
      visible={visible}
      onCancel={onCancel}
      footer={null}
    >
      <div className={styles.image}>
        <img src={imageUrl} alt="face_img" />
      </div>
      <h1>{formValues.title}</h1>
      <div className={styles.desc}>
        <div>
          <Avatar size="small" className={styles.avatar} src={currentUser.tx || avatar} alt="avatar" />
          <span className={styles.author}>{formValues.author}</span>
          <span>{time}</span>
        </div>
        <div>
          111<FormattedMsg id="Comments" />&nbsp;
          123<FormattedMsg id="Likes" />&nbsp;
          333<FormattedMsg id="Collections" />&nbsp;
          123<FormattedMsg id="Views" />
        </div>
      </div>
      {curTab === 'edit' ? <div dangerouslySetInnerHTML={{ __html: editorState.toHTML() }} /> : (
        <ForEditor
          preview
          value={markdown}
          height="100%"
          style={{ border: 'none', boxShadow: 'none' }}
          toolbar={{}}
        />
      )}
    </Modal>
  )
}

export default PreviewModal