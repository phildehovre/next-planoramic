import Spinner from "@/components/ui/Spinner";
import React from "react";

const loading = () => {
  return (
    <div>
      <Spinner loading={true} />
    </div>
  );
};

export default loading;
