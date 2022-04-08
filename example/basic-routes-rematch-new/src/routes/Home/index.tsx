import React from "react";
import { useSelector } from 'react-redux'
import { RootState } from "./../../models"

const Home = () => {
  const title = useSelector<RootState>(({ login }) => login.title)

  const [count, setCount] = React.useState(1)

  const onClick = () => {
    console.log(title)
    setCount(pre => pre + 1)
  }

  return <div>home {title}<button onClick={onClick} >点击更新{count}</button></div>
}
export default Home;