import { LinkIcon } from '@sanity/icons'
import { Box, Text, Tooltip } from '@sanity/ui'
const LinkRenderer = (props: any) => {

  return (
    // the ToolTip component wraps the annotation 
    <Tooltip
    //we define the content in a Box, so we can add padding, and Text where we pass the href value in if present
      content={
        <div>
        <Box padding={3}>
          <span className='text-white link link-accent'>
            asdasd
            {`${props.value?.href}` || 'No url found'}
            </span>
          </Box>
        </div>
      }
      // then we define the placement and other options
      placement="bottom"
      fallbackPlacements={['right', 'left']}
      portal
    >
    <>
        <LinkIcon /> 

        <span className='link link-primary'>{props.renderDefault(props)}</span>
        </>
    </Tooltip>
  )
}

export default LinkRenderer