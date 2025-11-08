import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import React from "react";

const SimpleButton = ({ update, title }) => {
  return (
    <>
      <button
        className={`xs:px-3 px-1 text-sm md:text-base py-1 lg:px-5  border 
           bg-violet-700
        hover:bg-violet-500 text-white rounded cursor-pointer`}
        type="button"
      >
        <div className="flex items-center justify-center gap-2">
          {update ? <EditOutlined /> : <PlusOutlined />}
          <div className="min-w-[110px]">{title}</div>
        </div>
      </button>
    </>
  );
};

export default SimpleButton;
