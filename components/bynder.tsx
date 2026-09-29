"use client";
// Builder.io React Gen1 SDK example
import { Builder } from '@builder.io/react'

Builder.registerComponent(
  (props: any) => {
    const asset = props.bynderAsset?.assets?.[0]
    if (!asset) {
      return 'Choose an Image' // or render a placeholder image
    }

    // Prefer the derivative picked in the Bynder modal, then fall back to webImage
    const file =
      props.bynderAsset.additionalInfo?.selectedFile ??
      asset.files?.webImage ??
      asset.files?.original
    if (!file?.url) {
      return 'Choose an Image'
    }

    return (
      <img
        {...props.attributes}
        src={file.url}
        width={file.width}
        height={file.height}
        alt={asset.description || asset.name || ''}
      />
    )
  },
  {
    name: 'BynderImage',
    image:
      'https://unpkg.com/css.gg@2.0.0/icons/svg/image.svg',
    inputs: [{
      name: 'bynderAsset',
      friendlyName: 'Bynder Asset',
      type: 'BynderAsset'
    }],
  }
)

Builder.register('insertMenu', {
  name: 'Bynder',
  items: [{ name: 'BynderImage', item: 'BynderImage' }],
})