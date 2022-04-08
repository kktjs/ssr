import React from "react";
import { useSelector } from 'react-redux'
import { RootState } from "./../../models"
const About = () => {
  const title = useSelector<RootState>((store) => store.demo.title)
  return <div>About {title}</div>
}
export default About;