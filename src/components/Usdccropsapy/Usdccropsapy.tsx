import React from 'react'
import usdccropsapy from '../../assets/img/usdccropsapy.png'

interface UsdccropsapyProps {
  size?: number
  v1?: boolean
  v2?: boolean
  v3?: boolean
}

const Usdccropsapy: React.FC<UsdccropsapyProps> = ({ size = 36, v1, v2, v3 }) => (

  <img src={usdccropsapy} height="300" style={{ marginTop: 0 }} />  
  
)

export default Usdccropsapy
