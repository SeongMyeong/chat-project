import service from '../../service/terra'

const circulatingSupply = async (req, res) => {
  // return res.json()
  const { code, success, data } = await service.circulatingSupply({
    ...req.body,
  })

  return res.status(code).json({ success, data })
}

const totalSupply = async (req, res) => {
  // return res.json()
  const { code, success, data } = await service.totalSupply({
    ...req.body,
  })

  return res.status(code).json({ success, data })
}

module.exports = {
  circulatingSupply,
  totalSupply,
}
