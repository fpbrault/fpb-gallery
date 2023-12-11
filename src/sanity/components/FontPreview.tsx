// FontPreview.js

import React, { useCallback, useEffect, useState } from 'react';
import { Box, Card, Select, Tooltip, Text, Stack } from '@sanity/ui'
import schemaTypes from '../schemas/index';
import { TextInput, set, unset } from 'sanity';
import { getFontFamily } from '@/components/FontLoader';

const FontPreview = (props: any) => {
    const { elementProps, onChange, value = '' } = props
    const [testText, setTestText] = useState("My Voice is my passport")

    const handleChange = useCallback((event: any) => {
        const nextValue = event.currentTarget.value
        onChange(nextValue ? set(nextValue) : unset())
    }, [onChange])
    const fontStyle = getFontFamily(props.value)
    return (
        <Stack space={[2]}>
            <Select
                onChange={handleChange}
                value={value}
            >
                {props.schemaType.options.list.map((listOption: any) => {
                    return <option key={listOption.value} value={listOption.value}>{listOption.title}</option>
                })}
            </Select>
            <div {...getFontFamily(props.value)} >
                <label htmlFor="textPreviewInput">Font Preview</label>
                <input name="textPreviewInput" style={{ paddingLeft:"16px", borderRadius: "6px", background: "white", color: "black", fontSize: 24, width: "100%" }} value={testText} onChange={e => setTestText(e.target.value)} ></input>
                <Card padding={4} style={{textAlign: 'center'}}>
  <Text >
    <Tooltip
      content={
        <Box padding={2}>
          <Text muted size={1}>
          <Stack {...getFontFamily(props.value)} space={[1]}>
                <span style={{  fontSize: 16 }}>{testText}</span>
                <span style={{  fontSize: 24 }}>{testText}</span>
                <span style={{  fontSize: 40 }}>{testText}</span>
                <span style={{  fontSize: 64 }}>{testText}</span>
                </Stack>
          </Text>
        </Box>
      }
      fallbackPlacements={['right', 'left']}
      placement="top"
      portal
    >
      <span style={{display: 'inline-block'}}>
        Hover here to see more examples
      </span>
    </Tooltip>
  </Text>
</Card>
               
                </div>
        </Stack >
    );
};

export default FontPreview;
