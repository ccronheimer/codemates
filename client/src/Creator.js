import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { v4 as uuidV4 } from "uuid";
import CodeFinder from "./apis/CodeFinder";

const Creator = () => {
  const [id, setId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {

        // init place holde code 
        const response = await CodeFinder.post("/", {
          id: uuidV4(),
          code: '# \n' +
          '# PLACE HOLDER CODE\n' +
          '# \n' +
          '\n' +
          'import banana\n' +
          '\n' +
          '\n' +
          'class Monkey:\n' +
          '    # Bananas the monkey can eat.\n' +
          '    capacity = 10\n' +
          '    def eat(self, n):\n' +
          '        """Make the monkey eat n bananas!"""\n' +
          '        self.capacity -= n * banana.size\n' +
          '\n' +
          '    def feeding_frenzy(self):\n' +
          '        self.eat(9.25)\n' +
          '        return "Yum yum"\n' +
          '      \n'
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
