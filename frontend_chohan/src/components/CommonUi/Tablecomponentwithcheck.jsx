import React, { useState } from 'react';
import { Table, Checkbox, Button } from 'antd';

const TableComponentwithcheckbox = ({ list, columns, paginatedThunk, csvFileName, onClose }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const handleCheckboxChange = (key) => {
    const newSelectedRowKeys = [...selectedRowKeys];
    if (newSelectedRowKeys.includes(key)) {
      const index = newSelectedRowKeys.indexOf(key);
      newSelectedRowKeys.splice(index, 1);
    } else {
      newSelectedRowKeys.push(key);
    }
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const handleSelectAllChange = () => {
    if (selectedRowKeys.length === list.length) {
      setSelectedRowKeys([]);
    } else {
      const allKeys = list.map((item) => item.ID);
      setSelectedRowKeys(allKeys);
    }
  };

  const handleClickButton = () => {
    const selectedData = list.filter((item) => selectedRowKeys.includes(item.ID));
    console.log('Selected Data:', selectedData);
    onClose(selectedData); // Pass selected data to parent component
  };

  const columnsWithCheckbox = [
    {
      title: (
        <Checkbox
          indeterminate={selectedRowKeys.length > 0 && selectedRowKeys.length < list.length}
          checked={selectedRowKeys.length === list.length}
          onChange={handleSelectAllChange}
        />
      ),
      dataIndex: 'checkbox',
      key: 'checkbox',
      width: 50,
      render: (text, record) => (
        <Checkbox
          checked={selectedRowKeys.includes(record.ID)}
          onChange={() => handleCheckboxChange(record.ID)}
        />
      ),
    },
    ...columns,
  ];

  return (
    <>
      <Table
        rowKey="ID"
        columns={columnsWithCheckbox}
        dataSource={list}
        pagination={{ onChange: paginatedThunk }}
      />
      <div style={{ marginTop: 16, textAlign: 'right' }}>
        <Button type="primary" onClick={handleClickButton}>
          Add Booking
        </Button>
      </div>
    </>
  );
};

export default TableComponentwithcheckbox;
