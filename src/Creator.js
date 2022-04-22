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
          code: '/*\n' +
          '  Basic Java example using FizzBuzz\n' +
          '*/\n' +
          '\n' +
          'import java.util.Random;\n' +
          '\n' +
          'public class Example {\n' +
          '  public static void main (String[] args){\n' +
          '    // Generate a random number between 1-100. (See generateRandomNumber method.)\n' +
          '    int random = generateRandomNumber(100);\n' +
          '\n' +
          '    // Output generated number.\n' +
          '    System.out.println("Generated number: " + random + "\\n");\n' +
          '\n' +
          '    // Loop between 1 and the number we just generated.\n' +
          '    for (int i=1; i<=random; i++){\n' +
          '      // If i is divisible by both 3 and 5, output "FizzBuzz".\n' +
          '      if (i % 3 == 0 && i % 5 == 0){\n' +
          '        System.out.println("FizzBuzz");\n' +
          '      }\n' +
          '      // If i is divisible by 3, output "Fizz"\n' +
          '      else if (i % 3 == 0){\n' +
          '        System.out.println("Fizz");\n' +
          '      }\n' +
          '      // If i is divisible by 5, output "Buzz".\n' +
          '      else if (i % 5 == 0){\n' +
          '        System.out.println("Buzz");\n' +
          '      }\n' +
          '      // If i is not divisible by either 3 or 5, output the number.\n' +
          '      else {\n' +
          '        System.out.println(i);\n' +
          '      }\n' +
          '    }\n' +
          '  }\n' +
          '\n' +
          '  /**\n' +
          '    Generates a new random number between 0 and 100.\n' +
          '    @param bound The highest number that should be generated.\n' +
          '    @return An integer representing a randomly generated number between 0 and 100.\n' +
          '  */\n' +
          '  private static int generateRandomNumber(int bound){\n' +
          '    // Create new Random generator object and generate the random number.\n' +
          '    Random randGen = new Random();\n' +
          '    int randomNum = randGen.nextInt(bound);\n' +
          '\n' +
          '    // If the random number generated is zero, use recursion to regenerate the number until it is not zero.\n' +
          '    if (randomNum < 1){\n' +
          '      randomNum = generateRandomNumber(bound);\n' +
          '    }\n' +
          '\n' +
          '    return randomNum;\n' +
          '  }\n' +
          '}\n' +
          ' ',
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
