import React from 'react'
   
import { Avatar as AntAvatar} from 'antd'
import { AvatarProps } from 'antd/lib';
import { getNameInitials } from '@/utilities';
type props = AvatarProps &{
    name?: string;
}
const CustomAvatar = ({name, style, ...rest}:props) => {
  return (
    <AntAvatar alt={name} size="small" style={{background: '#87d068',
      display: 'flex',
      alignItems: 'center',
      border: 'none',
      ...style
    }}
    {...rest}>
      {getNameInitials(name || '')}
      
    </AntAvatar>
  )
}

export default CustomAvatar
