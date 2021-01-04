import React, { useMemo } from 'react'
import { Modal, Avatar, Popover } from 'antd'
import classnames from 'classnames'
import ForEditor from 'for-editor'

import FormattedMsg from '@/components/reactIntl/FormattedMsg'
import { ArticleType } from '@/models/article'
import { CurrentUser } from '@/models/user'
import avatar from '@/assets/avatar.svg'
import reward from '@/assets/reward.png'
import heart from '@/assets/heart.svg'
import star from '@/assets/star.svg'
import tag from '@/assets/tag.svg'

import styles from './index.less'

interface PreviewModalProps {
  visible: boolean
  faceImg: string
  payCode: string
  formValues: ArticleType
  time: any
  curTab: string
  markdown: string
  editorState: any
  currentUser: CurrentUser
  onCancel: () => void
}

const PreviewModal: React.FC<PreviewModalProps> = ({
  visible,
  faceImg,
  payCode,
  formValues,
  time,
  curTab,
  markdown,
  editorState,
  currentUser,
  onCancel,
}) => {
  const payCodeImg = useMemo(() => <img src={payCode} alt="payCode" width={152} height={152} />, [payCode])

  return (
    <Modal
      centered
      wrapClassName={styles.preview}
      style={{ minWidth: 968 }}
      visible={visible}
      onCancel={onCancel}
      footer={null}
    >
      {faceImg && (
        <div className={styles.img}>
          <img src={faceImg} alt="face_img" width="100%" height="100%" />
        </div>
      )}
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
      {curTab === 'edit'
        ? <div dangerouslySetInnerHTML={{ __html: editorState.toHTML() }} />
        : (
          <div className={styles.forEditor}>
            <ForEditor
              preview
              value={markdown}
              height="100%"
              style={{ border: 'none', boxShadow: 'none' }}
              toolbar={{}}
            />
          </div>
        )}
      <div className={styles.labels}>
        {formValues.label && formValues.label.map(l => (
          <span key={l} className={styles.label}>
            <img src={tag} alt="tag_img" />
            {l}
          </span>
        ))}
      </div>
      <div className={styles.exceptional}>
        <div className={styles.text}>
          <FormattedMsg id="Reward authors and encourage them to work harder!" />
        </div>
        {payCode
          ? (
            <Popover content={payCodeImg} trigger="click">
              <img className={styles.rewardImg} src={reward} alt="reward_img" />
            </Popover>
          )
          : <img className={styles.rewardImg} src={reward} alt="reward_img" />}
        <div className={classnames(styles.text, styles.already)}>
          <FormattedMsg id="Has exceptional" values={{ count: 99 }} />
        </div>
        <div className={styles.actions}>
          <img src={heart} width={20} height={20} alt="heart" />&nbsp;102
          &nbsp;&nbsp;
          <img src={star} width={20} height={20} alt="star" />&nbsp;132
        </div>
      </div>
    </Modal>
  )
}

export default PreviewModal
