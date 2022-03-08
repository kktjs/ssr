import React from "react";
import { useSelector } from 'react-redux'

const Home = () => {
  const title = useSelector(({ login }) => login.title)

  const [count, setCount] = React.useState(1)

  const onClick = () => {
    console.log(title)
    setCount(pre => pre + 1)
  }

  return <div>home {title}<button onClick={onClick} >点击更新{count}</button></div>
}
export default Home;