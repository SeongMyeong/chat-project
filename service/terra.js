import statusCode from '../util/statusCode'
import { verifyRequiredParams } from '../util'
import axios from 'axios'
/* 전체 방 리스트 */
const circulatingSupply = async params => {
  //verifyRequiredParams(params)
  try {
    const data = await axios.get(
      'https://fcd.terra.dev/v1/circulatingsupply/luna',
    )
    console.log(data)
    return {
      code: statusCode.OK,
      data: data.data,
      success: true,
    }
  } catch (e) {
    return {
      code: statusCode.BAD_REQUEST,
      data: e,
      success: false,
    }
  }
}

const totalSupply = async params => {
  //verifyRequiredParams(params)
  try {
    const data = await axios.get('https://fcd.terra.dev/v1/totalsupply/luna')
    console.log(data)
    return {
      code: statusCode.OK,
      data: data.data,
      success: true,
    }
  } catch (e) {
    return {
      code: statusCode.BAD_REQUEST,
      data: e,
      success: false,
    }
  }
}

module.exports = {
  circulatingSupply,
  totalSupply,
}
