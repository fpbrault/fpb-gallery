import createImageUrlBuilder from '@sanity/image-url'
import React, {useMemo} from 'react'
import {useClient} from 'sanity'

export function PreviewImage(props: { renderDefault?: any; media?: any }) {
  
  const {media} = props
  const client = useClient({apiVersion: '2021-03-25'})
  
  const imageUrlBuilder = useMemo(() =>
      createImageUrlBuilder(client),
      [client])

  const imgSrc = useMemo(() =>
      media?._ref && imageUrlBuilder.image(media?._ref)
      .width(500)
      .url(),
      [media?._ref, imageUrlBuilder]
)

  if (!imgSrc) {
    return null
  }
  
  const newProps = {
    ...props,
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    media: <img src={imgSrc} />,
  }

  return props.renderDefault(newProps)
}