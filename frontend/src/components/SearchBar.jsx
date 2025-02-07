import React from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

const SearchBar = ({ searchTerm, onSearchChange, selectedPriority, onPriorityChange }) => {
  return (
    <div className="flex gap-2 mb-6">
      <div className="relative flex-1">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search tasks..."
          className="input-field pl-10"
        />
        <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>
      <select
        value={selectedPriority}
        onChange={(e) => onPriorityChange(e.target.value)}
        className="input-field max-w-[150px]"
      >
        <option value="">All Priorities</option>
        <option value="high">High Priority</option>
        <option value="medium">Medium Priority</option>
        <option value="low">Low Priority</option>
      </select>
    </div>
  )
}

export default SearchBar
