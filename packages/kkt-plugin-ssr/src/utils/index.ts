export const getHttpHost = () => {

  const HOST = process.env.HOST || 'localhost'
  const PORT = process.env.PORT || 3000

  const httpPath = `http://${HOST}:${PORT}`

  return httpPath
}