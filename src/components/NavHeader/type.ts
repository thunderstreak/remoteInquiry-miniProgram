import React from 'react'

export interface NavHeaderProps {
  className?: string;
  iconClassName?: string;
  back?: boolean | Function;
  title?: string | React.ReactNode;
}
