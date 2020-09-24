import React from 'react'

interface DaikonIconProps {
  size?: number
  v1?: boolean
  v2?: boolean
  v3?: boolean
}

const DaikonIcon: React.FC<DaikonIconProps> = ({ size = 36, v1, v2, v3 }) => (
  <span
    role="img"
    style={{
      fontSize: size,
      filter: v1 ? 'saturate(0.5)' : undefined,
    }}
  >
    <img src="daikon-icon-med.png" alt="DAIKON" />
  </span>
)

export default DaikonIcon
