import { View, Text } from 'react-native'
import React from 'react'
import ParallaxImg from './ParallaxImg'

const Parallax = ({ layers }) => {
  return (
    <>
    {layers.reverse().map((layer, index) => (
        <ParallaxImg key={`layer_${index}`} img={layer} zIndex={index + 1}/>
      ))}
    </>
  )
}

export default Parallax;