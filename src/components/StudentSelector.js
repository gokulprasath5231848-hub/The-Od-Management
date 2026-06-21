'use client';

import { useState, useMemo } from 'react';
import compStyles from '@/styles/components.module.css';

export default function StudentSelector({ students = [], selectedIds = [], onSelectionChange }) {
  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('');

  const departments = useMemo(() => {
    const depts = new Set(students.map(s => s.departmentId).filter(Boolean));
    return Array.from(depts);
  }, [students]);

  const filtered = useMemo(() => {
    return students.filter(s => {
      const matchesSearch = !search ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.rollNo?.toLowerCase().includes(search.toLowerCase());
      const matchesDept = !filterDept || s.departmentId === filterDept;
      return matchesSearch && matchesDept;
    });
  }, [students, search, filterDept]);

  const toggleStudent = (id) => {
    const newIds = selectedIds.includes(id)
      ? selectedIds.filter(sid => sid !== id)
      : [...selectedIds, id];
    onSelectionChange?.(newIds);
  };

  const selectAll = () => {
    const allFilteredIds = filtered.map(s => s.id);
    const merged = new Set([...selectedIds, ...allFilteredIds]);
    onSelectionChange?.(Array.from(merged));
  };

  const deselectAll = () => {
    const filteredIds = new Set(filtered.map(s => s.id));
    onSelectionChange?.(selectedIds.filter(id => !filteredIds.has(id)));
  };

  return (
    <div className={compStyles.studentSelector}>
      <div className={compStyles.studentSelectorHeader}>
        <input
          className={compStyles.studentSelectorSearch}
          type="text"
          placeholder="Search students..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className={compStyles.studentSelectorFilter}
          value={filterDept}
          onChange={(e) => setFilterDept(e.target.value)}
        >
          <option value="">All Departments</option>
          {departments.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      <div className={compStyles.studentSelectorActions}>
        <button className={compStyles.btnSmall} onClick={selectAll}>Select All</button>
        <button className={compStyles.btnSmall} onClick={deselectAll}>Deselect All</button>
      </div>

      <div className={compStyles.studentSelectorList}>
        {filtered.map(student => {
          const isSelected = selectedIds.includes(student.id);
          return (
            <div
              key={student.id}
              className={`${compStyles.studentSelectorItem} ${isSelected ? compStyles.studentSelectorItemSelected : ''}`}
              onClick={() => toggleStudent(student.id)}
            >
              <input
                type="checkbox"
                className={compStyles.studentSelectorCheckbox}
                checked={isSelected}
                readOnly
              />
              <div>
                <div className={compStyles.studentSelectorItemName}>{student.name}</div>
                <div className={compStyles.studentSelectorItemRoll}>{student.rollNo}</div>
              </div>
              <span className={compStyles.studentSelectorItemClass}>{student.classId}</span>
              <span className={compStyles.studentSelectorItemDept}>{student.departmentId}</span>
            </div>
          );
        })}
      </div>

      <div className={compStyles.studentSelectorFooter}>
        <span className={compStyles.studentSelectorCount}>
          <span className={compStyles.studentSelectorCountNum}>{selectedIds.length}</span> student{selectedIds.length !== 1 ? 's' : ''} selected
        </span>
      </div>
    </div>
  );
}
