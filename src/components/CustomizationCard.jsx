import React from 'react'

export default function CustomizationCard({ item, selected, onSelect, variant = 'default' }) {
  const classNames = ['card', selected ? 'selected' : '', variant ? `card--${variant}` : ''].join(' ')
  return (
    <div className={classNames} onClick={() => onSelect(item)}>
      <div className="card-img">
        <img src={item.image || '/assets/placeholder.png'} alt={item.title} />
      </div>
      <div className="card-title">{item.title}</div>
    </div>
  )
}
