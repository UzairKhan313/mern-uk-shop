import React from 'react'
import { Helmet } from 'react-helmet-async'

const Meta = ({ title, description, keyword }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keyword" content={keyword} />
    </Helmet>
  )
}

Meta.defaultProps = {
  title: 'Wellcome to UK SHOP',
  description: 'We sell the best product for cheap',
  keyword: 'Electronics, buy electronics, cheap electronics',
}

export default Meta
