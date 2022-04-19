import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { v4 as uuidV4 } from "uuid";
import CodeFinder from "./apis/CodeFinder";

const Creator = () => {
  const [id, setId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await CodeFinder.post("/", {
          id: uuidV4(),
          code: "system.out.println('Hello World!')",
        });

        setId(response.data.data.code.id);

      //  console.log(response);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {/* Wait until the id is set so we know document has been created */}
      {id !== null ? <Navigate to={`/code/${id}`} /> : <div>loading..</div>}
    </div>
  );
};

export default Creator;
