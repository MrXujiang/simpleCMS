import React, { useState, ChangeEvent, useEffect, Fragment } from 'react'
import { Spin, Button } from 'antd'
import { connect, Dispatch } from 'umi'

import Billboards from '@/components/advert/billboards'
import { ConnectState } from '@/models/connect'
import { AdvertInfo } from '@/models/advert'
import FormattedMsg from '@/components/reactIntl/FormattedMsg'

interface AdvertProps {
  advertInfo: AdvertInfo
  dispatch: Dispatch
  isLoading: boolean
}

const Advert: (props: AdvertProps) => JSX.Element = ({ advertInfo, dispatch, isLoading }) => {
  // console
  const [topLink, setTopLink] = useState<string>('')
  const [topDesc, setTopDesc] = useState<string>('')
  const [sideLink, setSiderLink] = useState<string>('')
  const [sideDesc, setSiderDesc] = useState<string>('')

  const changeTopLink: (e: ChangeEvent<HTMLInputElement>) => void = ({ target }) => setTopLink(target.value)
  const changeTopDesc: (e: ChangeEvent<HTMLInputElement>) => void = ({ target }) => setTopDesc(target.value)
  const changeSideLink: (e: ChangeEvent<HTMLInputElement>) => void = ({ target }) => setSiderLink(target.value)
  const changeSideDesc: (e: ChangeEvent<HTMLInputElement>) => void = ({ target }) => setSiderDesc(target.value)

  const publish: () => void = () => {
    const payload = { topLink, topDesc, sideLink, sideDesc }
    dispatch({ type: 'advert/publishAdvert', payload })
  }

  useEffect(() => {
    dispatch({ type: 'advert/getAdvertInfo' }).then((info: AdvertInfo) => {
      setTopLink(info.topLink)
      setTopDesc(info.topDesc)
      setSiderLink(info.sideLink)
      setSiderDesc(info.sideDesc)
    })
  }, [])

  return (
    <Spin spinning={isLoading}>
      <Fragment>
        <Billboards
          title="Top advertisement"
          link={topLink}
          desc={topDesc}
          imgUrl={advertInfo.topImgUrl}
          handleChangeLink={changeTopLink}
          handleChangeDesc={changeTopDesc}
        />
        <Billboards
          title="Side advertisement"
          link={sideLink}
          desc={sideDesc}
          imgUrl={advertInfo.sideImgUrl}
          handleChangeLink={changeSideLink}
          handleChangeDesc={changeSideDesc}
        />
        <Button type="primary" onClick={publish} style={{ margin: '30px 100px 0 0', float: 'right' }}>
          <FormattedMsg id="Publish advertisement" />
        </Button>
      </Fragment>
    </Spin>
  )
}

export default connect(({ advert }: ConnectState) => ({
  isLoading: advert.isLoading,
  advertInfo: advert.advertInfo,
}))(Advert)