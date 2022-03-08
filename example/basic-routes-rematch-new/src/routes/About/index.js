import React from "react";
import { useSelector } from 'react-redux'

const About = () => {
  const title = useSelector(({ demo }) => demo.title)

  return <div>About {title}</div>
}
export default About;