import { Select } from "antd";
import React from "react";

const FilterInput = ({ optionList }) => {
  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
  return (
    <Select
      showSearch
      placeholder="Select a person"
      optionFilterProp="children"
      filterOption={filterOption}
      options={optionList}
    />
  );
};

export default FilterInput;
